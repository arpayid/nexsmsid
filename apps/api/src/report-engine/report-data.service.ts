import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReportDataResult } from './report-engine.types';

@Injectable()
export class ReportDataService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getData(reportCode: string, filters: Record<string, any>): Promise<ReportDataResult> {
    switch (reportCode) {
      case 'students-by-class':
        return this.getStudentsByClass(filters);
      case 'attendance-class-recap':
        return this.getAttendanceClassRecap(filters);
      case 'invoice-recap':
        return this.getInvoiceRecap(filters);
      case 'ppdb-registration-recap':
        return this.getPpdbRegistrationRecap(filters);
      case 'internship-recap':
        return this.getInternshipRecap(filters);
      case 'alumni-recap':
        return this.getAlumniRecap(filters);
      case 'payment-recap':
        return this.getPaymentRecap(filters);
      case 'outstanding-invoices':
        return this.getOutstandingInvoices(filters);
      case 'ppdb-status-recap':
        return this.getPpdbStatusRecap(filters);
      case 'expense-recap':
        return this.getExpenseRecap(filters);
      case 'grades-class-recap':
        return this.getGradesClassRecap(filters);
      case 'teacher-schedule-recap':
        return this.getTeacherScheduleRecap(filters);
      case 'cashflow-recap':
        return this.getCashflowRecap(filters);
      case 'ppdb-conversion-recap':
        return this.getPpdbConversionRecap(filters);
      case 'industry-partner-recap':
        return this.getIndustryPartnerRecap(filters);
      case 'discipline-violation-recap':
        return this.getDisciplineViolationRecap(filters);
      case 'student-discipline-summary':
        return this.getStudentDisciplineSummary(filters);
      case 'counseling-case-recap':
        return this.getCounselingCaseRecap(filters);
      case 'letter-recap':
        return this.getLetterRecap(filters);
      case 'outgoing-letter-recap':
        return this.getLetterRecap({ ...filters, direction: 'OUTGOING' });
      case 'incoming-letter-recap':
        return this.getLetterRecap({ ...filters, direction: 'INCOMING' });
      case 'letter-approval-recap':
        return this.getLetterApprovalRecap(filters);
      case 'inventory-item-recap':
        return this.getInventoryItemRecap(filters);
      case 'inventory-movement-recap':
        return this.getInventoryMovementRecap(filters);
      case 'inventory-maintenance-recap':
        return this.getInventoryMaintenanceRecap(filters);
      case 'inventory-loan-recap':
        return this.getInventoryLoanRecap(filters);
      case 'inventory-low-stock-recap':
        return this.getInventoryLowStockRecap(filters);
      case 'library-book-recap':
        return this.getLibraryBookRecap(filters);
      case 'library-copy-recap':
        return this.getLibraryCopyRecap(filters);
      case 'library-loan-recap':
        return this.getLibraryLoanRecap(filters);
      case 'library-overdue-loan-recap':
        return this.getLibraryOverdueLoanRecap(filters);
      case 'library-fine-recap':
        return this.getLibraryFineRecap(filters);
      case 'library-member-recap':
        return this.getLibraryMemberRecap(filters);
      case 'library-popular-book-recap':
        return this.getLibraryPopularBookRecap(filters);
      default:
        return this.getPlaceholderData(reportCode);
    }
  }

  private async getGradesClassRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      assessment: {
        teachingAssignment: {
          academicYearId: filters.academicYearId,
          semesterId: filters.semesterId,
          classroomId: filters.classroomId,
        },
      },
    };
    if (filters.subjectId) where.assessment.teachingAssignment.subjectId = filters.subjectId;

    const grades = await this.prisma.grade.findMany({
      where,
      include: {
        student: true,
        assessment: {
          include: {
            teachingAssignment: {
              include: { subject: true, classroom: true },
            },
          },
        },
      },
      orderBy: [{ student: { name: 'asc' } }, { assessment: { createdAt: 'asc' } }],
    });

    return {
      title: 'Grades Class Recap',
      columns: [
        { key: 'student', label: 'Student', width: 30 },
        { key: 'subject', label: 'Subject', width: 20 },
        { key: 'assessment', label: 'Assessment', width: 25 },
        { key: 'score', label: 'Score', width: 10 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: grades.map((g) => ({
        student: g.student.name,
        subject: g.assessment.teachingAssignment.subject.name,
        assessment: g.assessment.name,
        score: g.score,
        status: g.status,
      })),
    };
  }

  private async getTeacherScheduleRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      teachingAssignment: {
        academicYearId: filters.academicYearId,
        semesterId: filters.semesterId,
      },
    };
    if (filters.teacherId) where.teachingAssignment.teacherId = filters.teacherId;

    const schedules = await this.prisma.schedule.findMany({
      where,
      include: {
        teachingAssignment: {
          include: { teacher: true, subject: true, classroom: true },
        },
        lessonHour: true,
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { lessonHour: { startTime: 'asc' } }],
    });

    return {
      title: 'Teacher Schedule Recap',
      columns: [
        { key: 'day', label: 'Day', width: 15 },
        { key: 'time', label: 'Time', width: 15 },
        { key: 'teacher', label: 'Teacher', width: 30 },
        { key: 'subject', label: 'Subject', width: 20 },
        { key: 'classroom', label: 'Class', width: 15 },
        { key: 'room', label: 'Room', width: 15 },
      ],
      rows: schedules.map((s) => ({
        day: s.dayOfWeek,
        time: `${s.lessonHour.startTime} - ${s.lessonHour.endTime}`,
        teacher: s.teachingAssignment.teacher.name,
        subject: s.teachingAssignment.subject.name,
        classroom: s.teachingAssignment.classroom.name,
        room: s.room?.name || '-',
      })),
    };
  }

  private async getCashflowRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    const [payments, expenses] = await Promise.all([
      this.prisma.payment.findMany({
        where: { paidAt: { gte: startDate, lte: endDate }, status: 'VERIFIED' },
        orderBy: { paidAt: 'asc' },
      }),
      this.prisma.expense.findMany({
        where: { date: { gte: startDate, lte: endDate }, status: 'PAID' },
        orderBy: { date: 'asc' },
      }),
    ]);

    const rows = [
      ...payments.map((p) => ({
        date: p.paidAt.toISOString().split('T')[0],
        type: 'INCOME (Payment)',
        description: `Payment ${p.paymentNumber}`,
        amount: Number(p.amount),
      })),
      ...expenses.map((e) => ({
        date: e.date.toISOString().split('T')[0],
        type: 'EXPENSE',
        description: `${e.title} (${e.expenseNumber})`,
        amount: -Number(e.amount),
      })),
    ].sort((a, b) => a.date.localeCompare(b.date));

    return {
      title: 'Cashflow Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'date', label: 'Date', width: 15 },
        { key: 'type', label: 'Type', width: 20 },
        { key: 'description', label: 'Description', width: 40 },
        { key: 'amount', label: 'Amount', width: 15 },
      ],
      rows,
    };
  }

  private async getPpdbConversionRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      period: { academicYearId: filters.academicYearId },
      status: 'CONVERTED',
    };

    const regs = await this.prisma.ppdbRegistration.findMany({
      where,
      include: { convertedStudent: { include: { classroom: true } }, selectedDepartment: true },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      title: 'PPDB Conversion Recap',
      columns: [
        { key: 'regNum', label: 'Reg #', width: 15 },
        { key: 'name', label: 'Student Name', width: 30 },
        { key: 'department', label: 'Department', width: 20 },
        { key: 'classroom', label: 'Assigned Class', width: 15 },
        { key: 'date', label: 'Conversion Date', width: 20 },
      ],
      rows: regs.map((r) => ({
        regNum: r.registrationNumber,
        name: r.name,
        department: r.selectedDepartment?.name || '-',
        classroom: r.convertedStudent?.classroom?.name || '-',
        date: r.updatedAt.toISOString().split('T')[0],
      })),
    };
  }

  private async getIndustryPartnerRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.status) where.status = filters.status;

    const partners = await this.prisma.industryPartner.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return {
      title: 'Industry Partner Recap',
      columns: [
        { key: 'name', label: 'Partner Name', width: 30 },
        { key: 'type', label: 'Type', width: 15 },
        { key: 'contact', label: 'Contact Person', width: 20 },
        { key: 'phone', label: 'Phone', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: partners.map((p) => ({
        name: p.name,
        type: p.type || '-',
        contact: p.contactPerson || '-',
        phone: p.phone || '-',
        status: p.status,
      })),
    };
  }

  private async getStudentsByClass(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.classroomId) where.classroomId = filters.classroomId;
    if (filters.status) where.status = filters.status;

    const students = await this.prisma.student.findMany({
      where,
      include: { classroom: true },
      orderBy: [{ classroom: { name: 'asc' } }, { name: 'asc' }],
    });

    return {
      title: 'Students by Class Report',
      columns: [
        { key: 'nis', label: 'NIS', width: 15 },
        { key: 'name', label: 'Student Name', width: 30 },
        { key: 'gender', label: 'Gender', width: 10 },
        { key: 'classroom', label: 'Class', width: 20 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: students.map((s) => ({
        nis: s.nis,
        name: s.name,
        gender: s.gender,
        classroom: s.classroom?.name || '-',
        status: s.status,
      })),
    };
  }

  private async getAttendanceClassRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      date: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };
    if (filters.classroomId) {
      where.schedule = { teachingAssignment: { classroomId: filters.classroomId } };
    }

    const sessions = await this.prisma.attendanceSession.findMany({
      where,
      include: {
        records: { include: { student: true } },
        schedule: {
          include: {
            teachingAssignment: {
              include: { classroom: true, subject: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    const rows = [];
    for (const session of sessions) {
      for (const record of session.records) {
        rows.push({
          date: session.date.toISOString().split('T')[0],
          student: record.student.name,
          class: session.schedule.teachingAssignment.classroom.name,
          subject: session.schedule.teachingAssignment.subject.name,
          status: record.status,
          note: record.note || '-',
        });
      }
    }

    return {
      title: 'Attendance Class Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'date', label: 'Date', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'class', label: 'Class', width: 15 },
        { key: 'subject', label: 'Subject', width: 20 },
        { key: 'status', label: 'Status', width: 10 },
        { key: 'note', label: 'Note', width: 20 },
      ],
      rows,
    };
  }

  private async getInvoiceRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      deletedAt: null,
      issueDate: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };
    if (filters.status) where.status = filters.status;
    if (filters.studentId) where.studentId = filters.studentId;

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { student: true },
      orderBy: { issueDate: 'desc' },
    });

    return {
      title: 'Invoice Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'invoiceNumber', label: 'Invoice #', width: 20 },
        { key: 'date', label: 'Date', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'total', label: 'Total Amount', width: 15 },
        { key: 'paid', label: 'Paid Amount', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: invoices.map((i) => ({
        invoiceNumber: i.invoiceNumber,
        date: i.issueDate.toISOString().split('T')[0],
        student: i.student.name,
        total: Number(i.total),
        paid: Number(i.paidAmount),
        status: i.status,
      })),
    };
  }

  private async getPaymentRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      paidAt: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };
    if (filters.studentId) where.invoice = { studentId: filters.studentId };

    const payments = await this.prisma.payment.findMany({
      where,
      include: { invoice: { include: { student: true } } },
      orderBy: { paidAt: 'desc' },
    });

    return {
      title: 'Payment Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'date', label: 'Paid At', width: 15 },
        { key: 'invoiceNum', label: 'Invoice #', width: 20 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'amount', label: 'Amount', width: 15 },
        { key: 'method', label: 'Method', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: payments.map((p) => ({
        date: p.paidAt.toISOString().split('T')[0],
        invoiceNum: p.invoice.invoiceNumber,
        student: p.invoice.student.name,
        amount: Number(p.amount),
        method: p.method,
        status: p.status,
      })),
    };
  }

  private async getOutstandingInvoices(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      deletedAt: null,
      status: { in: ['PENDING', 'PARTIAL'] },
    };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.academicYearId) where.academicYearId = filters.academicYearId;

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { student: true, academicYear: true },
      orderBy: { issueDate: 'asc' },
    });

    return {
      title: 'Outstanding Invoices',
      columns: [
        { key: 'invoiceNum', label: 'Invoice #', width: 20 },
        { key: 'date', label: 'Issue Date', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'ay', label: 'AY', width: 15 },
        { key: 'total', label: 'Total', width: 15 },
        { key: 'paid', label: 'Paid', width: 15 },
        { key: 'remaining', label: 'Remaining', width: 15 },
      ],
      rows: invoices.map((i) => ({
        invoiceNum: i.invoiceNumber,
        date: i.issueDate.toISOString().split('T')[0],
        student: i.student.name,
        ay: i.academicYear?.name || '-',
        total: Number(i.total),
        paid: Number(i.paidAmount),
        remaining: Number(i.total) - Number(i.paidAmount),
      })),
    };
  }

  private async getPpdbRegistrationRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { period: { academicYearId: filters.academicYearId } };
    if (filters.status) where.status = filters.status;
    if (filters.departmentId) where.selectedDepartmentId = filters.departmentId;

    const regs = await this.prisma.ppdbRegistration.findMany({
      where,
      include: { selectedDepartment: true, selectedCompetency: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      title: 'PPDB Registration Recap',
      columns: [
        { key: 'regNum', label: 'Reg #', width: 15 },
        { key: 'name', label: 'Name', width: 30 },
        { key: 'gender', label: 'Gender', width: 10 },
        { key: 'department', label: 'Department', width: 20 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'date', label: 'Date', width: 15 },
      ],
      rows: regs.map((r) => ({
        regNum: r.registrationNumber,
        name: r.name,
        gender: r.gender,
        department: r.selectedDepartment?.name || '-',
        status: r.status,
        date: r.createdAt.toISOString().split('T')[0],
      })),
    };
  }

  private async getPpdbStatusRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { period: { academicYearId: filters.academicYearId } };
    
    const stats = await this.prisma.ppdbRegistration.groupBy({
      by: ['status'],
      where,
      _count: { _all: true },
    });

    return {
      title: 'PPDB Status Summary',
      columns: [
        { key: 'status', label: 'Status', width: 25 },
        { key: 'count', label: 'Count', width: 15 },
      ],
      rows: stats.map((s) => ({
        status: s.status,
        count: s._count._all,
      })),
    };
  }

  private async getExpenseRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      deletedAt: null,
      date: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };
    if (filters.status) where.status = filters.status;

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return {
      title: 'Expense Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'num', label: 'Expense #', width: 20 },
        { key: 'date', label: 'Date', width: 15 },
        { key: 'title', label: 'Title', width: 30 },
        { key: 'category', label: 'Category', width: 15 },
        { key: 'amount', label: 'Amount', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: expenses.map((e) => ({
        num: e.expenseNumber,
        date: e.date.toISOString().split('T')[0],
        title: e.title,
        category: e.category,
        amount: Number(e.amount),
        status: e.status,
      })),
    };
  }

  private async getInternshipRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {
      deletedAt: null,
      startDate: { gte: new Date(filters.startDate) },
      endDate: { lte: new Date(filters.endDate) },
    };
    if (filters.status) where.status = filters.status;

    const internships = await this.prisma.internship.findMany({
      where,
      include: { student: true, industryPartner: true },
    });

    return {
      title: 'Internship Recap',
      columns: [
        { key: 'student', label: 'Student', width: 30 },
        { key: 'partner', label: 'Partner', width: 30 },
        { key: 'title', label: 'Internship Title', width: 25 },
        { key: 'period', label: 'Period', width: 25 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: internships.map((i) => ({
        student: i.student.name,
        partner: i.industryPartner.name,
        title: i.title,
        period: `${i.startDate.toISOString().split('T')[0]} - ${i.endDate.toISOString().split('T')[0]}`,
        status: i.status,
      })),
    };
  }

  private async getAlumniRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.graduationYear) where.graduationYear = Number(filters.graduationYear);
    if (filters.status) where.status = filters.status;

    const alumni = await this.prisma.alumni.findMany({
      where,
      orderBy: { graduationYear: 'desc' },
    });

    return {
      title: 'Alumni Recap',
      columns: [
        { key: 'name', label: 'Name', width: 30 },
        { key: 'year', label: 'Graduation Year', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'company', label: 'Current Company', width: 25 },
        { key: 'position', label: 'Position', width: 20 },
      ],
      rows: alumni.map((a) => ({
        name: a.name,
        year: a.graduationYear,
        status: a.status,
        company: a.currentCompany || '-',
        position: a.currentPosition || '-',
      })),
    };
  }

  private async getDisciplineViolationRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.classroomId) where.student = { classroomId: filters.classroomId };
    if (filters.status) where.status = filters.status;
    if (filters.severity) where.rule = { severity: filters.severity };
    if (filters.startDate || filters.endDate) {
      where.incidentDate = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }

    const violations = await this.prisma.disciplineViolation.findMany({
      where,
      include: { rule: true, student: { include: { classroom: true } }, reportedBy: { select: { name: true } }, confirmedBy: { select: { name: true } } },
      orderBy: { incidentDate: 'desc' },
    });

    return {
      title: 'Discipline Violation Recap',
      columns: [
        { key: 'date', label: 'Incident Date', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'classroom', label: 'Class', width: 15 },
        { key: 'rule', label: 'Rule', width: 30 },
        { key: 'severity', label: 'Severity', width: 15 },
        { key: 'point', label: 'Point', width: 10 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'reportedBy', label: 'Reported By', width: 25 },
      ],
      rows: violations.map((item) => ({
        date: item.incidentDate.toISOString().split('T')[0],
        student: item.student.name,
        classroom: item.student.classroom?.name || '-',
        rule: `${item.rule.code} - ${item.rule.name}`,
        severity: item.rule.severity,
        point: item.point,
        status: item.status,
        reportedBy: item.reportedBy.name,
      })),
    };
  }

  private async getStudentDisciplineSummary(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.studentId) where.id = filters.studentId;
    if (filters.classroomId) where.classroomId = filters.classroomId;
    const students = await this.prisma.student.findMany({
      where,
      include: { classroom: true },
      orderBy: [{ classroom: { name: 'asc' } }, { name: 'asc' }],
    });
    const studentIds = students.map((student) => student.id);
    const [violations, achievements] = await Promise.all([
      studentIds.length
        ? this.prisma.disciplineViolation.groupBy({
            by: ['studentId'],
            where: { studentId: { in: studentIds }, status: 'CONFIRMED', deletedAt: null },
            _sum: { point: true },
            _count: true,
          })
        : Promise.resolve([]),
      studentIds.length
        ? this.prisma.studentAchievement.groupBy({
            by: ['studentId'],
            where: { studentId: { in: studentIds }, deletedAt: null },
            _sum: { point: true },
            _count: true,
          })
        : Promise.resolve([]),
    ]);
    const violationMap = new Map(violations.map((row) => [row.studentId, { point: row._sum.point ?? 0, count: row._count }]));
    const achievementMap = new Map(achievements.map((row) => [row.studentId, { point: row._sum.point ?? 0, count: row._count }]));

    return {
      title: 'Student Discipline Summary',
      columns: [
        { key: 'nis', label: 'NIS', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'classroom', label: 'Class', width: 15 },
        { key: 'violationPoint', label: 'Violation Point', width: 18 },
        { key: 'achievementPoint', label: 'Achievement Point', width: 18 },
        { key: 'netPoint', label: 'Net Point', width: 15 },
        { key: 'violationCount', label: 'Violation Count', width: 15 },
        { key: 'achievementCount', label: 'Achievement Count', width: 15 },
      ],
      rows: students.map((student) => {
        const violation = violationMap.get(student.id) ?? { point: 0, count: 0 };
        const achievement = achievementMap.get(student.id) ?? { point: 0, count: 0 };
        return {
          nis: student.nis,
          student: student.name,
          classroom: student.classroom?.name || '-',
          violationPoint: violation.point,
          achievementPoint: achievement.point,
          netPoint: achievement.point - violation.point,
          violationCount: violation.count,
          achievementCount: achievement.count,
        };
      }),
    };
  }

  private async getCounselingCaseRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.category) where.category = filters.category;
    if (filters.counselorId) where.counselorId = filters.counselorId;
    if (filters.startDate || filters.endDate) {
      where.openedAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }
    const cases = await this.prisma.counselingCase.findMany({
      where,
      include: { student: { include: { classroom: true } }, counselor: { select: { name: true } }, createdBy: { select: { name: true } } },
      orderBy: { openedAt: 'desc' },
    });

    return {
      title: 'Counseling Case Recap',
      columns: [
        { key: 'openedAt', label: 'Opened At', width: 15 },
        { key: 'student', label: 'Student', width: 30 },
        { key: 'classroom', label: 'Class', width: 15 },
        { key: 'title', label: 'Title', width: 35 },
        { key: 'category', label: 'Category', width: 20 },
        { key: 'priority', label: 'Priority', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'counselor', label: 'Counselor', width: 25 },
        { key: 'followUpDate', label: 'Follow Up', width: 15 },
      ],
      rows: cases.map((item) => ({
        openedAt: item.openedAt.toISOString().split('T')[0],
        student: item.student.name,
        classroom: item.student.classroom?.name || '-',
        title: item.title,
        category: item.category,
        priority: item.priority,
        status: item.status,
        counselor: item.counselor?.name || '-',
        followUpDate: item.followUpDate ? item.followUpDate.toISOString().split('T')[0] : '-',
      })),
    };
  }

  private async getLetterRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.direction) where.direction = filters.direction;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = String(filters.category).trim().toUpperCase().replace(/[^A-Z0-9]+/g, '');
    if (filters.recipientType) where.recipientType = filters.recipientType;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }

    const letters = await this.prisma.letter.findMany({
      where,
      include: { createdBy: { select: { name: true } }, approvedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      title: filters.direction === 'OUTGOING' ? 'Outgoing Letter Recap' : filters.direction === 'INCOMING' ? 'Incoming Letter Recap' : 'Letter Recap',
      columns: letterReportColumns(),
      rows: letters.map((letter) => letterReportRow(letter)),
    };
  }

  private async getLetterApprovalRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { letter: { deletedAt: null } };
    if (filters.status) where.status = filters.status;
    if (filters.category) where.letter.category = String(filters.category).trim().toUpperCase().replace(/[^A-Z0-9]+/g, '');
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
        ...(filters.endDate ? { lte: new Date(filters.endDate) } : {}),
      };
    }
    const approvals = await this.prisma.letterApproval.findMany({
      where,
      include: { approver: { select: { name: true } }, letter: { include: { createdBy: { select: { name: true } }, approvedBy: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      title: 'Letter Approval Recap',
      columns: [
        ...letterReportColumns(),
        { key: 'approver', label: 'Approver', width: 25 },
        { key: 'approvalStatus', label: 'Approval Status', width: 18 },
        { key: 'approvalNote', label: 'Approval Note', width: 35 },
      ],
      rows: approvals.map((approval) => ({
        ...letterReportRow(approval.letter),
        approver: approval.approver.name,
        approvalStatus: approval.status,
        approvalNote: approval.note || '-',
      })),
    };
  }

  private async getPlaceholderData(reportCode: string): Promise<ReportDataResult> {
    return {
      title: `Report: ${reportCode}`,
      columns: [
        { key: 'info', label: 'Information', width: 50 },
      ],
      rows: [
        { info: `Data for ${reportCode} is coming soon.` },
      ],
    };
  }

  private async getInventoryItemRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.locationId) where.locationId = filters.locationId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.condition) where.condition = filters.condition;

    const items = await this.prisma.inventoryItem.findMany({
      where,
      include: { category: true, location: true },
      orderBy: { code: 'asc' },
    });

    return {
      title: 'Inventory Item Recap',
      columns: [
        { key: 'code', label: 'Item Code', width: 15 },
        { key: 'name', label: 'Name', width: 30 },
        { key: 'category', label: 'Category', width: 20 },
        { key: 'location', label: 'Location', width: 20 },
        { key: 'type', label: 'Type', width: 15 },
        { key: 'quantity', label: 'Qty', width: 10 },
        { key: 'condition', label: 'Condition', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: items.map(i => ({
        code: i.code,
        name: i.name,
        category: i.category?.name ?? '-',
        location: i.location?.name ?? '-',
        type: i.type,
        quantity: i.quantity,
        condition: i.condition,
        status: i.status,
      })),
    };
  }

  private async getInventoryMovementRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = {};
    if (filters.startDate && filters.endDate) {
      where.performedAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }
    if (filters.fromLocationId) where.fromLocationId = filters.fromLocationId;
    if (filters.toLocationId) where.toLocationId = filters.toLocationId;

    const movements = await this.prisma.inventoryMovement.findMany({
      where,
      include: { item: true, fromLocation: true, toLocation: true, performedBy: true },
      orderBy: { performedAt: 'desc' },
    });

    return {
      title: 'Inventory Movement Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'date', label: 'Date', width: 15 },
        { key: 'item', label: 'Item', width: 30 },
        { key: 'type', label: 'Movement Type', width: 15 },
        { key: 'qty', label: 'Qty', width: 10 },
        { key: 'from', label: 'From Location', width: 20 },
        { key: 'to', label: 'To Location', width: 20 },
        { key: 'user', label: 'Performed By', width: 20 },
      ],
      rows: movements.map(m => ({
        date: m.performedAt.toISOString().split('T')[0],
        item: m.item.name,
        type: m.type,
        qty: m.quantity,
        from: m.fromLocation?.name ?? '-',
        to: m.toLocation?.name ?? '-',
        user: m.performedBy?.name ?? '-',
      })),
    };
  }

  private async getInventoryMaintenanceRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.startDate && filters.endDate) {
      where.scheduledAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }
    if (filters.status) where.status = filters.status;

    const maintenances = await this.prisma.inventoryMaintenance.findMany({
      where,
      include: { item: true, handledBy: true },
      orderBy: { scheduledAt: 'desc' },
    });

    return {
      title: 'Inventory Maintenance Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'scheduled', label: 'Scheduled At', width: 15 },
        { key: 'item', label: 'Item', width: 30 },
        { key: 'title', label: 'Activity', width: 30 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'handledBy', label: 'Handled By', width: 20 },
        { key: 'cost', label: 'Cost', width: 15 },
      ],
      rows: maintenances.map(m => ({
        scheduled: m.scheduledAt ? m.scheduledAt.toISOString().split('T')[0] : '-',
        item: m.item.name,
        title: m.title,
        status: m.status,
        handledBy: m.handledBy?.name ?? '-',
        cost: m.cost ?? '-',
      })),
    };
  }

  private async getInventoryLoanRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.startDate && filters.endDate) {
      where.requestedAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }
    if (filters.status) where.status = filters.status;
    if (filters.borrowerType) where.borrowerType = filters.borrowerType;

    const loans = await this.prisma.inventoryLoan.findMany({
      where,
      include: { item: true },
      orderBy: { requestedAt: 'desc' },
    });

    return {
      title: 'Inventory Loan Recap',
      subtitle: `Period: ${filters.startDate} to ${filters.endDate}`,
      columns: [
        { key: 'date', label: 'Request Date', width: 15 },
        { key: 'item', label: 'Item', width: 30 },
        { key: 'borrower', label: 'Borrower', width: 25 },
        { key: 'qty', label: 'Qty', width: 10 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'dueAt', label: 'Due Date', width: 15 },
      ],
      rows: loans.map(l => ({
        date: l.requestedAt.toISOString().split('T')[0],
        item: l.item.name,
        borrower: l.borrowerName,
        qty: l.quantity,
        status: l.status,
        dueAt: l.dueAt ? l.dueAt.toISOString().split('T')[0] : '-',
      })),
    };
  }

  private async getInventoryLowStockRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.locationId) where.locationId = filters.locationId;

    const items = await this.prisma.inventoryItem.findMany({
      where,
      include: { category: true, location: true },
      orderBy: { code: 'asc' },
    });

    const lowStock = items.filter(i => i.minStock !== null && i.quantity <= i.minStock);

    return {
      title: 'Inventory Low Stock Recap',
      columns: [
        { key: 'code', label: 'Item Code', width: 15 },
        { key: 'name', label: 'Name', width: 30 },
        { key: 'category', label: 'Category', width: 20 },
        { key: 'location', label: 'Location', width: 20 },
        { key: 'qty', label: 'Current Qty', width: 15 },
        { key: 'min', label: 'Min Stock', width: 15 },
      ],
      rows: lowStock.map(i => ({
        code: i.code,
        name: i.name,
        category: i.category?.name ?? '-',
        location: i.location?.name ?? '-',
        qty: i.quantity,
        min: i.minStock,
      })),
    };
  }

  private async getLibraryBookRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.categoryId) where.categoryId = filters.categoryId;
    
    const items = await this.prisma.libraryBook.findMany({
      where,
      include: { category: true },
      orderBy: { title: 'asc' },
    });

    const data = items.map((i: any) => ({
      code: i.code,
      title: i.title,
      author: i.author,
      publisher: i.publisher,
      category: i.category?.name || '-',
      publicationYear: i.publicationYear || '-',
      status: i.status,
    }));

    return {
      title: 'Library Book Recap',
      columns: [
        { key: 'code', label: 'Code', width: 15 },
        { key: 'title', label: 'Title', width: 35 },
        { key: 'author', label: 'Author', width: 20 },
        { key: 'publisher', label: 'Publisher', width: 20 },
        { key: 'category', label: 'Category', width: 15 },
        { key: 'publicationYear', label: 'Year', width: 10 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: data,
    };
  }

  private async getLibraryCopyRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    
    const items = await this.prisma.libraryBookCopy.findMany({
      where,
      include: { book: true },
      orderBy: { copyCode: 'asc' },
    });

    const data = items.map((i: any) => ({
      copyCode: i.copyCode,
      bookTitle: i.book?.title || '-',
      barcode: i.barcode || '-',
      condition: i.condition || '-',
      status: i.status,
    }));

    return {
      title: 'Library Book Copy Recap',
      columns: [
        { key: 'copyCode', label: 'Copy Code', width: 20 },
        { key: 'bookTitle', label: 'Book Title', width: 40 },
        { key: 'barcode', label: 'Barcode', width: 20 },
        { key: 'condition', label: 'Condition', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: data,
    };
  }

  private async getLibraryLoanRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    
    const items = await this.prisma.libraryLoan.findMany({
      where,
      include: { member: true, copy: { include: { book: true } } },
      orderBy: { borrowedAt: 'desc' },
    });

    const data = items.map((i: any) => ({
      memberCode: i.member?.memberCode || '-',
      bookTitle: i.copy?.book?.title || '-',
      copyCode: i.copy?.copyCode || '-',
      borrowedAt: i.borrowedAt ? i.borrowedAt.toISOString().split('T')[0] : '-',
      dueAt: i.dueAt ? i.dueAt.toISOString().split('T')[0] : '-',
      status: i.status,
    }));

    return {
      title: 'Library Loan Recap',
      columns: [
        { key: 'memberCode', label: 'Member', width: 15 },
        { key: 'bookTitle', label: 'Book Title', width: 35 },
        { key: 'copyCode', label: 'Copy Code', width: 15 },
        { key: 'borrowedAt', label: 'Borrowed At', width: 15 },
        { key: 'dueAt', label: 'Due At', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: data,
    };
  }

  private async getLibraryOverdueLoanRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null, status: 'BORROWED', dueAt: { lt: new Date() } };
    
    const items = await this.prisma.libraryLoan.findMany({
      where,
      include: { member: true, copy: { include: { book: true } } },
      orderBy: { dueAt: 'asc' },
    });

    const data = items.map((i: any) => ({
      memberCode: i.member?.memberCode || '-',
      bookTitle: i.copy?.book?.title || '-',
      dueAt: i.dueAt ? i.dueAt.toISOString().split('T')[0] : '-',
    }));

    return {
      title: 'Library Overdue Loan Recap',
      columns: [
        { key: 'memberCode', label: 'Member', width: 20 },
        { key: 'bookTitle', label: 'Book Title', width: 50 },
        { key: 'dueAt', label: 'Due At', width: 20 },
      ],
      rows: data,
    };
  }

  private async getLibraryFineRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    
    const items = await this.prisma.libraryFine.findMany({
      where,
      include: { member: true, loan: { include: { copy: { include: { book: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    const data = items.map((i: any) => ({
      memberCode: i.member?.memberCode || '-',
      bookTitle: i.loan?.copy?.book?.title || '-',
      amount: i.amount ? i.amount.toNumber() : 0,
      status: i.status,
    }));

    return {
      title: 'Library Fine Recap',
      columns: [
        { key: 'memberCode', label: 'Member', width: 20 },
        { key: 'bookTitle', label: 'Book Title', width: 40 },
        { key: 'amount', label: 'Amount', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
      ],
      rows: data,
    };
  }

  private async getLibraryMemberRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const where: any = { deletedAt: null };
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    
    const items = await this.prisma.libraryMember.findMany({
      where,
      include: { user: true, student: true, teacher: true, staff: true },
      orderBy: { memberCode: 'asc' },
    });

    const data = items.map((i: any) => ({
      memberCode: i.memberCode,
      name: i.student?.name || i.teacher?.name || i.staff?.name || i.user?.name || i.externalName || '-',
      type: i.type,
      status: i.status,
      joinedAt: i.joinedAt ? i.joinedAt.toISOString().split('T')[0] : '-',
    }));

    return {
      title: 'Library Member Recap',
      columns: [
        { key: 'memberCode', label: 'Member Code', width: 20 },
        { key: 'name', label: 'Name', width: 40 },
        { key: 'type', label: 'Type', width: 15 },
        { key: 'status', label: 'Status', width: 15 },
        { key: 'joinedAt', label: 'Joined', width: 15 },
      ],
      rows: data,
    };
  }

  private async getLibraryPopularBookRecap(filters: Record<string, any>): Promise<ReportDataResult> {
    const data: any[] = []; 
    return {
      title: 'Library Popular Book Recap',
      columns: [
        { key: 'code', label: 'Book Code', width: 20 },
        { key: 'title', label: 'Title', width: 50 },
        { key: 'loanCount', label: 'Total Loans', width: 20 },
      ],
      rows: data,
    };
  }
}

function letterReportColumns() {
  return [
    { key: 'letterNumber', label: 'Letter Number', width: 24 },
    { key: 'subject', label: 'Subject', width: 40 },
    { key: 'category', label: 'Category', width: 14 },
    { key: 'direction', label: 'Direction', width: 14 },
    { key: 'status', label: 'Status', width: 14 },
    { key: 'recipientName', label: 'Recipient', width: 30 },
    { key: 'createdBy', label: 'Created By', width: 25 },
    { key: 'approvedBy', label: 'Approved By', width: 25 },
    { key: 'issuedAt', label: 'Issued At', width: 16 },
    { key: 'createdAt', label: 'Created At', width: 16 },
  ];
}

function letterReportRow(letter: any) {
  return {
    letterNumber: letter.letterNumber || '-',
    subject: letter.subject,
    category: letter.category,
    direction: letter.direction,
    status: letter.status,
    recipientName: letter.recipientName,
    createdBy: letter.createdBy?.name || '-',
    approvedBy: letter.approvedBy?.name || '-',
    issuedAt: letter.issuedAt ? letter.issuedAt.toISOString().split('T')[0] : '-',
    createdAt: letter.createdAt.toISOString().split('T')[0],
  };
}
