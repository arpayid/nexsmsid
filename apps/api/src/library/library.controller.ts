import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { LibraryService } from './library.service';
import { LibraryPdfService } from './library-pdf.service';
import { LibraryReportService } from './library-report.service';
import {
  CreateLibraryCategoryDto,
  UpdateLibraryCategoryDto,
  CreateLibraryShelfDto,
  UpdateLibraryShelfDto,
  CreateLibraryBookDto,
  UpdateLibraryBookDto,
  CreateLibraryBookCopyDto,
  UpdateLibraryBookCopyDto,
  CreateLibraryMemberDto,
  UpdateLibraryMemberDto,
  CreateLibraryLoanDto,
  ReturnLibraryLoanDto,
  MarkLostLibraryLoanDto,
  CreateLibraryReservationDto,
  PayLibraryFineDto,
  WaiveLibraryFineDto,
} from './library.dto';

@Controller('library')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly pdfService: LibraryPdfService,
    private readonly reportService: LibraryReportService,
  ) {}

  // =========================================================================
  // CATEGORIES
  // =========================================================================

  @Get('categories')
  @RequirePermissions('library.view')
  getCategories(@Query() query: any) {
    return this.libraryService.getCategories({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      search: query.search,
    });
  }

  @Post('categories')
  @RequirePermissions('library.create')
  createCategory(@Body() dto: CreateLibraryCategoryDto, @Req() req: any) {
    return this.libraryService.createCategory(dto, req.user.id);
  }

  @Get('categories/:id')
  @RequirePermissions('library.view')
  getCategory(@Param('id') id: string) {
    return this.libraryService.getCategory(id);
  }

  @Patch('categories/:id')
  @RequirePermissions('library.update')
  updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateLibraryCategoryDto,
    @Req() req: any,
  ) {
    return this.libraryService.updateCategory(id, dto, req.user.id);
  }

  @Delete('categories/:id')
  @RequirePermissions('library.delete')
  deleteCategory(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteCategory(id, req.user.id);
  }

  // =========================================================================
  // SHELVES
  // =========================================================================

  @Get('shelves')
  @RequirePermissions('library.view')
  getShelves(@Query() query: any) {
    return this.libraryService.getShelves({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      search: query.search,
    });
  }

  @Post('shelves')
  @RequirePermissions('library.create')
  createShelf(@Body() dto: CreateLibraryShelfDto, @Req() req: any) {
    return this.libraryService.createShelf(dto, req.user.id);
  }

  @Get('shelves/:id')
  @RequirePermissions('library.view')
  getShelf(@Param('id') id: string) {
    return this.libraryService.getShelf(id);
  }

  @Patch('shelves/:id')
  @RequirePermissions('library.update')
  updateShelf(
    @Param('id') id: string,
    @Body() dto: UpdateLibraryShelfDto,
    @Req() req: any,
  ) {
    return this.libraryService.updateShelf(id, dto, req.user.id);
  }

  @Delete('shelves/:id')
  @RequirePermissions('library.delete')
  deleteShelf(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteShelf(id, req.user.id);
  }

  // =========================================================================
  // BOOKS
  // =========================================================================

  @Get('books')
  @RequirePermissions('library.view')
  getBooks(@Query() query: any) {
    return this.libraryService.getBooks({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      search: query.search,
      categoryId: query.categoryId,
      shelfId: query.shelfId,
      status: query.status,
    });
  }

  @Post('books')
  @RequirePermissions('library.create')
  createBook(@Body() dto: CreateLibraryBookDto, @Req() req: any) {
    return this.libraryService.createBook(dto, req.user.id);
  }

  @Get('books/:id')
  @RequirePermissions('library.view')
  getBook(@Param('id') id: string) {
    return this.libraryService.getBook(id);
  }

  @Patch('books/:id')
  @RequirePermissions('library.update')
  updateBook(
    @Param('id') id: string,
    @Body() dto: UpdateLibraryBookDto,
    @Req() req: any,
  ) {
    return this.libraryService.updateBook(id, dto, req.user.id);
  }

  @Delete('books/:id')
  @RequirePermissions('library.delete')
  deleteBook(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteBook(id, req.user.id);
  }

  // =========================================================================
  // COPIES
  // =========================================================================

  @Get('books/:bookId/copies')
  @RequirePermissions('library.view')
  getCopies(@Param('bookId') bookId: string, @Query() query: any) {
    return this.libraryService.getCopies(bookId, {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      status: query.status,
    });
  }

  @Post('books/:bookId/copies')
  @RequirePermissions('library.create')
  createCopy(
    @Param('bookId') bookId: string,
    @Body() dto: CreateLibraryBookCopyDto,
    @Req() req: any,
  ) {
    return this.libraryService.createCopy(bookId, dto, req.user.id);
  }

  @Get('copies/:id')
  @RequirePermissions('library.view')
  getCopy(@Param('id') id: string) {
    return this.libraryService.getCopy(id);
  }

  @Patch('copies/:id')
  @RequirePermissions('library.update')
  updateCopy(
    @Param('id') id: string,
    @Body() dto: UpdateLibraryBookCopyDto,
    @Req() req: any,
  ) {
    return this.libraryService.updateCopy(id, dto, req.user.id);
  }

  @Delete('copies/:id')
  @RequirePermissions('library.delete')
  deleteCopy(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteCopy(id, req.user.id);
  }

  // =========================================================================
  // MEMBERS
  // =========================================================================

  @Get('members')
  @RequirePermissions('library.view')
  getMembers(@Query() query: any) {
    return this.libraryService.getMembers({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      search: query.search,
      type: query.type,
      status: query.status,
    });
  }

  @Post('members')
  @RequirePermissions('library.create')
  createMember(@Body() dto: CreateLibraryMemberDto, @Req() req: any) {
    return this.libraryService.createMember(dto, req.user.id);
  }

  @Get('members/:id')
  @RequirePermissions('library.view')
  getMember(@Param('id') id: string) {
    return this.libraryService.getMember(id);
  }

  @Patch('members/:id')
  @RequirePermissions('library.update')
  updateMember(
    @Param('id') id: string,
    @Body() dto: UpdateLibraryMemberDto,
    @Req() req: any,
  ) {
    return this.libraryService.updateMember(id, dto, req.user.id);
  }

  @Delete('members/:id')
  @RequirePermissions('library.delete')
  deleteMember(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteMember(id, req.user.id);
  }

  // =========================================================================
  // LOANS
  // =========================================================================

  @Get('loans')
  @RequirePermissions('library.view')
  getLoans(@Query() query: any) {
    return this.libraryService.getLoans({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      status: query.status,
      memberId: query.memberId,
      overdueOnly: query.overdueOnly === 'true',
    });
  }

  @Post('loans')
  @RequirePermissions('library.loan')
  createLoan(@Body() dto: CreateLibraryLoanDto, @Req() req: any) {
    return this.libraryService.createLoan(dto, req.user.id);
  }

  @Get('loans/:id')
  @RequirePermissions('library.view')
  getLoan(@Param('id') id: string) {
    return this.libraryService.getLoan(id);
  }

  @Post('loans/:id/return')
  @RequirePermissions('library.return')
  returnLoan(
    @Param('id') id: string,
    @Body() dto: ReturnLibraryLoanDto,
    @Req() req: any,
  ) {
    return this.libraryService.returnLoan(id, dto, req.user.id);
  }

  @Post('loans/:id/mark-lost')
  @RequirePermissions('library.update')
  markLostLoan(
    @Param('id') id: string,
    @Body() dto: MarkLostLibraryLoanDto,
    @Req() req: any,
  ) {
    return this.libraryService.markLostLoan(id, dto, req.user.id);
  }

  @Post('loans/:id/cancel')
  @RequirePermissions('library.update')
  cancelLoan(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.cancelLoan(id, req.user.id);
  }

  @Delete('loans/:id')
  @RequirePermissions('library.delete')
  deleteLoan(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.deleteLoan(id, req.user.id);
  }

  // =========================================================================
  // RESERVATIONS
  // =========================================================================

  @Get('reservations')
  @RequirePermissions('library.view')
  getReservations(@Query() query: any) {
    return this.libraryService.getReservations({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      status: query.status,
      memberId: query.memberId,
    });
  }

  @Post('reservations')
  @RequirePermissions('library.reserve')
  createReservation(@Body() dto: CreateLibraryReservationDto, @Req() req: any) {
    return this.libraryService.createReservation(dto, req.user.id);
  }

  @Get('reservations/:id')
  @RequirePermissions('library.view')
  getReservation(@Param('id') id: string) {
    return this.libraryService.getReservation(id);
  }

  @Post('reservations/:id/mark-ready')
  @RequirePermissions('library.update')
  markReservationReady(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.markReservationReady(id, req.user.id);
  }

  @Post('reservations/:id/cancel')
  @RequirePermissions('library.update')
  cancelReservation(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.cancelReservation(id, req.user.id);
  }

  @Post('reservations/:id/expire')
  @RequirePermissions('library.update')
  expireReservation(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.expireReservation(id, req.user.id);
  }

  // =========================================================================
  // FINES
  // =========================================================================

  @Get('fines')
  @RequirePermissions('library.view')
  getFines(@Query() query: any) {
    return this.libraryService.getFines({
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      status: query.status,
      memberId: query.memberId,
    });
  }

  @Get('fines/:id')
  @RequirePermissions('library.view')
  getFine(@Param('id') id: string) {
    return this.libraryService.getFine(id);
  }

  @Post('fines/:id/pay')
  @RequirePermissions('library.fine')
  payFine(
    @Param('id') id: string,
    @Body() dto: PayLibraryFineDto,
    @Req() req: any,
  ) {
    return this.libraryService.payFine(id, dto, req.user.id);
  }

  @Post('fines/:id/waive')
  @RequirePermissions('library.fine')
  waiveFine(
    @Param('id') id: string,
    @Body() dto: WaiveLibraryFineDto,
    @Req() req: any,
  ) {
    return this.libraryService.waiveFine(id, dto, req.user.id);
  }

  @Post('fines/:id/cancel')
  @RequirePermissions('library.fine')
  cancelFine(@Param('id') id: string, @Req() req: any) {
    return this.libraryService.cancelFine(id, req.user.id);
  }

  // =========================================================================
  // SUMMARY / DASHBOARD
  // =========================================================================

  @Get('summary')
  @RequirePermissions('library.view')
  getSummary() {
    return this.libraryService.getSummary();
  }

  @Get('overdue')
  @RequirePermissions('library.view')
  getOverdue() {
    return this.libraryService.getOverdue();
  }

  @Get('available-books')
  @RequirePermissions('library.view')
  getAvailableBooks() {
    return this.libraryService.getAvailableBooks();
  }

  @Get('popular-books')
  @RequirePermissions('library.view')
  getPopularBooks() {
    return this.libraryService.getPopularBooks();
  }

  // PDF Endpoints
  @Get('books/:id/print')
  @RequirePermissions('library.print')
  async printBook(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateBookPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="book-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('copies/:id/label')
  @RequirePermissions('library.print')
  async printLabel(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateCopyLabel(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="label-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('loans/:id/receipt')
  @RequirePermissions('library.print')
  async printReceipt(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateLoanReceipt(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('members/:id/card')
  @RequirePermissions('library.print')
  async printMemberCard(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateMemberCard(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="member-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('summary.pdf')
  @RequirePermissions('library.print')
  async printSummary(@Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateLibrarySummary();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="library-summary.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
