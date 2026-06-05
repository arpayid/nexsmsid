import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser, RequestMeta } from "../auth/auth.types";
import { parseWithSchema } from "../common/validation";
import { PrismaService } from "../database/prisma.service";
import { listQuerySchema } from "../master-data/base-master-data.service";
import { NotificationEventService } from "../notifications/notification-event.service";
import { createPaymentSchema, rejectPaymentSchema, updatePaymentSchema, verifyPaymentSchema } from "./payments.dto";

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly auditService: AuditService,
    @Inject(NotificationEventService) private readonly notificationEvents: NotificationEventService
  ) {}

  async list(query: unknown) {
    const params = parseWithSchema(listQuerySchema, query);
    const where: Record<string, unknown> = {};
    const skip = (params.page - 1) * params.limit;

    if (params.search) {
      where.OR = [
        { paymentNumber: { contains: params.search, mode: "insensitive" } },
        { invoice: { student: { name: { contains: params.search, mode: "insensitive" } } } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where, skip, take: params.limit, orderBy: { createdAt: "desc" },
        include: { invoice: { include: { student: true } }, verifiedBy: true }
      }),
      this.prisma.payment.count({ where })
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async findById(id: string) {
    const item = await this.prisma.payment.findFirst({
      where: { id },
      include: { invoice: { include: { student: true } }, verifiedBy: true }
    });
    if (!item) throw new NotFoundException("Payment not found");
    return item;
  }

  async create(input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const data = parseWithSchema(createPaymentSchema, input);

    const invoice = await this.prisma.invoice.findFirst({ where: { id: data.invoiceId, deletedAt: null } });
    if (!invoice) throw new NotFoundException("Invoice not found");
    if (invoice.status === "CANCELLED") throw new BadRequestException("Cannot add payment to CANCELLED invoice");
    if (invoice.status === "PAID") throw new BadRequestException("Invoice is already PAID");

    const count = await this.prisma.payment.count();
    const now = new Date();
    const paymentNumber = `PAY-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(count + 1).padStart(5, "0")}`;

    const payment = await this.prisma.payment.create({
      data: {
        paymentNumber,
        invoiceId: data.invoiceId,
        amount: data.amount,
        method: data.method,
        paidAt: data.paidAt || now,
        proofUrl: data.proofUrl || null,
        note: data.note || null,
        status: "PENDING"
      },
      include: { invoice: { include: { student: true } } }
    });

    await this.auditService.record({ ...meta, actorId: actor.id, action: "payment.create", entity: "payment", entityId: payment.id, metadata: { paymentNumber, amount: data.amount } });
    return payment;
  }

  async update(id: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const existing = await this.findById(id);
    if (existing.status !== "PENDING") throw new BadRequestException("Only PENDING payments can be updated");

    const data = parseWithSchema(updatePaymentSchema, input);
    const payment = await this.prisma.payment.update({ where: { id }, data, include: { invoice: { include: { student: true } } } });
    await this.auditService.record({ ...meta, actorId: actor.id, action: "payment.update", entity: "payment", entityId: id, metadata: data });
    return payment;
  }

  async verify(id: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const payment = await this.findById(id);
    if (payment.status !== "PENDING") throw new BadRequestException("Only PENDING payments can be verified");

    const data = parseWithSchema(verifyPaymentSchema, input);
    const invoice = await this.prisma.invoice.findFirst({ where: { id: payment.invoiceId } });
    if (!invoice) throw new NotFoundException("Invoice not found");

    const currentPaid = Number(invoice.paidAmount);
    const newPaid = currentPaid + Number(payment.amount);
    const total = Number(invoice.total);

    if (newPaid > total) throw new BadRequestException("Payment would exceed invoice total");

    let invoiceStatus = invoice.status;
    if (newPaid >= total) invoiceStatus = "PAID";
    else if (newPaid > 0) invoiceStatus = "PARTIAL";

    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id },
        data: { status: "VERIFIED", verifiedAt: new Date(), verifiedById: actor.id, note: data.note || payment.note },
        include: { invoice: { include: { student: true } }, verifiedBy: true }
      }),
      this.prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: { paidAmount: newPaid, status: invoiceStatus }
      })
    ]);

    await this.auditService.record({ ...meta, actorId: actor.id, action: "payment.verify", entity: "payment", entityId: id, metadata: { invoiceStatus } });
    await this.notificationEvents.paymentStatusChanged(updatedPayment, actor, meta);
    return updatedPayment;
  }

  async reject(id: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const payment = await this.findById(id);
    if (payment.status !== "PENDING") throw new BadRequestException("Only PENDING payments can be rejected");

    const data = parseWithSchema(rejectPaymentSchema, input);
    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: "REJECTED", note: data.note || payment.note },
      include: { invoice: { include: { student: true } } }
    });

    await this.auditService.record({ ...meta, actorId: actor.id, action: "payment.reject", entity: "payment", entityId: id, metadata: { note: data.note } });
    await this.notificationEvents.paymentStatusChanged(updated, actor, meta);
    return updated;
  }

  async cancel(id: string, actor: AuthenticatedUser, meta: RequestMeta) {
    const payment = await this.findById(id);
    if (payment.status === "CANCELLED") throw new BadRequestException("Payment is already cancelled");

    if (payment.status === "VERIFIED") {
      const invoice = await this.prisma.invoice.findFirst({ where: { id: payment.invoiceId } });
      if (!invoice) throw new NotFoundException("Invoice not found");

      const currentPaid = Number(invoice.paidAmount);
      const newPaid = currentPaid - Number(payment.amount);
      const total = Number(invoice.total);

      let invoiceStatus = invoice.status;
      if (newPaid <= 0) invoiceStatus = "ISSUED";
      else if (newPaid < total) invoiceStatus = "PARTIAL";
      else invoiceStatus = "PAID";

      await this.prisma.$transaction([
        this.prisma.payment.update({ where: { id }, data: { status: "CANCELLED" } }),
        this.prisma.invoice.update({ where: { id: payment.invoiceId }, data: { paidAmount: newPaid, status: invoiceStatus } })
      ]);
    } else {
      await this.prisma.payment.update({ where: { id }, data: { status: "CANCELLED" } });
    }

    const updated = await this.findById(id);
    await this.auditService.record({ ...meta, actorId: actor.id, action: "payment.cancel", entity: "payment", entityId: id, metadata: {} });
    return updated;
  }
}
