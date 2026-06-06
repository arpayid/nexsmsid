import { Injectable } from '@nestjs/common';
import { ReportCategory, ReportDefinition } from './report-engine.types';

@Injectable()
export class ReportRegistryService {
  private readonly reports: ReportDefinition[] = [
    // Academic
    {
      code: 'students-by-class',
      name: 'Students by Class',
      category: ReportCategory.ACADEMIC,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['classroomId', 'status'],
      permissions: ['reports.view', 'reports.academic'],
    },
    {
      code: 'attendance-class-recap',
      name: 'Attendance Class Recap',
      category: ReportCategory.ACADEMIC,
      supportedFormats: ['XLSX', 'PDF', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['classroomId', 'subjectId'],
      permissions: ['reports.view', 'reports.academic'],
    },
    {
      code: 'grades-class-recap',
      name: 'Grades Class Recap',
      category: ReportCategory.ACADEMIC,
      supportedFormats: ['XLSX', 'PDF', 'CSV'],
      requiredFilters: ['academicYearId', 'semesterId', 'classroomId'],
      optionalFilters: ['subjectId'],
      permissions: ['reports.view', 'reports.academic'],
    },
    {
      code: 'teacher-schedule-recap',
      name: 'Teacher Schedule Recap',
      category: ReportCategory.ACADEMIC,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['academicYearId', 'semesterId'],
      optionalFilters: ['teacherId'],
      permissions: ['reports.view', 'reports.academic'],
    },

    // Finance
    {
      code: 'invoice-recap',
      name: 'Invoice Recap',
      category: ReportCategory.FINANCE,
      supportedFormats: ['XLSX', 'PDF', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status', 'studentId'],
      permissions: ['reports.view', 'reports.finance'],
    },
    {
      code: 'payment-recap',
      name: 'Payment Recap',
      category: ReportCategory.FINANCE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['studentId'],
      permissions: ['reports.view', 'reports.finance'],
    },
    {
      code: 'outstanding-invoices',
      name: 'Outstanding Invoices',
      category: ReportCategory.FINANCE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['studentId', 'academicYearId'],
      permissions: ['reports.view', 'reports.finance'],
    },
    {
      code: 'expense-recap',
      name: 'Expense Recap',
      category: ReportCategory.FINANCE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status'],
      permissions: ['reports.view', 'reports.finance'],
    },
    {
      code: 'cashflow-recap',
      name: 'Cashflow Recap',
      category: ReportCategory.FINANCE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: [],
      permissions: ['reports.view', 'reports.finance'],
    },

    // PPDB
    {
      code: 'ppdb-registration-recap',
      name: 'PPDB Registration Recap',
      category: ReportCategory.PPDB,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['academicYearId'],
      optionalFilters: ['status', 'departmentId'],
      permissions: ['reports.view', 'reports.ppdb'],
    },
    {
      code: 'ppdb-status-recap',
      name: 'PPDB Status Recap',
      category: ReportCategory.PPDB,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['academicYearId'],
      optionalFilters: [],
      permissions: ['reports.view', 'reports.ppdb'],
    },
    {
      code: 'ppdb-conversion-recap',
      name: 'PPDB Conversion Recap',
      category: ReportCategory.PPDB,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['academicYearId'],
      optionalFilters: [],
      permissions: ['reports.view', 'reports.ppdb'],
    },

    // PKL/BKK
    {
      code: 'internship-recap',
      name: 'Internship Recap',
      category: ReportCategory.PKL_BKK,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status', 'industryPartnerId'],
      permissions: ['reports.view', 'reports.pkl_bkk'],
    },
    {
      code: 'industry-partner-recap',
      name: 'Industry Partner Recap',
      category: ReportCategory.PKL_BKK,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['status'],
      permissions: ['reports.view', 'reports.pkl_bkk'],
    },
    {
      code: 'alumni-recap',
      name: 'Alumni Recap',
      category: ReportCategory.PKL_BKK,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['graduationYear', 'status'],
      permissions: ['reports.view', 'reports.pkl_bkk'],
    },
    {
      code: 'job-application-recap',
      name: 'Job Application Recap',
      category: ReportCategory.PKL_BKK,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status'],
      permissions: ['reports.view', 'reports.pkl_bkk'],
    },
    {
      code: 'tracer-study-recap',
      name: 'Tracer Study Recap',
      category: ReportCategory.PKL_BKK,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['year'],
      optionalFilters: [],
      permissions: ['reports.view', 'reports.pkl_bkk'],
    },

    // Communication
    {
      code: 'announcement-recap',
      name: 'Announcement Recap',
      category: ReportCategory.COMMUNICATION,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status'],
      permissions: ['reports.view', 'reports.communication'],
    },
    {
      code: 'notification-recap',
      name: 'Notification Recap',
      category: ReportCategory.COMMUNICATION,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status', 'channel'],
      permissions: ['reports.view', 'reports.communication'],
    },

    // BK & Discipline
    {
      code: 'discipline-violation-recap',
      name: 'Discipline Violation Recap',
      category: ReportCategory.BK_DISCIPLINE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'studentId', 'classroomId', 'status', 'severity'],
      permissions: ['discipline.report'],
    },
    {
      code: 'student-discipline-summary',
      name: 'Student Discipline Summary',
      category: ReportCategory.BK_DISCIPLINE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['studentId', 'classroomId'],
      permissions: ['discipline.report'],
    },
    {
      code: 'counseling-case-recap',
      name: 'Counseling Case Recap',
      category: ReportCategory.BK_DISCIPLINE,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'studentId', 'status', 'priority', 'category', 'counselorId'],
      permissions: ['counseling.view'],
    },

    // Letter Management
    {
      code: 'letter-recap',
      name: 'Letter Recap',
      category: ReportCategory.LETTERS,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'status', 'category', 'recipientType'],
      permissions: ['letters.report'],
    },
    {
      code: 'outgoing-letter-recap',
      name: 'Outgoing Letter Recap',
      category: ReportCategory.LETTERS,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'status', 'category', 'recipientType'],
      permissions: ['letters.report'],
    },
    {
      code: 'incoming-letter-recap',
      name: 'Incoming Letter Recap',
      category: ReportCategory.LETTERS,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'status', 'category', 'recipientType'],
      permissions: ['letters.report'],
    },
    {
      code: 'letter-approval-recap',
      name: 'Letter Approval Recap',
      category: ReportCategory.LETTERS,
      supportedFormats: ['XLSX', 'CSV'],
      requiredFilters: [],
      optionalFilters: ['startDate', 'endDate', 'status', 'category'],
      permissions: ['letters.report'],
    },

    // Inventory
    {
      code: 'inventory-item-recap',
      name: 'Inventory Item Recap',
      category: ReportCategory.INVENTORY,
      supportedFormats: ['XLSX', 'CSV', 'PDF'],
      requiredFilters: [],
      optionalFilters: ['categoryId', 'locationId', 'status', 'condition', 'type'],
      permissions: ['inventory.view'],
    },
    {
      code: 'inventory-movement-recap',
      name: 'Inventory Movement Recap',
      category: ReportCategory.INVENTORY,
      supportedFormats: ['XLSX', 'CSV', 'PDF'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['fromLocationId', 'toLocationId'],
      permissions: ['inventory.view'],
    },
    {
      code: 'inventory-maintenance-recap',
      name: 'Inventory Maintenance Recap',
      category: ReportCategory.INVENTORY,
      supportedFormats: ['XLSX', 'CSV', 'PDF'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status'],
      permissions: ['inventory.maintenance'],
    },
    {
      code: 'inventory-loan-recap',
      name: 'Inventory Loan Recap',
      category: ReportCategory.INVENTORY,
      supportedFormats: ['XLSX', 'CSV', 'PDF'],
      requiredFilters: ['startDate', 'endDate'],
      optionalFilters: ['status', 'borrowerType'],
      permissions: ['inventory.view'],
    },
    {
      code: 'inventory-low-stock-recap',
      name: 'Inventory Low Stock Recap',
      category: ReportCategory.INVENTORY,
      supportedFormats: ['XLSX', 'CSV', 'PDF'],
      requiredFilters: [],
      optionalFilters: ['categoryId', 'locationId'],
      permissions: ['inventory.view'],
    },
  ];

  getAll(): ReportDefinition[] {
    return this.reports;
  }

  getByCode(code: string): ReportDefinition | undefined {
    return this.reports.find((r) => r.code === code);
  }

  getByCategory(category: ReportCategory): ReportDefinition[] {
    return this.reports.filter((r) => r.category === category);
  }
}
