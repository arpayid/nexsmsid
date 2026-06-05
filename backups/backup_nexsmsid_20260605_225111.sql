--
-- PostgreSQL database dump
--

\restrict TDNgzuAQk6p0ZnmZggYQX7XLWgqUWEeC8yxR1VV2dgqZ4oHJTVywWRJzLwyntne

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AlumniStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."AlumniStatus" AS ENUM (
    'ACTIVE',
    'WORKING',
    'STUDYING',
    'ENTREPRENEUR',
    'UNEMPLOYED',
    'UNKNOWN'
);


ALTER TYPE public."AlumniStatus" OWNER TO nexsmsid;

--
-- Name: AnnouncementAudience; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."AnnouncementAudience" AS ENUM (
    'ALL',
    'STUDENTS',
    'PARENTS',
    'TEACHERS',
    'STAFF'
);


ALTER TYPE public."AnnouncementAudience" OWNER TO nexsmsid;

--
-- Name: AnnouncementStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."AnnouncementStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."AnnouncementStatus" OWNER TO nexsmsid;

--
-- Name: AssessmentType; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."AssessmentType" AS ENUM (
    'DAILY',
    'ASSIGNMENT',
    'QUIZ',
    'MIDTERM',
    'FINAL',
    'PRACTICAL',
    'PROJECT'
);


ALTER TYPE public."AssessmentType" OWNER TO nexsmsid;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'PERMIT',
    'SICK'
);


ALTER TYPE public."AttendanceStatus" OWNER TO nexsmsid;

--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);


ALTER TYPE public."DayOfWeek" OWNER TO nexsmsid;

--
-- Name: EmploymentStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."EmploymentStatus" AS ENUM (
    'PERMANENT',
    'CONTRACT',
    'HONORARY',
    'PROBATION'
);


ALTER TYPE public."EmploymentStatus" OWNER TO nexsmsid;

--
-- Name: ExpenseStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."ExpenseStatus" AS ENUM (
    'DRAFT',
    'APPROVED',
    'PAID',
    'CANCELLED'
);


ALTER TYPE public."ExpenseStatus" OWNER TO nexsmsid;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO nexsmsid;

--
-- Name: GradeStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."GradeStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'PUBLISHED'
);


ALTER TYPE public."GradeStatus" OWNER TO nexsmsid;

--
-- Name: GuardianRelation; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."GuardianRelation" AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'GRANDPARENT',
    'SIBLING',
    'OTHER'
);


ALTER TYPE public."GuardianRelation" OWNER TO nexsmsid;

--
-- Name: InternshipLogStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."InternshipLogStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."InternshipLogStatus" OWNER TO nexsmsid;

--
-- Name: InternshipStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."InternshipStatus" AS ENUM (
    'PLANNED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."InternshipStatus" OWNER TO nexsmsid;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'ISSUED',
    'PARTIAL',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO nexsmsid;

--
-- Name: JobApplicationStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."JobApplicationStatus" AS ENUM (
    'SUBMITTED',
    'REVIEWED',
    'INTERVIEW',
    'ACCEPTED',
    'REJECTED',
    'WITHDRAWN'
);


ALTER TYPE public."JobApplicationStatus" OWNER TO nexsmsid;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."JobStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'CANCELLED'
);


ALTER TYPE public."JobStatus" OWNER TO nexsmsid;

--
-- Name: MessageStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."MessageStatus" AS ENUM (
    'SENT',
    'READ',
    'DELETED'
);


ALTER TYPE public."MessageStatus" OWNER TO nexsmsid;

--
-- Name: NotificationChannel; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."NotificationChannel" AS ENUM (
    'IN_APP',
    'EMAIL',
    'SMS',
    'WHATSAPP'
);


ALTER TYPE public."NotificationChannel" OWNER TO nexsmsid;

--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'UNREAD',
    'READ',
    'ARCHIVED'
);


ALTER TYPE public."NotificationStatus" OWNER TO nexsmsid;

--
-- Name: PartnerStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PartnerStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."PartnerStatus" OWNER TO nexsmsid;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'QRIS',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO nexsmsid;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."PaymentStatus" OWNER TO nexsmsid;

--
-- Name: PersonStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PersonStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'GRADUATED',
    'TRANSFERRED',
    'RESIGNED'
);


ALTER TYPE public."PersonStatus" OWNER TO nexsmsid;

--
-- Name: PpdbDocumentStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PpdbDocumentStatus" AS ENUM (
    'PENDING',
    'VERIFIED',
    'REJECTED'
);


ALTER TYPE public."PpdbDocumentStatus" OWNER TO nexsmsid;

--
-- Name: PpdbRegistrationStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PpdbRegistrationStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'VERIFIED',
    'REVISION',
    'ACCEPTED',
    'REJECTED',
    'CONVERTED'
);


ALTER TYPE public."PpdbRegistrationStatus" OWNER TO nexsmsid;

--
-- Name: PpdbSelectionStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."PpdbSelectionStatus" AS ENUM (
    'PENDING',
    'PASSED',
    'FAILED'
);


ALTER TYPE public."PpdbSelectionStatus" OWNER TO nexsmsid;

--
-- Name: ReportFormat; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."ReportFormat" AS ENUM (
    'CSV',
    'XLSX',
    'PDF',
    'JSON'
);


ALTER TYPE public."ReportFormat" OWNER TO nexsmsid;

--
-- Name: ReportJobStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."ReportJobStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."ReportJobStatus" OWNER TO nexsmsid;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: nexsmsid
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."UserStatus" OWNER TO nexsmsid;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO nexsmsid;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    name text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.academic_years OWNER TO nexsmsid;

--
-- Name: alumni; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.alumni (
    id text NOT NULL,
    student_id text,
    nis text,
    name text NOT NULL,
    graduation_year integer NOT NULL,
    phone text,
    email text,
    address text,
    status public."AlumniStatus" DEFAULT 'UNKNOWN'::public."AlumniStatus" NOT NULL,
    current_company text,
    current_position text,
    university text,
    business_name text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.alumni OWNER TO nexsmsid;

--
-- Name: announcement_recipients; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.announcement_recipients (
    id text NOT NULL,
    announcement_id text NOT NULL,
    user_id text,
    name text,
    email text,
    read_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.announcement_recipients OWNER TO nexsmsid;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    audience public."AnnouncementAudience" DEFAULT 'ALL'::public."AnnouncementAudience" NOT NULL,
    status public."AnnouncementStatus" DEFAULT 'DRAFT'::public."AnnouncementStatus" NOT NULL,
    published_at timestamp(3) without time zone,
    archived_at timestamp(3) without time zone,
    created_by_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.announcements OWNER TO nexsmsid;

--
-- Name: assessments; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.assessments (
    id text NOT NULL,
    teaching_assignment_id text NOT NULL,
    name text NOT NULL,
    type public."AssessmentType" DEFAULT 'DAILY'::public."AssessmentType" NOT NULL,
    max_score integer DEFAULT 100 NOT NULL,
    weight integer DEFAULT 1 NOT NULL,
    description text,
    due_date timestamp(3) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.assessments OWNER TO nexsmsid;

--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.attendance_records (
    id text NOT NULL,
    session_id text NOT NULL,
    student_id text NOT NULL,
    status public."AttendanceStatus" DEFAULT 'PRESENT'::public."AttendanceStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.attendance_records OWNER TO nexsmsid;

--
-- Name: attendance_sessions; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.attendance_sessions (
    id text NOT NULL,
    schedule_id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    topic text,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.attendance_sessions OWNER TO nexsmsid;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    actor_id text,
    action text NOT NULL,
    entity text NOT NULL,
    entity_id text,
    metadata jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO nexsmsid;

--
-- Name: classrooms; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.classrooms (
    id text NOT NULL,
    competency_id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    level integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.classrooms OWNER TO nexsmsid;

--
-- Name: competencies; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.competencies (
    id text NOT NULL,
    department_id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.competencies OWNER TO nexsmsid;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.departments (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.departments OWNER TO nexsmsid;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.expenses (
    id text NOT NULL,
    expense_number text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    amount numeric(65,30) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."ExpenseStatus" DEFAULT 'DRAFT'::public."ExpenseStatus" NOT NULL,
    approved_by_id text,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.expenses OWNER TO nexsmsid;

--
-- Name: export_histories; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.export_histories (
    id text NOT NULL,
    report_job_id text,
    entity text NOT NULL,
    format public."ReportFormat" DEFAULT 'CSV'::public."ReportFormat" NOT NULL,
    file_name text NOT NULL,
    file_url text,
    row_count integer,
    requested_by_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.export_histories OWNER TO nexsmsid;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.grades (
    id text NOT NULL,
    assessment_id text NOT NULL,
    student_id text NOT NULL,
    score integer NOT NULL,
    status public."GradeStatus" DEFAULT 'DRAFT'::public."GradeStatus" NOT NULL,
    notes text,
    graded_by_id text,
    graded_at timestamp(3) without time zone,
    approved_by_id text,
    approved_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.grades OWNER TO nexsmsid;

--
-- Name: guardians; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.guardians (
    id text NOT NULL,
    name text NOT NULL,
    relation public."GuardianRelation" NOT NULL,
    phone text NOT NULL,
    email text,
    occupation text,
    address text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_id text
);


ALTER TABLE public.guardians OWNER TO nexsmsid;

--
-- Name: industry_partners; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.industry_partners (
    id text NOT NULL,
    name text NOT NULL,
    type text,
    contact_person text,
    phone text,
    email text,
    address text,
    website text,
    status public."PartnerStatus" DEFAULT 'ACTIVE'::public."PartnerStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.industry_partners OWNER TO nexsmsid;

--
-- Name: internal_messages; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.internal_messages (
    id text NOT NULL,
    sender_id text NOT NULL,
    recipient_id text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    status public."MessageStatus" DEFAULT 'SENT'::public."MessageStatus" NOT NULL,
    read_at timestamp(3) without time zone,
    read_by_id text,
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.internal_messages OWNER TO nexsmsid;

--
-- Name: internship_logs; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.internship_logs (
    id text NOT NULL,
    internship_id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    activity text NOT NULL,
    obstacle text,
    solution text,
    status public."InternshipLogStatus" DEFAULT 'DRAFT'::public."InternshipLogStatus" NOT NULL,
    reviewed_by_id text,
    reviewed_at timestamp(3) without time zone,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.internship_logs OWNER TO nexsmsid;

--
-- Name: internship_scores; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.internship_scores (
    id text NOT NULL,
    internship_id text NOT NULL,
    discipline_score integer NOT NULL,
    skill_score integer NOT NULL,
    attitude_score integer NOT NULL,
    report_score integer NOT NULL,
    final_score numeric(65,30) NOT NULL,
    assessed_by_id text,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.internship_scores OWNER TO nexsmsid;

--
-- Name: internships; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.internships (
    id text NOT NULL,
    student_id text NOT NULL,
    industry_partner_id text NOT NULL,
    supervisor_teacher_id text,
    title text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    status public."InternshipStatus" DEFAULT 'PLANNED'::public."InternshipStatus" NOT NULL,
    final_score numeric(65,30),
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.internships OWNER TO nexsmsid;

--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.invoice_items (
    id text NOT NULL,
    invoice_id text NOT NULL,
    payment_category_id text,
    name text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(65,30) NOT NULL,
    total numeric(65,30) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO nexsmsid;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    invoice_number text NOT NULL,
    student_id text NOT NULL,
    academic_year_id text,
    semester_id text,
    issue_date timestamp(3) without time zone NOT NULL,
    due_date timestamp(3) without time zone,
    subtotal numeric(65,30) DEFAULT 0 NOT NULL,
    discount numeric(65,30) DEFAULT 0 NOT NULL,
    penalty numeric(65,30) DEFAULT 0 NOT NULL,
    total numeric(65,30) DEFAULT 0 NOT NULL,
    paid_amount numeric(65,30) DEFAULT 0 NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.invoices OWNER TO nexsmsid;

--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.job_applications (
    id text NOT NULL,
    job_vacancy_id text NOT NULL,
    alumni_id text,
    applicant_name text NOT NULL,
    applicant_email text,
    applicant_phone text,
    cv_url text,
    status public."JobApplicationStatus" DEFAULT 'SUBMITTED'::public."JobApplicationStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.job_applications OWNER TO nexsmsid;

--
-- Name: job_vacancies; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.job_vacancies (
    id text NOT NULL,
    industry_partner_id text,
    title text NOT NULL,
    company_name text NOT NULL,
    description text NOT NULL,
    qualification text,
    location text,
    employment_type text,
    salary_range text,
    deadline timestamp(3) without time zone,
    status public."JobStatus" DEFAULT 'DRAFT'::public."JobStatus" NOT NULL,
    published_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.job_vacancies OWNER TO nexsmsid;

--
-- Name: lesson_hours; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.lesson_hours (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.lesson_hours OWNER TO nexsmsid;

--
-- Name: notification_templates; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.notification_templates (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    channel public."NotificationChannel" DEFAULT 'IN_APP'::public."NotificationChannel" NOT NULL,
    subject text,
    body text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.notification_templates OWNER TO nexsmsid;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    channel public."NotificationChannel" DEFAULT 'IN_APP'::public."NotificationChannel" NOT NULL,
    status public."NotificationStatus" DEFAULT 'UNREAD'::public."NotificationStatus" NOT NULL,
    read_at timestamp(3) without time zone,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO nexsmsid;

--
-- Name: payment_categories; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.payment_categories (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    default_amount integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.payment_categories OWNER TO nexsmsid;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.payments (
    id text NOT NULL,
    payment_number text NOT NULL,
    invoice_id text NOT NULL,
    amount numeric(65,30) NOT NULL,
    method public."PaymentMethod" DEFAULT 'CASH'::public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    paid_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_at timestamp(3) without time zone,
    verified_by_id text,
    proof_url text,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO nexsmsid;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "group" text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.permissions OWNER TO nexsmsid;

--
-- Name: ppdb_documents; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.ppdb_documents (
    id text NOT NULL,
    registration_id text NOT NULL,
    name text NOT NULL,
    file_url text NOT NULL,
    status public."PpdbDocumentStatus" DEFAULT 'PENDING'::public."PpdbDocumentStatus" NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_documents OWNER TO nexsmsid;

--
-- Name: ppdb_periods; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.ppdb_periods (
    id text NOT NULL,
    name text NOT NULL,
    academic_year_id text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    quota integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_periods OWNER TO nexsmsid;

--
-- Name: ppdb_registrations; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.ppdb_registrations (
    id text NOT NULL,
    registration_number text NOT NULL,
    period_id text NOT NULL,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    birth_place text,
    birth_date timestamp(3) without time zone,
    address text,
    phone text NOT NULL,
    email text,
    previous_school text,
    selected_department_id text,
    selected_competency_id text,
    status public."PpdbRegistrationStatus" DEFAULT 'DRAFT'::public."PpdbRegistrationStatus" NOT NULL,
    selection_status public."PpdbSelectionStatus" DEFAULT 'PENDING'::public."PpdbSelectionStatus" NOT NULL,
    verified_at timestamp(3) without time zone,
    verified_by_id text,
    converted_student_id text,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ppdb_registrations OWNER TO nexsmsid;

--
-- Name: ppdb_status_histories; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.ppdb_status_histories (
    id text NOT NULL,
    registration_id text NOT NULL,
    from_status public."PpdbRegistrationStatus",
    to_status public."PpdbRegistrationStatus" NOT NULL,
    note text,
    changed_by_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ppdb_status_histories OWNER TO nexsmsid;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    revoked_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address text,
    user_agent text
);


ALTER TABLE public.refresh_tokens OWNER TO nexsmsid;

--
-- Name: report_jobs; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.report_jobs (
    id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    format public."ReportFormat" DEFAULT 'CSV'::public."ReportFormat" NOT NULL,
    status public."ReportJobStatus" DEFAULT 'PENDING'::public."ReportJobStatus" NOT NULL,
    parameters jsonb,
    result_url text,
    error_message text,
    requested_by_id text,
    queued_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    started_at timestamp(3) without time zone,
    completed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.report_jobs OWNER TO nexsmsid;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.role_permissions (
    role_id text NOT NULL,
    permission_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO nexsmsid;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO nexsmsid;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.rooms (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type text,
    capacity integer,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.rooms OWNER TO nexsmsid;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    teaching_assignment_id text NOT NULL,
    room_id text NOT NULL,
    lesson_hour_id text NOT NULL,
    day_of_week public."DayOfWeek" NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.schedules OWNER TO nexsmsid;

--
-- Name: school_profiles; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.school_profiles (
    id text NOT NULL,
    name text NOT NULL,
    npsn text,
    address text,
    phone text,
    email text,
    website text,
    principal_name text,
    logo_url text,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.school_profiles OWNER TO nexsmsid;

--
-- Name: semesters; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.semesters (
    id text NOT NULL,
    academic_year_id text NOT NULL,
    name text NOT NULL,
    "order" integer NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.semesters OWNER TO nexsmsid;

--
-- Name: staffs; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.staffs (
    id text NOT NULL,
    nip text,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    phone text,
    email text,
    address text,
    "position" text NOT NULL,
    department text,
    employment_status public."EmploymentStatus" DEFAULT 'PERMANENT'::public."EmploymentStatus" NOT NULL,
    status public."PersonStatus" DEFAULT 'ACTIVE'::public."PersonStatus" NOT NULL,
    photo_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.staffs OWNER TO nexsmsid;

--
-- Name: student_guardians; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.student_guardians (
    student_id text NOT NULL,
    guardian_id text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.student_guardians OWNER TO nexsmsid;

--
-- Name: students; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.students (
    id text NOT NULL,
    nis text NOT NULL,
    nisn text,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    birth_place text,
    birth_date timestamp(3) without time zone,
    address text,
    phone text,
    email text,
    classroom_id text,
    status public."PersonStatus" DEFAULT 'ACTIVE'::public."PersonStatus" NOT NULL,
    photo_url text,
    enrolled_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    user_id text
);


ALTER TABLE public.students OWNER TO nexsmsid;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "group" text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.subjects OWNER TO nexsmsid;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    nip text,
    nuptk text,
    name text NOT NULL,
    gender public."Gender" NOT NULL,
    birth_place text,
    birth_date timestamp(3) without time zone,
    phone text,
    email text,
    address text,
    employment_status public."EmploymentStatus" DEFAULT 'PERMANENT'::public."EmploymentStatus" NOT NULL,
    status public."PersonStatus" DEFAULT 'ACTIVE'::public."PersonStatus" NOT NULL,
    photo_url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    user_id text
);


ALTER TABLE public.teachers OWNER TO nexsmsid;

--
-- Name: teaching_assignments; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.teaching_assignments (
    id text NOT NULL,
    teacher_id text NOT NULL,
    subject_id text NOT NULL,
    classroom_id text NOT NULL,
    academic_year_id text NOT NULL,
    semester_id text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.teaching_assignments OWNER TO nexsmsid;

--
-- Name: tracer_studies; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.tracer_studies (
    id text NOT NULL,
    alumni_id text NOT NULL,
    year integer NOT NULL,
    status public."AlumniStatus" DEFAULT 'UNKNOWN'::public."AlumniStatus" NOT NULL,
    company_name text,
    "position" text,
    university text,
    major text,
    business_name text,
    income_range text,
    feedback text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.tracer_studies OWNER TO nexsmsid;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_roles OWNER TO nexsmsid;

--
-- Name: users; Type: TABLE; Schema: public; Owner: nexsmsid
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    username text,
    name text NOT NULL,
    password_hash text NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    last_login_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO nexsmsid;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ca4f0eb5-cf9d-4adf-9629-4277f2bd7bc8	f5dedcca7930ef3031f2d517678b37a12fb3f360f75aaee85e869e449cc9d7db	2026-06-05 12:32:20.748862+00	20260604133000_phase_3_auth_rbac_audit	\N	\N	2026-06-05 12:32:20.674384+00	1
06981249-ea03-43bb-bb7f-c16a4ad40c2d	96ab8e894fee4345d8b509e526591fff4792cd3e25ab2837a50c2d53396c4484	2026-06-05 12:32:20.842319+00	20260604140000_phase_5_school_profile_master_data	\N	\N	2026-06-05 12:32:20.749665+00	1
8ee576d2-fc00-47fc-adc1-05959cd99f17	756649fa8772f76db95806cdf959cd2ee04fccf6d80e714f83cb01b2ecc37f6b	2026-06-05 12:32:20.915066+00	20260604143054_phase_6_people_management	\N	\N	2026-06-05 12:32:20.843119+00	1
8c406505-4e97-4f70-8e2b-a38b5d3654ed	c9ce972922e90a924e426952230e5dc8d70d28f5abbf66f161edc12dba604ee2	2026-06-05 12:32:21.013179+00	20260604151152_phase_7_academic_schedule_attendance_grades	\N	\N	2026-06-05 12:32:20.915895+00	1
072827c4-43f6-4166-ac0f-e498b8a5b530	231c131fb61224cb9ff1cd1e8a8c45e5fa47ca8725f79874b92d1efad279ff25	2026-06-05 12:32:21.117697+00	20260604153311_phase_8_finance_ppdb	\N	\N	2026-06-05 12:32:21.01423+00	1
d8e6f5fb-5602-40c8-8852-b1dbce0978ca	00ad89c1e4f1c8e5cd7976326508a31cc630ef8a4e0f9a94b21284984571124c	2026-06-05 12:32:21.230552+00	20260604165709_phase_9_pkl_bkk	\N	\N	2026-06-05 12:32:21.118706+00	1
6b0ad22e-6549-4b31-8cfd-10a04b50defe	26af89a84cd104e276fc2d7737e69901c3ee67dd51dba209e8715fae65033011	2026-06-05 12:32:21.327103+00	20260604231417_phase_10_communication_reports	\N	\N	2026-06-05 12:32:21.231585+00	1
bf67b64f-8850-431e-87cf-f61354153ee1	9c9e98fd6ccc9412a130ce253c56dcfe8df0a901dbaf236202591f27412b4c1b	2026-06-05 12:32:21.350199+00	20260605130000_phase_104_portal_user_relations	\N	\N	2026-06-05 12:32:21.328514+00	1
\.


--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.academic_years (id, name, start_date, end_date, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-ay-2025	2025/2026	2025-07-01 00:00:00	2026-06-30 00:00:00	t	2026-06-05 12:34:48.581	2026-06-05 12:34:48.581	\N
\.


--
-- Data for Name: alumni; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.alumni (id, student_id, nis, name, graduation_year, phone, email, address, status, current_company, current_position, university, business_name, created_at, updated_at, deleted_at) FROM stdin;
seed-alumni-1	cmq0wpi9e0052lr3enbuvc7rx	20260001	Andi Pratama	2025	081298765432	andi.pratama@example.com	Jl. Merdeka No. 1, Jakarta	WORKING	PT Maju Motor Indonesia	Junior Mechanic	\N	\N	2026-06-05 12:34:48.803	2026-06-05 12:34:48.803	\N
seed-alumni-2	\N	20240099	Raka Pradipta	2024	081299900111	raka.pradipta@example.com	Jl. Veteran No. 4	STUDYING	\N	\N	Politeknik Negeri Bandung	\N	2026-06-05 12:34:48.806	2026-06-05 12:34:48.806	\N
\.


--
-- Data for Name: announcement_recipients; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.announcement_recipients (id, announcement_id, user_id, name, email, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.announcements (id, title, content, audience, status, published_at, archived_at, created_by_id, created_at, updated_at, deleted_at) FROM stdin;
seed-announcement-1	Jadwal Ujian Akhir Semester	Ujian akhir semester dimulai Senin, 15 Juni 2026. Peserta didik wajib hadir 30 menit lebih awal.	STUDENTS	PUBLISHED	2026-06-01 00:00:00	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.831	2026-06-05 12:34:48.831	\N
seed-announcement-2	Rapat Koordinasi Orang Tua	Rapat koordinasi orang tua/wali kelas X dilaksanakan Jumat, 19 Juni 2026 pukul 09.00 WIB.	PARENTS	DRAFT	\N	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.835	2026-06-05 12:34:48.835	\N
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.assessments (id, teaching_assignment_id, name, type, max_score, weight, description, due_date, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-assessment-1	seed-ta-1	Quiz 1 - Matematika	QUIZ	100	10	Quiz pertama semester ini	2026-06-15 00:00:00	t	2026-06-05 12:34:48.685	2026-06-05 12:34:48.685	\N
seed-assessment-2	seed-ta-1	UTS Matematika	MIDTERM	100	30	Ujian Tengah Semester	2026-07-01 00:00:00	t	2026-06-05 12:34:48.688	2026-06-05 12:34:48.688	\N
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.attendance_records (id, session_id, student_id, status, note, created_at, updated_at) FROM stdin;
cmq0wpiaw0056lr3et3bnm1dz	seed-attendance-session-1	cmq0wpi9e0052lr3enbuvc7rx	PRESENT	\N	2026-06-05 12:34:48.68	2026-06-05 12:34:48.68
cmq0wpiaz0058lr3es902i2zy	seed-attendance-session-1	cmq0wpi9j0054lr3eikzy8xdk	PRESENT	\N	2026-06-05 12:34:48.683	2026-06-05 12:34:48.683
\.


--
-- Data for Name: attendance_sessions; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.attendance_sessions (id, schedule_id, date, topic, notes, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-attendance-session-1	seed-schedule-1	2026-06-01 00:00:00	\N	Seed attendance session	t	2026-06-05 12:34:48.677	2026-06-05 12:34:48.677	\N
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.audit_logs (id, actor_id, action, entity, entity_id, metadata, ip_address, user_agent, created_at) FROM stdin;
cmq0wpipx005tlr3eysdlr4lu	cmq0wpi7r004zlr3e1bl37xe8	seed.people_management	system	\N	{"roles": 14, "permissions": 165, "superAdminEmail": "superadmin@nexsmsid.dev"}	\N	\N	2026-06-05 12:34:49.221
cmq0wq1hw0001lr01j21avq50	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	172.18.0.1	curl/8.18.0	2026-06-05 12:35:13.556
cmq0x0uk50003lr015tngbgz2	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	172.18.0.1	curl/8.18.0	2026-06-05 12:43:37.781
cmq0x0v250005lr01gddulxjv	cmq0wpipa005plr3etedgrwwq	auth.login	user	cmq0wpipa005plr3etedgrwwq	\N	172.18.0.1	curl/8.18.0	2026-06-05 12:43:38.429
cmq0x0vja0007lr016snc6rdn	cmq0wpipi005qlr3ed8m8otq8	auth.login	user	cmq0wpipi005qlr3ed8m8otq8	\N	172.18.0.1	curl/8.18.0	2026-06-05 12:43:39.046
cmq0x0w0j0009lr01gcxyyhbu	cmq0wpipr005rlr3e8w54v7rv	auth.login	user	cmq0wpipr005rlr3e8w54v7rv	\N	172.18.0.1	curl/8.18.0	2026-06-05 12:43:39.668
cmq0xcwqf0001nw01kb5co8yj	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	76.13.197.7	curl/8.18.0	2026-06-05 12:53:00.471
cmq0xvmp20003nw01g723i07m	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	76.13.197.7	curl/8.18.0	2026-06-05 13:07:33.926
cmq0y017z0005nw01glvxuk6k	\N	auth.login_failed	user	\N	{"email": "admin@nexsmsid.dev", "reason": "user_not_found"}	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:10:59.376
cmq0y15p90007nw01nu952q2o	cmq0wpi7r004zlr3e1bl37xe8	auth.login_failed	user	cmq0wpi7r004zlr3e1bl37xe8	{"email": "superadmin@nexsmsid.dev", "reason": "invalid_password"}	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:11:51.837
cmq0y1bdw0009nw01qouv4cal	cmq0wpi7r004zlr3e1bl37xe8	auth.login_failed	user	cmq0wpi7r004zlr3e1bl37xe8	{"email": "superadmin@nexsmsid.dev", "reason": "invalid_password"}	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:11:59.204
cmq0y26qg000bnw01mx69zl1j	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:12:39.833
cmq0yinfa000dnw01ybsegc1x	cmq0wpi7r004zlr3e1bl37xe8	auth.logout	user	cmq0wpi7r004zlr3e1bl37xe8	{"revokedRefreshTokens": 1}	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:25:27.958
cmq0yk0aa000fnw01a289bt2r	cmq0wpi7r004zlr3e1bl37xe8	auth.login	user	cmq0wpi7r004zlr3e1bl37xe8	\N	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	2026-06-05 13:26:31.282
\.


--
-- Data for Name: classrooms; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.classrooms (id, competency_id, code, name, level, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-class-1	seed-comp-tkr	10-TKR-A	Kelas X TKR A	10	t	2026-06-05 12:34:48.603	2026-06-05 12:34:48.603	\N
\.


--
-- Data for Name: competencies; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.competencies (id, department_id, code, name, description, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-comp-tkr	seed-dept-tkr	PMKR	Pemeliharaan Mesin Kendaraan Ringan	Konsentrasi Pemeliharaan Mesin Kendaraan Ringan	t	2026-06-05 12:34:48.595	2026-06-05 12:34:48.595	\N
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.departments (id, code, name, description, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-dept-tkr	TKR	Teknik Kendaraan Ringan	Jurusan Teknik Kendaraan Ringan	t	2026-06-05 12:34:48.591	2026-06-05 12:34:48.591	\N
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.expenses (id, expense_number, title, category, amount, date, status, approved_by_id, note, created_at, updated_at, deleted_at) FROM stdin;
seed-expense-1	EXP-202606-00001	Listrik Bulan Juni	Utilitas	1500000.000000000000000000000000000000	2026-06-01 00:00:00	PAID	cmq0wpi7r004zlr3e1bl37xe8	\N	2026-06-05 12:34:48.734	2026-06-05 12:34:48.734	\N
seed-expense-2	EXP-202606-00002	ATK Kantor	Perlengkapan	500000.000000000000000000000000000000	2026-06-03 00:00:00	APPROVED	cmq0wpi7r004zlr3e1bl37xe8	\N	2026-06-05 12:34:48.737	2026-06-05 12:34:48.737	\N
\.


--
-- Data for Name: export_histories; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.export_histories (id, report_job_id, entity, format, file_name, file_url, row_count, requested_by_id, created_at) FROM stdin;
seed-export-history-1	seed-report-job-1	STUDENTS	CSV	students-seed-report-job-1.csv	/exports/students-seed-report-job-1.csv	2	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.866
seed-export-history-2	seed-report-job-2	FINANCE	XLSX	finance-june-preview.xlsx	/exports/finance-june-preview.xlsx	2	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.869
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.grades (id, assessment_id, student_id, score, status, notes, graded_by_id, graded_at, approved_by_id, approved_at, created_at, updated_at) FROM stdin;
cmq0wpib6005alr3eqhodm8jj	seed-assessment-1	cmq0wpi9e0052lr3enbuvc7rx	97	SUBMITTED	\N	\N	\N	\N	\N	2026-06-05 12:34:48.69	2026-06-05 12:34:48.69
cmq0wpib9005clr3eo2ltc3j3	seed-assessment-2	cmq0wpi9e0052lr3enbuvc7rx	76	SUBMITTED	\N	\N	\N	\N	\N	2026-06-05 12:34:48.694	2026-06-05 12:34:48.694
cmq0wpibb005elr3eynuzis31	seed-assessment-1	cmq0wpi9j0054lr3eikzy8xdk	97	SUBMITTED	\N	\N	\N	\N	\N	2026-06-05 12:34:48.695	2026-06-05 12:34:48.695
cmq0wpibd005glr3erlo905br	seed-assessment-2	cmq0wpi9j0054lr3eikzy8xdk	84	SUBMITTED	\N	\N	\N	\N	\N	2026-06-05 12:34:48.698	2026-06-05 12:34:48.698
\.


--
-- Data for Name: guardians; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.guardians (id, name, relation, phone, email, occupation, address, created_at, updated_at, user_id) FROM stdin;
seed-guardian-ibu	Sari Wulandari	MOTHER	081234567891	sari.wulandari@example.com	Ibu Rumah Tangga	Jl. Sudirman No. 2, Bandung	2026-06-05 12:34:48.625	2026-06-05 12:34:48.625	\N
seed-guardian-ayah	Budi Santoso	FATHER	081234567890	wali@nexsmsid.dev	Karyawan Swasta	Jl. Merdeka No. 1, Jakarta	2026-06-05 12:34:48.622	2026-06-05 12:34:49.219	cmq0wpipr005rlr3e8w54v7rv
\.


--
-- Data for Name: industry_partners; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.industry_partners (id, name, type, contact_person, phone, email, address, website, status, note, created_at, updated_at, deleted_at) FROM stdin;
seed-industry-partner-1	PT Maju Motor Indonesia	Otomotif	Doni Setiawan	0215550101	hrd@majumotor.test	Kawasan Industri Pulogadung	https://majumotor.test	ACTIVE	Mitra PKL utama jurusan TKR	2026-06-05 12:34:48.777	2026-06-05 12:34:48.777	\N
seed-industry-partner-2	CV Digital Nusantara	Teknologi	Rina Kurnia	0225550102	career@digitalnusantara.test	Jl. Teknologi No. 9 Bandung	https://digitalnusantara.test	ACTIVE	Mitra lowongan kerja dan magang IT	2026-06-05 12:34:48.78	2026-06-05 12:34:48.78	\N
\.


--
-- Data for Name: internal_messages; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.internal_messages (id, sender_id, recipient_id, subject, body, status, read_at, read_by_id, deleted_at, created_at, updated_at) FROM stdin;
seed-message-1	cmq0wpi7r004zlr3e1bl37xe8	cmq0wpi7r004zlr3e1bl37xe8	Koordinasi publikasi pengumuman	Mohon cek kembali konten pengumuman sebelum dipublikasikan ke portal publik.	SENT	\N	\N	\N	2026-06-05 12:34:48.838	2026-06-05 12:34:48.838
seed-message-2	cmq0wpi7r004zlr3e1bl37xe8	cmq0wpi7r004zlr3e1bl37xe8	Laporan bulanan siap diekspor	Laporan rekap keuangan dan PPDB bulan ini sudah siap untuk dicek.	READ	2026-06-05 00:00:00	cmq0wpi7r004zlr3e1bl37xe8	\N	2026-06-05 12:34:48.841	2026-06-05 12:34:48.841
\.


--
-- Data for Name: internship_logs; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.internship_logs (id, internship_id, date, activity, obstacle, solution, status, reviewed_by_id, reviewed_at, note, created_at, updated_at) FROM stdin;
seed-internship-log-1	seed-internship-1	2026-01-13 00:00:00	Orientasi tempat PKL dan pengenalan SOP bengkel	\N	\N	SUBMITTED	\N	\N	\N	2026-06-05 12:34:48.791	2026-06-05 12:34:48.791
seed-internship-log-2	seed-internship-2	2026-02-08 00:00:00	Membantu input data pelanggan dan arsip servis	Adaptasi aplikasi internal	Didampingi staf administrasi	APPROVED	\N	2026-02-09 00:00:00	Aktivitas sesuai target	2026-06-05 12:34:48.795	2026-06-05 12:34:48.795
\.


--
-- Data for Name: internship_scores; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.internship_scores (id, internship_id, discipline_score, skill_score, attitude_score, report_score, final_score, assessed_by_id, note, created_at, updated_at) FROM stdin;
seed-internship-score-1	seed-internship-2	88	84	90	82	86.000000000000000000000000000000	\N	Nilai sementara baik	2026-06-05 12:34:48.798	2026-06-05 12:34:48.798
\.


--
-- Data for Name: internships; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.internships (id, student_id, industry_partner_id, supervisor_teacher_id, title, start_date, end_date, status, final_score, note, created_at, updated_at, deleted_at) FROM stdin;
seed-internship-1	cmq0wpi9e0052lr3enbuvc7rx	seed-industry-partner-1	seed-teacher-1	PKL Bengkel Otomotif	2026-01-12 00:00:00	2026-04-12 00:00:00	PLANNED	\N	Rencana PKL siswa di bengkel rekanan	2026-06-05 12:34:48.783	2026-06-05 12:34:48.783	\N
seed-internship-2	cmq0wpi9j0054lr3eikzy8xdk	seed-industry-partner-2	seed-teacher-1	PKL Administrasi Digital	2026-02-01 00:00:00	2026-05-01 00:00:00	ONGOING	86.000000000000000000000000000000	PKL berjalan di divisi operasional digital	2026-06-05 12:34:48.787	2026-06-05 12:34:48.787	\N
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.invoice_items (id, invoice_id, payment_category_id, name, quantity, unit_price, total, created_at, updated_at) FROM stdin;
seed-invoice-item-1	seed-invoice-1	\N	SPP Bulan Juli 2026	1	300000.000000000000000000000000000000	300000.000000000000000000000000000000	2026-06-05 12:34:48.716	2026-06-05 12:34:48.716
seed-invoice-item-2	seed-invoice-1	\N	Biaya Kegiatan	1	200000.000000000000000000000000000000	200000.000000000000000000000000000000	2026-06-05 12:34:48.719	2026-06-05 12:34:48.719
seed-invoice-item-3	seed-invoice-2	\N	LKS Matematika	1	150000.000000000000000000000000000000	150000.000000000000000000000000000000	2026-06-05 12:34:48.724	2026-06-05 12:34:48.724
seed-invoice-item-4	seed-invoice-2	\N	LKS Bahasa Indonesia	1	200000.000000000000000000000000000000	200000.000000000000000000000000000000	2026-06-05 12:34:48.726	2026-06-05 12:34:48.726
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.invoices (id, invoice_number, student_id, academic_year_id, semester_id, issue_date, due_date, subtotal, discount, penalty, total, paid_amount, status, note, created_at, updated_at, deleted_at) FROM stdin;
seed-invoice-1	INV-202606-00001	cmq0wpi9e0052lr3enbuvc7rx	seed-ay-2025	seed-sem-1	2026-06-01 00:00:00	2026-07-10 00:00:00	500000.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	500000.000000000000000000000000000000	500000.000000000000000000000000000000	PAID	SPP Bulan Juli 2026	2026-06-05 12:34:48.711	2026-06-05 12:34:48.711	\N
seed-invoice-2	INV-202606-00002	cmq0wpi9j0054lr3eikzy8xdk	seed-ay-2025	seed-sem-1	2026-06-01 00:00:00	2026-07-10 00:00:00	350000.000000000000000000000000000000	0.000000000000000000000000000000	0.000000000000000000000000000000	350000.000000000000000000000000000000	0.000000000000000000000000000000	DRAFT	Tagihan LKS	2026-06-05 12:34:48.721	2026-06-05 12:34:48.721	\N
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.job_applications (id, job_vacancy_id, alumni_id, applicant_name, applicant_email, applicant_phone, cv_url, status, note, created_at, updated_at) FROM stdin;
seed-job-application-1	seed-job-vacancy-2	seed-alumni-1	Andi Pratama	andi.pratama@example.com	081298765432	/uploads/cv/andi.pdf	REVIEWED	Profil sesuai kebutuhan	2026-06-05 12:34:48.817	2026-06-05 12:34:48.817
seed-job-application-2	seed-job-vacancy-2	seed-alumni-2	Raka Pradipta	raka.pradipta@example.com	081299900111	/uploads/cv/raka.pdf	SUBMITTED	\N	2026-06-05 12:34:48.821	2026-06-05 12:34:48.821
\.


--
-- Data for Name: job_vacancies; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.job_vacancies (id, industry_partner_id, title, company_name, description, qualification, location, employment_type, salary_range, deadline, status, published_at, created_at, updated_at, deleted_at) FROM stdin;
seed-job-vacancy-1	seed-industry-partner-1	Teknisi Junior Otomotif	PT Maju Motor Indonesia	Membantu perawatan kendaraan ringan dan servis berkala.	Lulusan SMK otomotif, teliti, siap shift	Jakarta Timur	Full Time	Rp3.500.000 - Rp4.500.000	2026-08-31 00:00:00	DRAFT	\N	2026-06-05 12:34:48.809	2026-06-05 12:34:48.809	\N
seed-job-vacancy-2	seed-industry-partner-2	Staff Administrasi Digital	CV Digital Nusantara	Mengelola data operasional dan dokumentasi digital perusahaan.	Terbiasa spreadsheet, komunikasi baik	Bandung	Contract	Rp3.000.000 - Rp4.000.000	2026-09-30 00:00:00	PUBLISHED	2026-06-15 00:00:00	2026-06-05 12:34:48.814	2026-06-05 12:34:48.814	\N
\.


--
-- Data for Name: lesson_hours; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.lesson_hours (id, name, "order", start_time, end_time, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-lh-1	Jam 1	1	07:00	08:00	t	2026-06-05 12:34:48.614	2026-06-05 12:34:48.614	\N
seed-lh-2	Jam 2	2	08:00	09:00	t	2026-06-05 12:34:48.618	2026-06-05 12:34:48.618	\N
\.


--
-- Data for Name: notification_templates; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.notification_templates (id, code, name, channel, subject, body, is_active, created_by_id, created_at, updated_at, deleted_at) FROM stdin;
seed-template-1	ANNOUNCEMENT_PUBLISHED	Pengumuman Dipublikasikan	IN_APP	Pengumuman baru	Pengumuman {{title}} telah dipublikasikan.	t	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.852	2026-06-05 12:34:48.852	\N
seed-template-2	REPORT_COMPLETED	Laporan Selesai	EMAIL	Laporan {{title}} selesai	Laporan yang Anda minta sudah selesai diproses.	t	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.855	2026-06-05 12:34:48.855	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.notifications (id, user_id, title, body, channel, status, read_at, metadata, created_at, updated_at) FROM stdin;
seed-notification-1	cmq0wpi7r004zlr3e1bl37xe8	Pengumuman baru terbit	Jadwal ujian akhir semester sudah dipublikasikan.	IN_APP	UNREAD	\N	{"module": "announcements"}	2026-06-05 12:34:48.844	2026-06-05 12:34:48.844
seed-notification-2	cmq0wpi7r004zlr3e1bl37xe8	Laporan selesai	Export laporan siswa berhasil dibuat.	IN_APP	READ	2026-06-04 00:00:00	{"module": "reports"}	2026-06-05 12:34:48.848	2026-06-05 12:34:48.848
seed-notification-3	cmq0wpi7r004zlr3e1bl37xe8	Template pesan aktif	Template notifikasi pembayaran sudah aktif.	EMAIL	UNREAD	\N	{"module": "templates"}	2026-06-05 12:34:48.85	2026-06-05 12:34:48.85
\.


--
-- Data for Name: payment_categories; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.payment_categories (id, code, name, description, default_amount, is_active, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.payments (id, payment_number, invoice_id, amount, method, status, paid_at, verified_at, verified_by_id, proof_url, note, created_at, updated_at) FROM stdin;
seed-payment-1	PAY-202606-00001	seed-invoice-1	500000.000000000000000000000000000000	BANK_TRANSFER	VERIFIED	2026-06-05 00:00:00	2026-06-05 00:00:00	cmq0wpi7r004zlr3e1bl37xe8	\N	Pembayaran lunas	2026-06-05 12:34:48.728	2026-06-05 12:34:48.728
seed-payment-2	PAY-202606-00002	seed-invoice-1	300000.000000000000000000000000000000	CASH	PENDING	2026-06-10 00:00:00	\N	\N	\N	\N	2026-06-05 12:34:48.732	2026-06-05 12:34:48.732
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.permissions (id, key, name, "group", description, created_at, updated_at) FROM stdin;
cmq0wphd00000lr3egmo6bgwv	dashboard.view	dashboard.view	dashboard	Permission dashboard.view	2026-06-05 12:34:47.46	2026-06-05 12:34:47.46
cmq0wphd60001lr3em3ne9gud	users.view	users.view	users	Permission users.view	2026-06-05 12:34:47.467	2026-06-05 12:34:47.467
cmq0wphd80002lr3efr61m8gp	users.create	users.create	users	Permission users.create	2026-06-05 12:34:47.468	2026-06-05 12:34:47.468
cmq0wphda0003lr3ek62wozbr	users.update	users.update	users	Permission users.update	2026-06-05 12:34:47.47	2026-06-05 12:34:47.47
cmq0wphdc0004lr3eafgfov0h	users.delete	users.delete	users	Permission users.delete	2026-06-05 12:34:47.472	2026-06-05 12:34:47.472
cmq0wphde0005lr3eybrfogf1	roles.view	roles.view	roles	Permission roles.view	2026-06-05 12:34:47.474	2026-06-05 12:34:47.474
cmq0wphdf0006lr3edktnnb8s	roles.create	roles.create	roles	Permission roles.create	2026-06-05 12:34:47.475	2026-06-05 12:34:47.475
cmq0wphdh0007lr3eto560b0y	roles.update	roles.update	roles	Permission roles.update	2026-06-05 12:34:47.477	2026-06-05 12:34:47.477
cmq0wphdi0008lr3eunqqz3pd	roles.delete	roles.delete	roles	Permission roles.delete	2026-06-05 12:34:47.479	2026-06-05 12:34:47.479
cmq0wphdk0009lr3ear3sieho	permissions.view	permissions.view	permissions	Permission permissions.view	2026-06-05 12:34:47.48	2026-06-05 12:34:47.48
cmq0wphdl000alr3ee5bid0jr	school-profile.view	school-profile.view	school-profile	Permission school-profile.view	2026-06-05 12:34:47.482	2026-06-05 12:34:47.482
cmq0wphdn000blr3ehmz7df0z	school-profile.update	school-profile.update	school-profile	Permission school-profile.update	2026-06-05 12:34:47.483	2026-06-05 12:34:47.483
cmq0wphdo000clr3en5nn9rxn	master-data.view	master-data.view	master-data	Permission master-data.view	2026-06-05 12:34:47.485	2026-06-05 12:34:47.485
cmq0wphdp000dlr3egitdeb7p	master-data.create	master-data.create	master-data	Permission master-data.create	2026-06-05 12:34:47.486	2026-06-05 12:34:47.486
cmq0wphdr000elr3ebij726h2	master-data.update	master-data.update	master-data	Permission master-data.update	2026-06-05 12:34:47.487	2026-06-05 12:34:47.487
cmq0wphds000flr3eawvoqfzi	master-data.delete	master-data.delete	master-data	Permission master-data.delete	2026-06-05 12:34:47.489	2026-06-05 12:34:47.489
cmq0wphdu000glr3e1drre922	master-data.import	master-data.import	master-data	Permission master-data.import	2026-06-05 12:34:47.49	2026-06-05 12:34:47.49
cmq0wphdv000hlr3eq52ntjin	master-data.export	master-data.export	master-data	Permission master-data.export	2026-06-05 12:34:47.492	2026-06-05 12:34:47.492
cmq0wphdx000ilr3euoxjdflv	students.view	students.view	students	Permission students.view	2026-06-05 12:34:47.493	2026-06-05 12:34:47.493
cmq0wphdy000jlr3e107tynan	students.create	students.create	students	Permission students.create	2026-06-05 12:34:47.494	2026-06-05 12:34:47.494
cmq0wphe0000klr3eyy4m8sv1	students.update	students.update	students	Permission students.update	2026-06-05 12:34:47.496	2026-06-05 12:34:47.496
cmq0wphe1000llr3eciqzn2u9	students.delete	students.delete	students	Permission students.delete	2026-06-05 12:34:47.497	2026-06-05 12:34:47.497
cmq0wphe2000mlr3e17cn71xm	students.import	students.import	students	Permission students.import	2026-06-05 12:34:47.499	2026-06-05 12:34:47.499
cmq0wphe4000nlr3e7ngxh192	students.export	students.export	students	Permission students.export	2026-06-05 12:34:47.5	2026-06-05 12:34:47.5
cmq0wphe6000olr3ejcvwdjsp	guardians.view	guardians.view	guardians	Permission guardians.view	2026-06-05 12:34:47.503	2026-06-05 12:34:47.503
cmq0wphe8000plr3eajt5xrgd	guardians.create	guardians.create	guardians	Permission guardians.create	2026-06-05 12:34:47.504	2026-06-05 12:34:47.504
cmq0wphe9000qlr3e74p7aomo	guardians.update	guardians.update	guardians	Permission guardians.update	2026-06-05 12:34:47.505	2026-06-05 12:34:47.505
cmq0wphea000rlr3e5zsyggzt	guardians.delete	guardians.delete	guardians	Permission guardians.delete	2026-06-05 12:34:47.507	2026-06-05 12:34:47.507
cmq0wphec000slr3ezuzutkhn	guardians.import	guardians.import	guardians	Permission guardians.import	2026-06-05 12:34:47.508	2026-06-05 12:34:47.508
cmq0wphed000tlr3euzttx1ni	guardians.export	guardians.export	guardians	Permission guardians.export	2026-06-05 12:34:47.509	2026-06-05 12:34:47.509
cmq0wphee000ulr3esxxa8iiy	teachers.view	teachers.view	teachers	Permission teachers.view	2026-06-05 12:34:47.511	2026-06-05 12:34:47.511
cmq0wpheg000vlr3e3qvint09	teachers.create	teachers.create	teachers	Permission teachers.create	2026-06-05 12:34:47.512	2026-06-05 12:34:47.512
cmq0wpheh000wlr3erftql2ef	teachers.update	teachers.update	teachers	Permission teachers.update	2026-06-05 12:34:47.514	2026-06-05 12:34:47.514
cmq0wphej000xlr3ekj6tmryn	teachers.delete	teachers.delete	teachers	Permission teachers.delete	2026-06-05 12:34:47.515	2026-06-05 12:34:47.515
cmq0wphek000ylr3eez6cunwf	teachers.import	teachers.import	teachers	Permission teachers.import	2026-06-05 12:34:47.516	2026-06-05 12:34:47.516
cmq0wphel000zlr3e1x7tey5h	teachers.export	teachers.export	teachers	Permission teachers.export	2026-06-05 12:34:47.518	2026-06-05 12:34:47.518
cmq0wphem0010lr3el1pce9dd	staffs.view	staffs.view	staffs	Permission staffs.view	2026-06-05 12:34:47.519	2026-06-05 12:34:47.519
cmq0wpheo0011lr3ennyesqcy	staffs.create	staffs.create	staffs	Permission staffs.create	2026-06-05 12:34:47.52	2026-06-05 12:34:47.52
cmq0wphep0012lr3ehkev53td	staffs.update	staffs.update	staffs	Permission staffs.update	2026-06-05 12:34:47.521	2026-06-05 12:34:47.521
cmq0wpheq0013lr3eiw2yawnm	staffs.delete	staffs.delete	staffs	Permission staffs.delete	2026-06-05 12:34:47.523	2026-06-05 12:34:47.523
cmq0wphes0014lr3e27l8bea5	staffs.import	staffs.import	staffs	Permission staffs.import	2026-06-05 12:34:47.524	2026-06-05 12:34:47.524
cmq0wphet0015lr3ejnt2cl5k	staffs.export	staffs.export	staffs	Permission staffs.export	2026-06-05 12:34:47.525	2026-06-05 12:34:47.525
cmq0wpheu0016lr3ejqpgd82q	teaching-assignments.view	teaching-assignments.view	teaching-assignments	Permission teaching-assignments.view	2026-06-05 12:34:47.526	2026-06-05 12:34:47.526
cmq0wphev0017lr3e9pn00g8b	teaching-assignments.manage	teaching-assignments.manage	teaching-assignments	Permission teaching-assignments.manage	2026-06-05 12:34:47.527	2026-06-05 12:34:47.527
cmq0wphew0018lr3em78ntkln	schedules.view	schedules.view	schedules	Permission schedules.view	2026-06-05 12:34:47.529	2026-06-05 12:34:47.529
cmq0wphex0019lr3e6kigrqem	schedules.manage	schedules.manage	schedules	Permission schedules.manage	2026-06-05 12:34:47.53	2026-06-05 12:34:47.53
cmq0wphez001alr3ecq98uwq7	attendance.view	attendance.view	attendance	Permission attendance.view	2026-06-05 12:34:47.531	2026-06-05 12:34:47.531
cmq0wphf0001blr3efgz4zha4	attendance.record	attendance.record	attendance	Permission attendance.record	2026-06-05 12:34:47.532	2026-06-05 12:34:47.532
cmq0wphf1001clr3eyr130fgg	attendance.update	attendance.update	attendance	Permission attendance.update	2026-06-05 12:34:47.534	2026-06-05 12:34:47.534
cmq0wphf2001dlr3esmpfybx5	attendance.approve	attendance.approve	attendance	Permission attendance.approve	2026-06-05 12:34:47.535	2026-06-05 12:34:47.535
cmq0wphf3001elr3etd2fjr5k	attendance.export	attendance.export	attendance	Permission attendance.export	2026-06-05 12:34:47.536	2026-06-05 12:34:47.536
cmq0wphf5001flr3edxq4l8cz	attendance.print	attendance.print	attendance	Permission attendance.print	2026-06-05 12:34:47.537	2026-06-05 12:34:47.537
cmq0wphf6001glr3e677ft7zq	grades.view	grades.view	grades	Permission grades.view	2026-06-05 12:34:47.538	2026-06-05 12:34:47.538
cmq0wphf7001hlr3e2c9wuw1b	grades.input	grades.input	grades	Permission grades.input	2026-06-05 12:34:47.539	2026-06-05 12:34:47.539
cmq0wphf8001ilr3erbt3wiq2	grades.update	grades.update	grades	Permission grades.update	2026-06-05 12:34:47.54	2026-06-05 12:34:47.54
cmq0wphf9001jlr3evyt0o9pq	grades.approve	grades.approve	grades	Permission grades.approve	2026-06-05 12:34:47.541	2026-06-05 12:34:47.541
cmq0wphfa001klr3e2zxrgx3w	grades.publish	grades.publish	grades	Permission grades.publish	2026-06-05 12:34:47.543	2026-06-05 12:34:47.543
cmq0wphfb001llr3e6gzwiwpm	grades.export	grades.export	grades	Permission grades.export	2026-06-05 12:34:47.544	2026-06-05 12:34:47.544
cmq0wphfd001mlr3en7e5bzfm	grades.print	grades.print	grades	Permission grades.print	2026-06-05 12:34:47.545	2026-06-05 12:34:47.545
cmq0wphfe001nlr3ewtawu9eu	invoices.view	invoices.view	invoices	Permission invoices.view	2026-06-05 12:34:47.547	2026-06-05 12:34:47.547
cmq0wphff001olr3eb6ima827	invoices.create	invoices.create	invoices	Permission invoices.create	2026-06-05 12:34:47.548	2026-06-05 12:34:47.548
cmq0wphfh001plr3eh7euk6lq	invoices.update	invoices.update	invoices	Permission invoices.update	2026-06-05 12:34:47.549	2026-06-05 12:34:47.549
cmq0wphfi001qlr3e4fskeb11	invoices.delete	invoices.delete	invoices	Permission invoices.delete	2026-06-05 12:34:47.55	2026-06-05 12:34:47.55
cmq0wphfj001rlr3e63n3b3a8	invoices.issue	invoices.issue	invoices	Permission invoices.issue	2026-06-05 12:34:47.552	2026-06-05 12:34:47.552
cmq0wphfl001slr3eje1bpzyn	invoices.cancel	invoices.cancel	invoices	Permission invoices.cancel	2026-06-05 12:34:47.553	2026-06-05 12:34:47.553
cmq0wphfm001tlr3ehpy79fka	invoices.print	invoices.print	invoices	Permission invoices.print	2026-06-05 12:34:47.554	2026-06-05 12:34:47.554
cmq0wphfn001ulr3e9g7ic41u	payments.view	payments.view	payments	Permission payments.view	2026-06-05 12:34:47.556	2026-06-05 12:34:47.556
cmq0wphfo001vlr3exj1nepge	payments.create	payments.create	payments	Permission payments.create	2026-06-05 12:34:47.557	2026-06-05 12:34:47.557
cmq0wphfq001wlr3ens9m9op7	payments.verify	payments.verify	payments	Permission payments.verify	2026-06-05 12:34:47.558	2026-06-05 12:34:47.558
cmq0wphfr001xlr3et86ddgym	payments.reject	payments.reject	payments	Permission payments.reject	2026-06-05 12:34:47.559	2026-06-05 12:34:47.559
cmq0wphft001ylr3edujdlc6b	payments.cancel	payments.cancel	payments	Permission payments.cancel	2026-06-05 12:34:47.561	2026-06-05 12:34:47.561
cmq0wphfu001zlr3e8gtxsrwd	payments.print	payments.print	payments	Permission payments.print	2026-06-05 12:34:47.563	2026-06-05 12:34:47.563
cmq0wphfw0020lr3euxk2jcv5	teacher-portal.view	teacher-portal.view	teacher-portal	Permission teacher-portal.view	2026-06-05 12:34:47.564	2026-06-05 12:34:47.564
cmq0wphfx0021lr3e7nyk5105	student-portal.view	student-portal.view	student-portal	Permission student-portal.view	2026-06-05 12:34:47.566	2026-06-05 12:34:47.566
cmq0wphfz0022lr3e4q3ym6tz	guardian-portal.view	guardian-portal.view	guardian-portal	Permission guardian-portal.view	2026-06-05 12:34:47.567	2026-06-05 12:34:47.567
cmq0wphg00023lr3ereyy27cj	expenses.view	expenses.view	expenses	Permission expenses.view	2026-06-05 12:34:47.568	2026-06-05 12:34:47.568
cmq0wphg10024lr3ereihnz0j	expenses.create	expenses.create	expenses	Permission expenses.create	2026-06-05 12:34:47.57	2026-06-05 12:34:47.57
cmq0wphg30025lr3es37bx9xg	expenses.update	expenses.update	expenses	Permission expenses.update	2026-06-05 12:34:47.571	2026-06-05 12:34:47.571
cmq0wphg40026lr3e46o2n85h	expenses.delete	expenses.delete	expenses	Permission expenses.delete	2026-06-05 12:34:47.573	2026-06-05 12:34:47.573
cmq0wphg60027lr3e960k1ym4	expenses.approve	expenses.approve	expenses	Permission expenses.approve	2026-06-05 12:34:47.574	2026-06-05 12:34:47.574
cmq0wphg70028lr3e595lx151	expenses.pay	expenses.pay	expenses	Permission expenses.pay	2026-06-05 12:34:47.575	2026-06-05 12:34:47.575
cmq0wphg80029lr3eb901eybh	finance.view	finance.view	finance	Permission finance.view	2026-06-05 12:34:47.577	2026-06-05 12:34:47.577
cmq0wphga002alr3ebg7qbfnq	finance.export	finance.export	finance	Permission finance.export	2026-06-05 12:34:47.578	2026-06-05 12:34:47.578
cmq0wphgb002blr3evgkui70e	ppdb.view	ppdb.view	ppdb	Permission ppdb.view	2026-06-05 12:34:47.579	2026-06-05 12:34:47.579
cmq0wphgc002clr3evxtshbdt	ppdb.create	ppdb.create	ppdb	Permission ppdb.create	2026-06-05 12:34:47.58	2026-06-05 12:34:47.58
cmq0wphgd002dlr3efqyrlr5t	ppdb.update	ppdb.update	ppdb	Permission ppdb.update	2026-06-05 12:34:47.582	2026-06-05 12:34:47.582
cmq0wphge002elr3ezb87opva	ppdb.delete	ppdb.delete	ppdb	Permission ppdb.delete	2026-06-05 12:34:47.583	2026-06-05 12:34:47.583
cmq0wphgg002flr3e0ywxcc9c	ppdb.verify	ppdb.verify	ppdb	Permission ppdb.verify	2026-06-05 12:34:47.584	2026-06-05 12:34:47.584
cmq0wphgh002glr3eqw4bpn4v	ppdb.approve	ppdb.approve	ppdb	Permission ppdb.approve	2026-06-05 12:34:47.585	2026-06-05 12:34:47.585
cmq0wphgi002hlr3eiixupy1h	ppdb.reject	ppdb.reject	ppdb	Permission ppdb.reject	2026-06-05 12:34:47.586	2026-06-05 12:34:47.586
cmq0wphgj002ilr3e7ocu0llv	ppdb.convert	ppdb.convert	ppdb	Permission ppdb.convert	2026-06-05 12:34:47.587	2026-06-05 12:34:47.587
cmq0wphgk002jlr3ezf5hnrm0	ppdb.export	ppdb.export	ppdb	Permission ppdb.export	2026-06-05 12:34:47.589	2026-06-05 12:34:47.589
cmq0wphgm002klr3e5kc7vxfa	ppdb.print	ppdb.print	ppdb	Permission ppdb.print	2026-06-05 12:34:47.59	2026-06-05 12:34:47.59
cmq0wphgn002llr3ec6org46i	industry-partners.view	industry-partners.view	industry-partners	Permission industry-partners.view	2026-06-05 12:34:47.591	2026-06-05 12:34:47.591
cmq0wphgo002mlr3ee03uy6kd	industry-partners.create	industry-partners.create	industry-partners	Permission industry-partners.create	2026-06-05 12:34:47.592	2026-06-05 12:34:47.592
cmq0wphgp002nlr3e8ihmz2vf	industry-partners.update	industry-partners.update	industry-partners	Permission industry-partners.update	2026-06-05 12:34:47.594	2026-06-05 12:34:47.594
cmq0wphgq002olr3empr2ts36	industry-partners.delete	industry-partners.delete	industry-partners	Permission industry-partners.delete	2026-06-05 12:34:47.595	2026-06-05 12:34:47.595
cmq0wphgs002plr3eyg15sgqj	internships.view	internships.view	internships	Permission internships.view	2026-06-05 12:34:47.596	2026-06-05 12:34:47.596
cmq0wphgt002qlr3eecwym18v	internships.create	internships.create	internships	Permission internships.create	2026-06-05 12:34:47.598	2026-06-05 12:34:47.598
cmq0wphgv002rlr3et2cdgler	internships.update	internships.update	internships	Permission internships.update	2026-06-05 12:34:47.599	2026-06-05 12:34:47.599
cmq0wphgw002slr3ezgehhq23	internships.delete	internships.delete	internships	Permission internships.delete	2026-06-05 12:34:47.601	2026-06-05 12:34:47.601
cmq0wphgy002tlr3emp26211b	internships.start	internships.start	internships	Permission internships.start	2026-06-05 12:34:47.602	2026-06-05 12:34:47.602
cmq0wphh0002ulr3ee4wziq33	internships.complete	internships.complete	internships	Permission internships.complete	2026-06-05 12:34:47.604	2026-06-05 12:34:47.604
cmq0wphh2002vlr3e895hyfwd	internships.cancel	internships.cancel	internships	Permission internships.cancel	2026-06-05 12:34:47.606	2026-06-05 12:34:47.606
cmq0wphh3002wlr3erku810ky	internships.score	internships.score	internships	Permission internships.score	2026-06-05 12:34:47.607	2026-06-05 12:34:47.607
cmq0wphh5002xlr3e4sl9l803	internship-logs.view	internship-logs.view	internship-logs	Permission internship-logs.view	2026-06-05 12:34:47.609	2026-06-05 12:34:47.609
cmq0wphh6002ylr3e2y65hxd2	internship-logs.create	internship-logs.create	internship-logs	Permission internship-logs.create	2026-06-05 12:34:47.61	2026-06-05 12:34:47.61
cmq0wphh8002zlr3evt7soiys	internship-logs.update	internship-logs.update	internship-logs	Permission internship-logs.update	2026-06-05 12:34:47.612	2026-06-05 12:34:47.612
cmq0wphh90030lr3e851tzdh5	internship-logs.approve	internship-logs.approve	internship-logs	Permission internship-logs.approve	2026-06-05 12:34:47.614	2026-06-05 12:34:47.614
cmq0wphha0031lr3e3vugi071	internship-logs.reject	internship-logs.reject	internship-logs	Permission internship-logs.reject	2026-06-05 12:34:47.615	2026-06-05 12:34:47.615
cmq0wphhc0032lr3epukoudo9	alumni.view	alumni.view	alumni	Permission alumni.view	2026-06-05 12:34:47.616	2026-06-05 12:34:47.616
cmq0wphhd0033lr3emvybcmr1	alumni.create	alumni.create	alumni	Permission alumni.create	2026-06-05 12:34:47.617	2026-06-05 12:34:47.617
cmq0wphhe0034lr3eyywsso8m	alumni.update	alumni.update	alumni	Permission alumni.update	2026-06-05 12:34:47.619	2026-06-05 12:34:47.619
cmq0wphhf0035lr3efbijko9k	alumni.delete	alumni.delete	alumni	Permission alumni.delete	2026-06-05 12:34:47.62	2026-06-05 12:34:47.62
cmq0wphhg0036lr3e2s57m4dt	alumni.convert	alumni.convert	alumni	Permission alumni.convert	2026-06-05 12:34:47.621	2026-06-05 12:34:47.621
cmq0wphhi0037lr3eq65amrmm	job-vacancies.view	job-vacancies.view	job-vacancies	Permission job-vacancies.view	2026-06-05 12:34:47.622	2026-06-05 12:34:47.622
cmq0wphhj0038lr3e5ebnc8tg	job-vacancies.create	job-vacancies.create	job-vacancies	Permission job-vacancies.create	2026-06-05 12:34:47.623	2026-06-05 12:34:47.623
cmq0wphhk0039lr3exza6r358	job-vacancies.update	job-vacancies.update	job-vacancies	Permission job-vacancies.update	2026-06-05 12:34:47.624	2026-06-05 12:34:47.624
cmq0wphhl003alr3e1158cwpt	job-vacancies.delete	job-vacancies.delete	job-vacancies	Permission job-vacancies.delete	2026-06-05 12:34:47.626	2026-06-05 12:34:47.626
cmq0wphhm003blr3eov8nvsoz	job-vacancies.publish	job-vacancies.publish	job-vacancies	Permission job-vacancies.publish	2026-06-05 12:34:47.627	2026-06-05 12:34:47.627
cmq0wphhn003clr3ev95z34to	job-vacancies.close	job-vacancies.close	job-vacancies	Permission job-vacancies.close	2026-06-05 12:34:47.628	2026-06-05 12:34:47.628
cmq0wphhp003dlr3e2dn6yyck	job-applications.view	job-applications.view	job-applications	Permission job-applications.view	2026-06-05 12:34:47.629	2026-06-05 12:34:47.629
cmq0wphhq003elr3egxolom55	job-applications.update	job-applications.update	job-applications	Permission job-applications.update	2026-06-05 12:34:47.63	2026-06-05 12:34:47.63
cmq0wphhr003flr3eitt4k491	job-applications.review	job-applications.review	job-applications	Permission job-applications.review	2026-06-05 12:34:47.631	2026-06-05 12:34:47.631
cmq0wphhs003glr3ej4xkdpfm	job-applications.accept	job-applications.accept	job-applications	Permission job-applications.accept	2026-06-05 12:34:47.632	2026-06-05 12:34:47.632
cmq0wphht003hlr3edce8lin4	job-applications.reject	job-applications.reject	job-applications	Permission job-applications.reject	2026-06-05 12:34:47.634	2026-06-05 12:34:47.634
cmq0wphhu003ilr3ev0yb98sv	tracer-studies.view	tracer-studies.view	tracer-studies	Permission tracer-studies.view	2026-06-05 12:34:47.635	2026-06-05 12:34:47.635
cmq0wphhw003jlr3e7o9isd8o	tracer-studies.create	tracer-studies.create	tracer-studies	Permission tracer-studies.create	2026-06-05 12:34:47.636	2026-06-05 12:34:47.636
cmq0wphhx003klr3e75j782a0	tracer-studies.update	tracer-studies.update	tracer-studies	Permission tracer-studies.update	2026-06-05 12:34:47.637	2026-06-05 12:34:47.637
cmq0wphhy003llr3ex65com8s	tracer-studies.delete	tracer-studies.delete	tracer-studies	Permission tracer-studies.delete	2026-06-05 12:34:47.639	2026-06-05 12:34:47.639
cmq0wphhz003mlr3e4uzt3qpk	bkk.view	bkk.view	bkk	Permission bkk.view	2026-06-05 12:34:47.64	2026-06-05 12:34:47.64
cmq0wphi1003nlr3eik6se2fo	bkk.export	bkk.export	bkk	Permission bkk.export	2026-06-05 12:34:47.641	2026-06-05 12:34:47.641
cmq0wphi2003olr3ehzyv90ss	announcements.view	announcements.view	announcements	Permission announcements.view	2026-06-05 12:34:47.642	2026-06-05 12:34:47.642
cmq0wphi4003plr3evlfzzn6j	announcements.create	announcements.create	announcements	Permission announcements.create	2026-06-05 12:34:47.644	2026-06-05 12:34:47.644
cmq0wphi5003qlr3e42h5i5my	announcements.update	announcements.update	announcements	Permission announcements.update	2026-06-05 12:34:47.645	2026-06-05 12:34:47.645
cmq0wphi6003rlr3elv3s5xhj	announcements.delete	announcements.delete	announcements	Permission announcements.delete	2026-06-05 12:34:47.647	2026-06-05 12:34:47.647
cmq0wphi7003slr3ew9roelpe	announcements.publish	announcements.publish	announcements	Permission announcements.publish	2026-06-05 12:34:47.648	2026-06-05 12:34:47.648
cmq0wphi9003tlr3ec2ba3gmr	announcements.archive	announcements.archive	announcements	Permission announcements.archive	2026-06-05 12:34:47.649	2026-06-05 12:34:47.649
cmq0wphib003ulr3e9b2cirgf	messages.view	messages.view	messages	Permission messages.view	2026-06-05 12:34:47.651	2026-06-05 12:34:47.651
cmq0wphic003vlr3egmlw6ard	messages.send	messages.send	messages	Permission messages.send	2026-06-05 12:34:47.652	2026-06-05 12:34:47.652
cmq0wphid003wlr3e5m3fgjpt	messages.read	messages.read	messages	Permission messages.read	2026-06-05 12:34:47.654	2026-06-05 12:34:47.654
cmq0wphie003xlr3egyizezlg	messages.delete	messages.delete	messages	Permission messages.delete	2026-06-05 12:34:47.655	2026-06-05 12:34:47.655
cmq0wphif003ylr3ex4q58tgc	notifications.view	notifications.view	notifications	Permission notifications.view	2026-06-05 12:34:47.656	2026-06-05 12:34:47.656
cmq0wphih003zlr3exqw6y0td	notifications.create	notifications.create	notifications	Permission notifications.create	2026-06-05 12:34:47.657	2026-06-05 12:34:47.657
cmq0wphij0040lr3elxriny85	notifications.read	notifications.read	notifications	Permission notifications.read	2026-06-05 12:34:47.659	2026-06-05 12:34:47.659
cmq0wphik0041lr3e6uiti7u5	notifications.archive	notifications.archive	notifications	Permission notifications.archive	2026-06-05 12:34:47.661	2026-06-05 12:34:47.661
cmq0wphim0042lr3e3m3ylstl	notification-templates.view	notification-templates.view	notification-templates	Permission notification-templates.view	2026-06-05 12:34:47.662	2026-06-05 12:34:47.662
cmq0wphin0043lr3ezpzhigyi	notification-templates.create	notification-templates.create	notification-templates	Permission notification-templates.create	2026-06-05 12:34:47.663	2026-06-05 12:34:47.663
cmq0wphio0044lr3eesuch3uq	notification-templates.update	notification-templates.update	notification-templates	Permission notification-templates.update	2026-06-05 12:34:47.664	2026-06-05 12:34:47.664
cmq0wphip0045lr3eow0fm6id	notification-templates.delete	notification-templates.delete	notification-templates	Permission notification-templates.delete	2026-06-05 12:34:47.666	2026-06-05 12:34:47.666
cmq0wphiq0046lr3el595aegq	reports.view	reports.view	reports	Permission reports.view	2026-06-05 12:34:47.667	2026-06-05 12:34:47.667
cmq0wphis0047lr3e4mc0edy7	reports.generate	reports.generate	reports	Permission reports.generate	2026-06-05 12:34:47.668	2026-06-05 12:34:47.668
cmq0wphit0048lr3e7b5segmu	reports.download	reports.download	reports	Permission reports.download	2026-06-05 12:34:47.67	2026-06-05 12:34:47.67
cmq0wphiu0049lr3ehc1al4zr	reports.export	reports.export	reports	Permission reports.export	2026-06-05 12:34:47.671	2026-06-05 12:34:47.671
cmq0wphiw004alr3e4gy84mgf	reports.cancel	reports.cancel	reports	Permission reports.cancel	2026-06-05 12:34:47.672	2026-06-05 12:34:47.672
cmq0wphix004blr3eqiulk68n	reports.academic	reports.academic	reports	Permission reports.academic	2026-06-05 12:34:47.674	2026-06-05 12:34:47.674
cmq0wphiy004clr3e2nn13lye	reports.finance	reports.finance	reports	Permission reports.finance	2026-06-05 12:34:47.675	2026-06-05 12:34:47.675
cmq0wphj0004dlr3egno6zoci	reports.ppdb	reports.ppdb	reports	Permission reports.ppdb	2026-06-05 12:34:47.676	2026-06-05 12:34:47.676
cmq0wphj1004elr3edml5hckk	reports.pkl_bkk	reports.pkl_bkk	reports	Permission reports.pkl_bkk	2026-06-05 12:34:47.677	2026-06-05 12:34:47.677
cmq0wphj2004flr3e1ggbgaum	reports.communication	reports.communication	reports	Permission reports.communication	2026-06-05 12:34:47.679	2026-06-05 12:34:47.679
cmq0wphj4004glr3ekcymt08o	report-jobs.view	report-jobs.view	report-jobs	Permission report-jobs.view	2026-06-05 12:34:47.68	2026-06-05 12:34:47.68
cmq0wphj5004hlr3evpqytc1d	report-jobs.create	report-jobs.create	report-jobs	Permission report-jobs.create	2026-06-05 12:34:47.681	2026-06-05 12:34:47.681
cmq0wphj6004ilr3eufvdu5qe	report-jobs.cancel	report-jobs.cancel	report-jobs	Permission report-jobs.cancel	2026-06-05 12:34:47.682	2026-06-05 12:34:47.682
cmq0wphj7004jlr3enzpjjzh0	export-history.view	export-history.view	export-history	Permission export-history.view	2026-06-05 12:34:47.684	2026-06-05 12:34:47.684
cmq0wphj9004klr3edjf0p982	export-history.export	export-history.export	export-history	Permission export-history.export	2026-06-05 12:34:47.685	2026-06-05 12:34:47.685
\.


--
-- Data for Name: ppdb_documents; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.ppdb_documents (id, registration_id, name, file_url, status, note, created_at, updated_at) FROM stdin;
seed-ppdb-doc-1	seed-ppdb-reg-1	Akte Kelahiran	/uploads/ppdb/akte-bambang.pdf	PENDING	\N	2026-06-05 12:34:48.75	2026-06-05 12:34:48.75
seed-ppdb-doc-2	seed-ppdb-reg-2	Kartu Keluarga	/uploads/ppdb/kk-siti.pdf	VERIFIED	\N	2026-06-05 12:34:48.753	2026-06-05 12:34:48.753
\.


--
-- Data for Name: ppdb_periods; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.ppdb_periods (id, name, academic_year_id, start_date, end_date, is_active, quota, created_at, updated_at) FROM stdin;
seed-ppdb-period-1	PPDB Gelombang 1 TA 2026/2027	seed-ay-2025	2026-01-01 00:00:00	2026-07-31 00:00:00	t	100	2026-06-05 12:34:48.74	2026-06-05 12:34:48.74
\.


--
-- Data for Name: ppdb_registrations; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.ppdb_registrations (id, registration_number, period_id, name, gender, birth_place, birth_date, address, phone, email, previous_school, selected_department_id, selected_competency_id, status, selection_status, verified_at, verified_by_id, converted_student_id, note, created_at, updated_at) FROM stdin;
seed-ppdb-reg-1	REG-202606-00001	seed-ppdb-period-1	Bambang Suprapto	MALE	\N	\N	\N	081111222333	\N	SMP Negeri 1 Jakarta	\N	\N	SUBMITTED	PENDING	\N	\N	\N	\N	2026-06-05 12:34:48.742	2026-06-05 12:34:48.742
seed-ppdb-reg-2	REG-202606-00002	seed-ppdb-period-1	Siti Rahmawati	FEMALE	\N	\N	\N	081111222334	\N	SDIT Al-Azhar	seed-dept-tkr	\N	ACCEPTED	PASSED	2026-06-10 00:00:00	cmq0wpi7r004zlr3e1bl37xe8	\N	\N	2026-06-05 12:34:48.747	2026-06-05 12:34:48.747
\.


--
-- Data for Name: ppdb_status_histories; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.ppdb_status_histories (id, registration_id, from_status, to_status, note, changed_by_id, created_at) FROM stdin;
cmq0wpid0005ilr3erol83rpv	seed-ppdb-reg-1	\N	SUBMITTED	\N	\N	2026-06-05 12:34:48.756
cmq0wpid3005klr3e1ixcckz0	seed-ppdb-reg-2	\N	SUBMITTED	\N	\N	2026-06-05 12:34:48.759
cmq0wpid4005mlr3erxmgqokx	seed-ppdb-reg-2	SUBMITTED	VERIFIED	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.76
cmq0wpid6005olr3e7mjl6iy2	seed-ppdb-reg-2	VERIFIED	ACCEPTED	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-05 12:34:48.762
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at, ip_address, user_agent) FROM stdin;
1e40b856-f1be-45f2-a417-bf7df8ef9a3c	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$NBW7UEAkV5HjZsztKWLW...FXRoaoPLZBFa13aw1IPRbOA.Dt.KVe	2026-06-12 12:35:13.547	\N	2026-06-05 12:35:13.549	172.18.0.1	curl/8.18.0
66476387-7c12-48b4-a926-d57266b1ae9b	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$nmcK5i7OLkoZaXqfh.56De4yqPhtWwP.fqKc475sg6geKsrB8Yhge	2026-06-12 12:43:37.776	\N	2026-06-05 12:43:37.777	172.18.0.1	curl/8.18.0
c45c46ba-15e6-4100-ae46-58ea2ca1fb2e	cmq0wpipa005plr3etedgrwwq	$2a$12$PQXJebNEVC2zTQFpBCHM7OHY5uFHoSkOP/6i8ZsWzKhtzeXDyImi.	2026-06-12 12:43:38.425	\N	2026-06-05 12:43:38.426	172.18.0.1	curl/8.18.0
60a52a73-db52-4411-8ed6-a3c2f67170e9	cmq0wpipi005qlr3ed8m8otq8	$2a$12$AR7Mm6l8a7oeLIB6cnbg/e6m4n5AzlLRo1OpP94EQlYbXGkFYKU1i	2026-06-12 12:43:39.043	\N	2026-06-05 12:43:39.044	172.18.0.1	curl/8.18.0
3ca31cae-e359-45c1-8615-6e2102fd866b	cmq0wpipr005rlr3e8w54v7rv	$2a$12$ZdxUamLhRECrP5U7tp6u/OJQazOMtD.DFBREG9VaJ6CCVxrsCUMAO	2026-06-12 12:43:39.664	\N	2026-06-05 12:43:39.665	172.18.0.1	curl/8.18.0
5b7f5143-89b1-4f32-84cf-aed1e67763bf	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$iwYEP0F0lbyTSL4wHE1fYe.Mm3HZki4SCS0ngSOIC3tPhebLIHmau	2026-06-12 12:53:00.461	\N	2026-06-05 12:53:00.463	76.13.197.7	curl/8.18.0
f3f5f435-eaf9-41e1-be70-042f945ef062	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$wsy3tOrIRyddqvODmEUFwuwyF.f2T3jhiHrx.V5m5AKDDSEKsLd6O	2026-06-12 13:07:33.921	\N	2026-06-05 13:07:33.922	76.13.197.7	curl/8.18.0
6f8be2f1-512c-4278-b490-9012d54b58bb	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$KDfCzGTxPdanRQmC8cKi.OCJ7GQkpLYBR1a49NQ31mOv7XhHUa1HW	2026-06-12 13:12:39.828	2026-06-05 13:25:27.953	2026-06-05 13:12:39.829	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
48268478-8d0a-432b-b5e2-dfdff43c8888	cmq0wpi7r004zlr3e1bl37xe8	$2a$12$eDlxIfX1wj12bcqpmne5TussWUdh7u0kWmtIQS3MoqUnHxrcHPlHu	2026-06-12 13:26:31.278	\N	2026-06-05 13:26:31.279	114.10.135.158	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36
\.


--
-- Data for Name: report_jobs; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.report_jobs (id, type, title, format, status, parameters, result_url, error_message, requested_by_id, queued_at, started_at, completed_at, created_at, updated_at) FROM stdin;
seed-report-job-1	STUDENTS	Rekap Data Siswa	CSV	COMPLETED	{"status": "ACTIVE"}	/exports/students-seed-report-job-1.csv	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-03 00:00:00	2026-06-03 01:00:00	2026-06-03 01:01:00	2026-06-05 12:34:48.859	2026-06-05 12:34:48.859
seed-report-job-2	FINANCE	Rekap Keuangan Juni	XLSX	PENDING	{"month": "2026-06"}	\N	\N	cmq0wpi7r004zlr3e1bl37xe8	2026-06-04 00:00:00	\N	\N	2026-06-05 12:34:48.863	2026-06-05 12:34:48.863
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.role_permissions (role_id, permission_id, created_at) FROM stdin;
cmq0wphja004llr3e4muazamm	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:47.691
cmq0wphja004llr3e4muazamm	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:47.694
cmq0wphja004llr3e4muazamm	cmq0wphd80002lr3efr61m8gp	2026-06-05 12:34:47.695
cmq0wphja004llr3e4muazamm	cmq0wphda0003lr3ek62wozbr	2026-06-05 12:34:47.697
cmq0wphja004llr3e4muazamm	cmq0wphdc0004lr3eafgfov0h	2026-06-05 12:34:47.698
cmq0wphja004llr3e4muazamm	cmq0wphde0005lr3eybrfogf1	2026-06-05 12:34:47.699
cmq0wphja004llr3e4muazamm	cmq0wphdf0006lr3edktnnb8s	2026-06-05 12:34:47.701
cmq0wphja004llr3e4muazamm	cmq0wphdh0007lr3eto560b0y	2026-06-05 12:34:47.702
cmq0wphja004llr3e4muazamm	cmq0wphdi0008lr3eunqqz3pd	2026-06-05 12:34:47.703
cmq0wphja004llr3e4muazamm	cmq0wphdk0009lr3ear3sieho	2026-06-05 12:34:47.704
cmq0wphja004llr3e4muazamm	cmq0wphdl000alr3ee5bid0jr	2026-06-05 12:34:47.705
cmq0wphja004llr3e4muazamm	cmq0wphdn000blr3ehmz7df0z	2026-06-05 12:34:47.706
cmq0wphja004llr3e4muazamm	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:47.707
cmq0wphja004llr3e4muazamm	cmq0wphdp000dlr3egitdeb7p	2026-06-05 12:34:47.708
cmq0wphja004llr3e4muazamm	cmq0wphdr000elr3ebij726h2	2026-06-05 12:34:47.709
cmq0wphja004llr3e4muazamm	cmq0wphds000flr3eawvoqfzi	2026-06-05 12:34:47.711
cmq0wphja004llr3e4muazamm	cmq0wphdu000glr3e1drre922	2026-06-05 12:34:47.712
cmq0wphja004llr3e4muazamm	cmq0wphdv000hlr3eq52ntjin	2026-06-05 12:34:47.713
cmq0wphja004llr3e4muazamm	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:47.715
cmq0wphja004llr3e4muazamm	cmq0wphdy000jlr3e107tynan	2026-06-05 12:34:47.716
cmq0wphja004llr3e4muazamm	cmq0wphe0000klr3eyy4m8sv1	2026-06-05 12:34:47.717
cmq0wphja004llr3e4muazamm	cmq0wphe1000llr3eciqzn2u9	2026-06-05 12:34:47.718
cmq0wphja004llr3e4muazamm	cmq0wphe2000mlr3e17cn71xm	2026-06-05 12:34:47.72
cmq0wphja004llr3e4muazamm	cmq0wphe4000nlr3e7ngxh192	2026-06-05 12:34:47.721
cmq0wphja004llr3e4muazamm	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:47.722
cmq0wphja004llr3e4muazamm	cmq0wphe8000plr3eajt5xrgd	2026-06-05 12:34:47.723
cmq0wphja004llr3e4muazamm	cmq0wphe9000qlr3e74p7aomo	2026-06-05 12:34:47.724
cmq0wphja004llr3e4muazamm	cmq0wphea000rlr3e5zsyggzt	2026-06-05 12:34:47.726
cmq0wphja004llr3e4muazamm	cmq0wphec000slr3ezuzutkhn	2026-06-05 12:34:47.727
cmq0wphja004llr3e4muazamm	cmq0wphed000tlr3euzttx1ni	2026-06-05 12:34:47.728
cmq0wphja004llr3e4muazamm	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:47.729
cmq0wphja004llr3e4muazamm	cmq0wpheg000vlr3e3qvint09	2026-06-05 12:34:47.73
cmq0wphja004llr3e4muazamm	cmq0wpheh000wlr3erftql2ef	2026-06-05 12:34:47.731
cmq0wphja004llr3e4muazamm	cmq0wphej000xlr3ekj6tmryn	2026-06-05 12:34:47.732
cmq0wphja004llr3e4muazamm	cmq0wphek000ylr3eez6cunwf	2026-06-05 12:34:47.733
cmq0wphja004llr3e4muazamm	cmq0wphel000zlr3e1x7tey5h	2026-06-05 12:34:47.735
cmq0wphja004llr3e4muazamm	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:47.736
cmq0wphja004llr3e4muazamm	cmq0wpheo0011lr3ennyesqcy	2026-06-05 12:34:47.737
cmq0wphja004llr3e4muazamm	cmq0wphep0012lr3ehkev53td	2026-06-05 12:34:47.738
cmq0wphja004llr3e4muazamm	cmq0wpheq0013lr3eiw2yawnm	2026-06-05 12:34:47.739
cmq0wphja004llr3e4muazamm	cmq0wphes0014lr3e27l8bea5	2026-06-05 12:34:47.74
cmq0wphja004llr3e4muazamm	cmq0wphet0015lr3ejnt2cl5k	2026-06-05 12:34:47.741
cmq0wphja004llr3e4muazamm	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:47.742
cmq0wphja004llr3e4muazamm	cmq0wphev0017lr3e9pn00g8b	2026-06-05 12:34:47.743
cmq0wphja004llr3e4muazamm	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:47.744
cmq0wphja004llr3e4muazamm	cmq0wphex0019lr3e6kigrqem	2026-06-05 12:34:47.746
cmq0wphja004llr3e4muazamm	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:47.747
cmq0wphja004llr3e4muazamm	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:47.748
cmq0wphja004llr3e4muazamm	cmq0wphf1001clr3eyr130fgg	2026-06-05 12:34:47.749
cmq0wphja004llr3e4muazamm	cmq0wphf2001dlr3esmpfybx5	2026-06-05 12:34:47.75
cmq0wphja004llr3e4muazamm	cmq0wphf3001elr3etd2fjr5k	2026-06-05 12:34:47.751
cmq0wphja004llr3e4muazamm	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:47.752
cmq0wphja004llr3e4muazamm	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:47.753
cmq0wphja004llr3e4muazamm	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:47.754
cmq0wphja004llr3e4muazamm	cmq0wphf8001ilr3erbt3wiq2	2026-06-05 12:34:47.756
cmq0wphja004llr3e4muazamm	cmq0wphf9001jlr3evyt0o9pq	2026-06-05 12:34:47.757
cmq0wphja004llr3e4muazamm	cmq0wphfa001klr3e2zxrgx3w	2026-06-05 12:34:47.758
cmq0wphja004llr3e4muazamm	cmq0wphfb001llr3e6gzwiwpm	2026-06-05 12:34:47.759
cmq0wphja004llr3e4muazamm	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:47.76
cmq0wphja004llr3e4muazamm	cmq0wphfe001nlr3ewtawu9eu	2026-06-05 12:34:47.761
cmq0wphja004llr3e4muazamm	cmq0wphff001olr3eb6ima827	2026-06-05 12:34:47.762
cmq0wphja004llr3e4muazamm	cmq0wphfh001plr3eh7euk6lq	2026-06-05 12:34:47.763
cmq0wphja004llr3e4muazamm	cmq0wphfi001qlr3e4fskeb11	2026-06-05 12:34:47.764
cmq0wphja004llr3e4muazamm	cmq0wphfj001rlr3e63n3b3a8	2026-06-05 12:34:47.765
cmq0wphja004llr3e4muazamm	cmq0wphfl001slr3eje1bpzyn	2026-06-05 12:34:47.767
cmq0wphja004llr3e4muazamm	cmq0wphfm001tlr3ehpy79fka	2026-06-05 12:34:47.768
cmq0wphja004llr3e4muazamm	cmq0wphfn001ulr3e9g7ic41u	2026-06-05 12:34:47.769
cmq0wphja004llr3e4muazamm	cmq0wphfo001vlr3exj1nepge	2026-06-05 12:34:47.771
cmq0wphja004llr3e4muazamm	cmq0wphfq001wlr3ens9m9op7	2026-06-05 12:34:47.772
cmq0wphja004llr3e4muazamm	cmq0wphfr001xlr3et86ddgym	2026-06-05 12:34:47.773
cmq0wphja004llr3e4muazamm	cmq0wphft001ylr3edujdlc6b	2026-06-05 12:34:47.774
cmq0wphja004llr3e4muazamm	cmq0wphfu001zlr3e8gtxsrwd	2026-06-05 12:34:47.775
cmq0wphja004llr3e4muazamm	cmq0wphfw0020lr3euxk2jcv5	2026-06-05 12:34:47.777
cmq0wphja004llr3e4muazamm	cmq0wphfx0021lr3e7nyk5105	2026-06-05 12:34:47.778
cmq0wphja004llr3e4muazamm	cmq0wphfz0022lr3e4q3ym6tz	2026-06-05 12:34:47.779
cmq0wphja004llr3e4muazamm	cmq0wphg00023lr3ereyy27cj	2026-06-05 12:34:47.78
cmq0wphja004llr3e4muazamm	cmq0wphg10024lr3ereihnz0j	2026-06-05 12:34:47.782
cmq0wphja004llr3e4muazamm	cmq0wphg30025lr3es37bx9xg	2026-06-05 12:34:47.783
cmq0wphja004llr3e4muazamm	cmq0wphg40026lr3e46o2n85h	2026-06-05 12:34:47.784
cmq0wphja004llr3e4muazamm	cmq0wphg60027lr3e960k1ym4	2026-06-05 12:34:47.785
cmq0wphja004llr3e4muazamm	cmq0wphg70028lr3e595lx151	2026-06-05 12:34:47.786
cmq0wphja004llr3e4muazamm	cmq0wphg80029lr3eb901eybh	2026-06-05 12:34:47.788
cmq0wphja004llr3e4muazamm	cmq0wphga002alr3ebg7qbfnq	2026-06-05 12:34:47.789
cmq0wphja004llr3e4muazamm	cmq0wphgb002blr3evgkui70e	2026-06-05 12:34:47.79
cmq0wphja004llr3e4muazamm	cmq0wphgc002clr3evxtshbdt	2026-06-05 12:34:47.791
cmq0wphja004llr3e4muazamm	cmq0wphgd002dlr3efqyrlr5t	2026-06-05 12:34:47.792
cmq0wphja004llr3e4muazamm	cmq0wphge002elr3ezb87opva	2026-06-05 12:34:47.794
cmq0wphja004llr3e4muazamm	cmq0wphgg002flr3e0ywxcc9c	2026-06-05 12:34:47.795
cmq0wphja004llr3e4muazamm	cmq0wphgh002glr3eqw4bpn4v	2026-06-05 12:34:47.796
cmq0wphja004llr3e4muazamm	cmq0wphgi002hlr3eiixupy1h	2026-06-05 12:34:47.798
cmq0wphja004llr3e4muazamm	cmq0wphgj002ilr3e7ocu0llv	2026-06-05 12:34:47.799
cmq0wphja004llr3e4muazamm	cmq0wphgk002jlr3ezf5hnrm0	2026-06-05 12:34:47.8
cmq0wphja004llr3e4muazamm	cmq0wphgm002klr3e5kc7vxfa	2026-06-05 12:34:47.801
cmq0wphja004llr3e4muazamm	cmq0wphgn002llr3ec6org46i	2026-06-05 12:34:47.802
cmq0wphja004llr3e4muazamm	cmq0wphgo002mlr3ee03uy6kd	2026-06-05 12:34:47.804
cmq0wphja004llr3e4muazamm	cmq0wphgp002nlr3e8ihmz2vf	2026-06-05 12:34:47.805
cmq0wphja004llr3e4muazamm	cmq0wphgq002olr3empr2ts36	2026-06-05 12:34:47.806
cmq0wphja004llr3e4muazamm	cmq0wphgs002plr3eyg15sgqj	2026-06-05 12:34:47.807
cmq0wphja004llr3e4muazamm	cmq0wphgt002qlr3eecwym18v	2026-06-05 12:34:47.808
cmq0wphja004llr3e4muazamm	cmq0wphgv002rlr3et2cdgler	2026-06-05 12:34:47.81
cmq0wphja004llr3e4muazamm	cmq0wphgw002slr3ezgehhq23	2026-06-05 12:34:47.811
cmq0wphja004llr3e4muazamm	cmq0wphgy002tlr3emp26211b	2026-06-05 12:34:47.812
cmq0wphja004llr3e4muazamm	cmq0wphh0002ulr3ee4wziq33	2026-06-05 12:34:47.813
cmq0wphja004llr3e4muazamm	cmq0wphh2002vlr3e895hyfwd	2026-06-05 12:34:47.815
cmq0wphja004llr3e4muazamm	cmq0wphh3002wlr3erku810ky	2026-06-05 12:34:47.816
cmq0wphja004llr3e4muazamm	cmq0wphh5002xlr3e4sl9l803	2026-06-05 12:34:47.817
cmq0wphja004llr3e4muazamm	cmq0wphh6002ylr3e2y65hxd2	2026-06-05 12:34:47.818
cmq0wphja004llr3e4muazamm	cmq0wphh8002zlr3evt7soiys	2026-06-05 12:34:47.819
cmq0wphja004llr3e4muazamm	cmq0wphh90030lr3e851tzdh5	2026-06-05 12:34:47.82
cmq0wphja004llr3e4muazamm	cmq0wphha0031lr3e3vugi071	2026-06-05 12:34:47.821
cmq0wphja004llr3e4muazamm	cmq0wphhc0032lr3epukoudo9	2026-06-05 12:34:47.822
cmq0wphja004llr3e4muazamm	cmq0wphhd0033lr3emvybcmr1	2026-06-05 12:34:47.823
cmq0wphja004llr3e4muazamm	cmq0wphhe0034lr3eyywsso8m	2026-06-05 12:34:47.825
cmq0wphja004llr3e4muazamm	cmq0wphhf0035lr3efbijko9k	2026-06-05 12:34:47.826
cmq0wphja004llr3e4muazamm	cmq0wphhg0036lr3e2s57m4dt	2026-06-05 12:34:47.827
cmq0wphja004llr3e4muazamm	cmq0wphhi0037lr3eq65amrmm	2026-06-05 12:34:47.829
cmq0wphja004llr3e4muazamm	cmq0wphhj0038lr3e5ebnc8tg	2026-06-05 12:34:47.83
cmq0wphja004llr3e4muazamm	cmq0wphhk0039lr3exza6r358	2026-06-05 12:34:47.831
cmq0wphja004llr3e4muazamm	cmq0wphhl003alr3e1158cwpt	2026-06-05 12:34:47.832
cmq0wphja004llr3e4muazamm	cmq0wphhm003blr3eov8nvsoz	2026-06-05 12:34:47.833
cmq0wphja004llr3e4muazamm	cmq0wphhn003clr3ev95z34to	2026-06-05 12:34:47.835
cmq0wphja004llr3e4muazamm	cmq0wphhp003dlr3e2dn6yyck	2026-06-05 12:34:47.836
cmq0wphja004llr3e4muazamm	cmq0wphhq003elr3egxolom55	2026-06-05 12:34:47.837
cmq0wphja004llr3e4muazamm	cmq0wphhr003flr3eitt4k491	2026-06-05 12:34:47.838
cmq0wphja004llr3e4muazamm	cmq0wphhs003glr3ej4xkdpfm	2026-06-05 12:34:47.839
cmq0wphja004llr3e4muazamm	cmq0wphht003hlr3edce8lin4	2026-06-05 12:34:47.841
cmq0wphja004llr3e4muazamm	cmq0wphhu003ilr3ev0yb98sv	2026-06-05 12:34:47.842
cmq0wphja004llr3e4muazamm	cmq0wphhw003jlr3e7o9isd8o	2026-06-05 12:34:47.843
cmq0wphja004llr3e4muazamm	cmq0wphhx003klr3e75j782a0	2026-06-05 12:34:47.844
cmq0wphja004llr3e4muazamm	cmq0wphhy003llr3ex65com8s	2026-06-05 12:34:47.846
cmq0wphja004llr3e4muazamm	cmq0wphhz003mlr3e4uzt3qpk	2026-06-05 12:34:47.847
cmq0wphja004llr3e4muazamm	cmq0wphi1003nlr3eik6se2fo	2026-06-05 12:34:47.848
cmq0wphja004llr3e4muazamm	cmq0wphi2003olr3ehzyv90ss	2026-06-05 12:34:47.849
cmq0wphja004llr3e4muazamm	cmq0wphi4003plr3evlfzzn6j	2026-06-05 12:34:47.85
cmq0wphja004llr3e4muazamm	cmq0wphi5003qlr3e42h5i5my	2026-06-05 12:34:47.851
cmq0wphja004llr3e4muazamm	cmq0wphi6003rlr3elv3s5xhj	2026-06-05 12:34:47.853
cmq0wphja004llr3e4muazamm	cmq0wphi7003slr3ew9roelpe	2026-06-05 12:34:47.854
cmq0wphja004llr3e4muazamm	cmq0wphi9003tlr3ec2ba3gmr	2026-06-05 12:34:47.855
cmq0wphja004llr3e4muazamm	cmq0wphib003ulr3e9b2cirgf	2026-06-05 12:34:47.857
cmq0wphja004llr3e4muazamm	cmq0wphic003vlr3egmlw6ard	2026-06-05 12:34:47.858
cmq0wphja004llr3e4muazamm	cmq0wphid003wlr3e5m3fgjpt	2026-06-05 12:34:47.859
cmq0wphja004llr3e4muazamm	cmq0wphie003xlr3egyizezlg	2026-06-05 12:34:47.86
cmq0wphja004llr3e4muazamm	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:47.861
cmq0wphja004llr3e4muazamm	cmq0wphih003zlr3exqw6y0td	2026-06-05 12:34:47.862
cmq0wphja004llr3e4muazamm	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:47.864
cmq0wphja004llr3e4muazamm	cmq0wphik0041lr3e6uiti7u5	2026-06-05 12:34:47.865
cmq0wphja004llr3e4muazamm	cmq0wphim0042lr3e3m3ylstl	2026-06-05 12:34:47.866
cmq0wphja004llr3e4muazamm	cmq0wphin0043lr3ezpzhigyi	2026-06-05 12:34:47.867
cmq0wphja004llr3e4muazamm	cmq0wphio0044lr3eesuch3uq	2026-06-05 12:34:47.868
cmq0wphja004llr3e4muazamm	cmq0wphip0045lr3eow0fm6id	2026-06-05 12:34:47.87
cmq0wphja004llr3e4muazamm	cmq0wphiq0046lr3el595aegq	2026-06-05 12:34:47.871
cmq0wphja004llr3e4muazamm	cmq0wphis0047lr3e4mc0edy7	2026-06-05 12:34:47.872
cmq0wphja004llr3e4muazamm	cmq0wphit0048lr3e7b5segmu	2026-06-05 12:34:47.873
cmq0wphja004llr3e4muazamm	cmq0wphiu0049lr3ehc1al4zr	2026-06-05 12:34:47.874
cmq0wphja004llr3e4muazamm	cmq0wphiw004alr3e4gy84mgf	2026-06-05 12:34:47.876
cmq0wphja004llr3e4muazamm	cmq0wphix004blr3eqiulk68n	2026-06-05 12:34:47.877
cmq0wphja004llr3e4muazamm	cmq0wphiy004clr3e2nn13lye	2026-06-05 12:34:47.878
cmq0wphja004llr3e4muazamm	cmq0wphj0004dlr3egno6zoci	2026-06-05 12:34:47.88
cmq0wphja004llr3e4muazamm	cmq0wphj1004elr3edml5hckk	2026-06-05 12:34:47.881
cmq0wphja004llr3e4muazamm	cmq0wphj2004flr3e1ggbgaum	2026-06-05 12:34:47.883
cmq0wphja004llr3e4muazamm	cmq0wphj4004glr3ekcymt08o	2026-06-05 12:34:47.884
cmq0wphja004llr3e4muazamm	cmq0wphj5004hlr3evpqytc1d	2026-06-05 12:34:47.885
cmq0wphja004llr3e4muazamm	cmq0wphj6004ilr3eufvdu5qe	2026-06-05 12:34:47.886
cmq0wphja004llr3e4muazamm	cmq0wphj7004jlr3enzpjjzh0	2026-06-05 12:34:47.887
cmq0wphja004llr3e4muazamm	cmq0wphj9004klr3edjf0p982	2026-06-05 12:34:47.888
cmq0wphox004mlr3em6712ybi	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:47.892
cmq0wphox004mlr3em6712ybi	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:47.893
cmq0wphox004mlr3em6712ybi	cmq0wphd80002lr3efr61m8gp	2026-06-05 12:34:47.894
cmq0wphox004mlr3em6712ybi	cmq0wphda0003lr3ek62wozbr	2026-06-05 12:34:47.895
cmq0wphox004mlr3em6712ybi	cmq0wphde0005lr3eybrfogf1	2026-06-05 12:34:47.896
cmq0wphox004mlr3em6712ybi	cmq0wphdf0006lr3edktnnb8s	2026-06-05 12:34:47.898
cmq0wphox004mlr3em6712ybi	cmq0wphdh0007lr3eto560b0y	2026-06-05 12:34:47.899
cmq0wphox004mlr3em6712ybi	cmq0wphdk0009lr3ear3sieho	2026-06-05 12:34:47.9
cmq0wphox004mlr3em6712ybi	cmq0wphdl000alr3ee5bid0jr	2026-06-05 12:34:47.901
cmq0wphox004mlr3em6712ybi	cmq0wphdn000blr3ehmz7df0z	2026-06-05 12:34:47.902
cmq0wphox004mlr3em6712ybi	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:47.903
cmq0wphox004mlr3em6712ybi	cmq0wphdp000dlr3egitdeb7p	2026-06-05 12:34:47.905
cmq0wphox004mlr3em6712ybi	cmq0wphdr000elr3ebij726h2	2026-06-05 12:34:47.906
cmq0wphox004mlr3em6712ybi	cmq0wphdu000glr3e1drre922	2026-06-05 12:34:47.907
cmq0wphox004mlr3em6712ybi	cmq0wphdv000hlr3eq52ntjin	2026-06-05 12:34:47.908
cmq0wphox004mlr3em6712ybi	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:47.909
cmq0wphox004mlr3em6712ybi	cmq0wphdy000jlr3e107tynan	2026-06-05 12:34:47.91
cmq0wphox004mlr3em6712ybi	cmq0wphe0000klr3eyy4m8sv1	2026-06-05 12:34:47.912
cmq0wphox004mlr3em6712ybi	cmq0wphe2000mlr3e17cn71xm	2026-06-05 12:34:47.913
cmq0wphox004mlr3em6712ybi	cmq0wphe4000nlr3e7ngxh192	2026-06-05 12:34:47.915
cmq0wphox004mlr3em6712ybi	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:47.916
cmq0wphox004mlr3em6712ybi	cmq0wphe8000plr3eajt5xrgd	2026-06-05 12:34:47.917
cmq0wphox004mlr3em6712ybi	cmq0wphe9000qlr3e74p7aomo	2026-06-05 12:34:47.919
cmq0wphox004mlr3em6712ybi	cmq0wphec000slr3ezuzutkhn	2026-06-05 12:34:47.92
cmq0wphox004mlr3em6712ybi	cmq0wphed000tlr3euzttx1ni	2026-06-05 12:34:47.921
cmq0wphox004mlr3em6712ybi	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:47.923
cmq0wphox004mlr3em6712ybi	cmq0wpheg000vlr3e3qvint09	2026-06-05 12:34:47.924
cmq0wphox004mlr3em6712ybi	cmq0wpheh000wlr3erftql2ef	2026-06-05 12:34:47.925
cmq0wphox004mlr3em6712ybi	cmq0wphek000ylr3eez6cunwf	2026-06-05 12:34:47.926
cmq0wphox004mlr3em6712ybi	cmq0wphel000zlr3e1x7tey5h	2026-06-05 12:34:47.927
cmq0wphox004mlr3em6712ybi	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:47.929
cmq0wphox004mlr3em6712ybi	cmq0wpheo0011lr3ennyesqcy	2026-06-05 12:34:47.93
cmq0wphox004mlr3em6712ybi	cmq0wphep0012lr3ehkev53td	2026-06-05 12:34:47.931
cmq0wphox004mlr3em6712ybi	cmq0wphes0014lr3e27l8bea5	2026-06-05 12:34:47.932
cmq0wphox004mlr3em6712ybi	cmq0wphet0015lr3ejnt2cl5k	2026-06-05 12:34:47.934
cmq0wphox004mlr3em6712ybi	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:47.935
cmq0wphox004mlr3em6712ybi	cmq0wphev0017lr3e9pn00g8b	2026-06-05 12:34:47.936
cmq0wphox004mlr3em6712ybi	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:47.937
cmq0wphox004mlr3em6712ybi	cmq0wphex0019lr3e6kigrqem	2026-06-05 12:34:47.939
cmq0wphox004mlr3em6712ybi	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:47.94
cmq0wphox004mlr3em6712ybi	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:47.941
cmq0wphox004mlr3em6712ybi	cmq0wphf1001clr3eyr130fgg	2026-06-05 12:34:47.942
cmq0wphox004mlr3em6712ybi	cmq0wphf2001dlr3esmpfybx5	2026-06-05 12:34:47.944
cmq0wphox004mlr3em6712ybi	cmq0wphf3001elr3etd2fjr5k	2026-06-05 12:34:47.945
cmq0wphox004mlr3em6712ybi	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:47.946
cmq0wphox004mlr3em6712ybi	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:47.947
cmq0wphox004mlr3em6712ybi	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:47.948
cmq0wphox004mlr3em6712ybi	cmq0wphf8001ilr3erbt3wiq2	2026-06-05 12:34:47.95
cmq0wphox004mlr3em6712ybi	cmq0wphf9001jlr3evyt0o9pq	2026-06-05 12:34:47.951
cmq0wphox004mlr3em6712ybi	cmq0wphfa001klr3e2zxrgx3w	2026-06-05 12:34:47.952
cmq0wphox004mlr3em6712ybi	cmq0wphfb001llr3e6gzwiwpm	2026-06-05 12:34:47.953
cmq0wphox004mlr3em6712ybi	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:47.954
cmq0wphox004mlr3em6712ybi	cmq0wphfe001nlr3ewtawu9eu	2026-06-05 12:34:47.956
cmq0wphox004mlr3em6712ybi	cmq0wphff001olr3eb6ima827	2026-06-05 12:34:47.966
cmq0wphox004mlr3em6712ybi	cmq0wphfh001plr3eh7euk6lq	2026-06-05 12:34:47.969
cmq0wphox004mlr3em6712ybi	cmq0wphfj001rlr3e63n3b3a8	2026-06-05 12:34:47.97
cmq0wphox004mlr3em6712ybi	cmq0wphfl001slr3eje1bpzyn	2026-06-05 12:34:47.971
cmq0wphox004mlr3em6712ybi	cmq0wphfm001tlr3ehpy79fka	2026-06-05 12:34:47.973
cmq0wphox004mlr3em6712ybi	cmq0wphfn001ulr3e9g7ic41u	2026-06-05 12:34:47.974
cmq0wphox004mlr3em6712ybi	cmq0wphfo001vlr3exj1nepge	2026-06-05 12:34:47.975
cmq0wphox004mlr3em6712ybi	cmq0wphfq001wlr3ens9m9op7	2026-06-05 12:34:47.976
cmq0wphox004mlr3em6712ybi	cmq0wphfr001xlr3et86ddgym	2026-06-05 12:34:47.977
cmq0wphox004mlr3em6712ybi	cmq0wphft001ylr3edujdlc6b	2026-06-05 12:34:47.979
cmq0wphox004mlr3em6712ybi	cmq0wphfu001zlr3e8gtxsrwd	2026-06-05 12:34:47.981
cmq0wphox004mlr3em6712ybi	cmq0wphfw0020lr3euxk2jcv5	2026-06-05 12:34:47.982
cmq0wphox004mlr3em6712ybi	cmq0wphfx0021lr3e7nyk5105	2026-06-05 12:34:47.984
cmq0wphox004mlr3em6712ybi	cmq0wphfz0022lr3e4q3ym6tz	2026-06-05 12:34:47.985
cmq0wphox004mlr3em6712ybi	cmq0wphg00023lr3ereyy27cj	2026-06-05 12:34:47.986
cmq0wphox004mlr3em6712ybi	cmq0wphg10024lr3ereihnz0j	2026-06-05 12:34:47.988
cmq0wphox004mlr3em6712ybi	cmq0wphg30025lr3es37bx9xg	2026-06-05 12:34:47.989
cmq0wphox004mlr3em6712ybi	cmq0wphg60027lr3e960k1ym4	2026-06-05 12:34:47.99
cmq0wphox004mlr3em6712ybi	cmq0wphg70028lr3e595lx151	2026-06-05 12:34:47.991
cmq0wphox004mlr3em6712ybi	cmq0wphg80029lr3eb901eybh	2026-06-05 12:34:47.993
cmq0wphox004mlr3em6712ybi	cmq0wphga002alr3ebg7qbfnq	2026-06-05 12:34:47.994
cmq0wphox004mlr3em6712ybi	cmq0wphgb002blr3evgkui70e	2026-06-05 12:34:47.995
cmq0wphox004mlr3em6712ybi	cmq0wphgc002clr3evxtshbdt	2026-06-05 12:34:47.996
cmq0wphox004mlr3em6712ybi	cmq0wphgd002dlr3efqyrlr5t	2026-06-05 12:34:47.997
cmq0wphox004mlr3em6712ybi	cmq0wphgg002flr3e0ywxcc9c	2026-06-05 12:34:47.999
cmq0wphox004mlr3em6712ybi	cmq0wphgh002glr3eqw4bpn4v	2026-06-05 12:34:48
cmq0wphox004mlr3em6712ybi	cmq0wphgi002hlr3eiixupy1h	2026-06-05 12:34:48.001
cmq0wphox004mlr3em6712ybi	cmq0wphgj002ilr3e7ocu0llv	2026-06-05 12:34:48.003
cmq0wphox004mlr3em6712ybi	cmq0wphgk002jlr3ezf5hnrm0	2026-06-05 12:34:48.004
cmq0wphox004mlr3em6712ybi	cmq0wphgm002klr3e5kc7vxfa	2026-06-05 12:34:48.005
cmq0wphox004mlr3em6712ybi	cmq0wphgn002llr3ec6org46i	2026-06-05 12:34:48.007
cmq0wphox004mlr3em6712ybi	cmq0wphgo002mlr3ee03uy6kd	2026-06-05 12:34:48.008
cmq0wphox004mlr3em6712ybi	cmq0wphgp002nlr3e8ihmz2vf	2026-06-05 12:34:48.009
cmq0wphox004mlr3em6712ybi	cmq0wphgs002plr3eyg15sgqj	2026-06-05 12:34:48.01
cmq0wphox004mlr3em6712ybi	cmq0wphgt002qlr3eecwym18v	2026-06-05 12:34:48.012
cmq0wphox004mlr3em6712ybi	cmq0wphgv002rlr3et2cdgler	2026-06-05 12:34:48.013
cmq0wphox004mlr3em6712ybi	cmq0wphgy002tlr3emp26211b	2026-06-05 12:34:48.014
cmq0wphox004mlr3em6712ybi	cmq0wphh0002ulr3ee4wziq33	2026-06-05 12:34:48.015
cmq0wphox004mlr3em6712ybi	cmq0wphh2002vlr3e895hyfwd	2026-06-05 12:34:48.017
cmq0wphox004mlr3em6712ybi	cmq0wphh3002wlr3erku810ky	2026-06-05 12:34:48.018
cmq0wphox004mlr3em6712ybi	cmq0wphh5002xlr3e4sl9l803	2026-06-05 12:34:48.019
cmq0wphox004mlr3em6712ybi	cmq0wphh6002ylr3e2y65hxd2	2026-06-05 12:34:48.021
cmq0wphox004mlr3em6712ybi	cmq0wphh8002zlr3evt7soiys	2026-06-05 12:34:48.022
cmq0wphox004mlr3em6712ybi	cmq0wphh90030lr3e851tzdh5	2026-06-05 12:34:48.023
cmq0wphox004mlr3em6712ybi	cmq0wphha0031lr3e3vugi071	2026-06-05 12:34:48.024
cmq0wphox004mlr3em6712ybi	cmq0wphhc0032lr3epukoudo9	2026-06-05 12:34:48.025
cmq0wphox004mlr3em6712ybi	cmq0wphhd0033lr3emvybcmr1	2026-06-05 12:34:48.026
cmq0wphox004mlr3em6712ybi	cmq0wphhe0034lr3eyywsso8m	2026-06-05 12:34:48.027
cmq0wphox004mlr3em6712ybi	cmq0wphhg0036lr3e2s57m4dt	2026-06-05 12:34:48.029
cmq0wphox004mlr3em6712ybi	cmq0wphhi0037lr3eq65amrmm	2026-06-05 12:34:48.03
cmq0wphox004mlr3em6712ybi	cmq0wphhj0038lr3e5ebnc8tg	2026-06-05 12:34:48.031
cmq0wphox004mlr3em6712ybi	cmq0wphhk0039lr3exza6r358	2026-06-05 12:34:48.032
cmq0wphox004mlr3em6712ybi	cmq0wphhm003blr3eov8nvsoz	2026-06-05 12:34:48.033
cmq0wphox004mlr3em6712ybi	cmq0wphhn003clr3ev95z34to	2026-06-05 12:34:48.035
cmq0wphox004mlr3em6712ybi	cmq0wphhp003dlr3e2dn6yyck	2026-06-05 12:34:48.036
cmq0wphox004mlr3em6712ybi	cmq0wphhq003elr3egxolom55	2026-06-05 12:34:48.037
cmq0wphox004mlr3em6712ybi	cmq0wphhr003flr3eitt4k491	2026-06-05 12:34:48.038
cmq0wphox004mlr3em6712ybi	cmq0wphhs003glr3ej4xkdpfm	2026-06-05 12:34:48.039
cmq0wphox004mlr3em6712ybi	cmq0wphht003hlr3edce8lin4	2026-06-05 12:34:48.041
cmq0wphox004mlr3em6712ybi	cmq0wphhu003ilr3ev0yb98sv	2026-06-05 12:34:48.042
cmq0wphox004mlr3em6712ybi	cmq0wphhw003jlr3e7o9isd8o	2026-06-05 12:34:48.043
cmq0wphox004mlr3em6712ybi	cmq0wphhx003klr3e75j782a0	2026-06-05 12:34:48.045
cmq0wphox004mlr3em6712ybi	cmq0wphhz003mlr3e4uzt3qpk	2026-06-05 12:34:48.046
cmq0wphox004mlr3em6712ybi	cmq0wphi1003nlr3eik6se2fo	2026-06-05 12:34:48.047
cmq0wphox004mlr3em6712ybi	cmq0wphi2003olr3ehzyv90ss	2026-06-05 12:34:48.049
cmq0wphox004mlr3em6712ybi	cmq0wphi4003plr3evlfzzn6j	2026-06-05 12:34:48.05
cmq0wphox004mlr3em6712ybi	cmq0wphi5003qlr3e42h5i5my	2026-06-05 12:34:48.051
cmq0wphox004mlr3em6712ybi	cmq0wphi7003slr3ew9roelpe	2026-06-05 12:34:48.053
cmq0wphox004mlr3em6712ybi	cmq0wphi9003tlr3ec2ba3gmr	2026-06-05 12:34:48.054
cmq0wphox004mlr3em6712ybi	cmq0wphib003ulr3e9b2cirgf	2026-06-05 12:34:48.055
cmq0wphox004mlr3em6712ybi	cmq0wphic003vlr3egmlw6ard	2026-06-05 12:34:48.056
cmq0wphox004mlr3em6712ybi	cmq0wphid003wlr3e5m3fgjpt	2026-06-05 12:34:48.058
cmq0wphox004mlr3em6712ybi	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.06
cmq0wphox004mlr3em6712ybi	cmq0wphih003zlr3exqw6y0td	2026-06-05 12:34:48.061
cmq0wphox004mlr3em6712ybi	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:48.063
cmq0wphox004mlr3em6712ybi	cmq0wphik0041lr3e6uiti7u5	2026-06-05 12:34:48.066
cmq0wphox004mlr3em6712ybi	cmq0wphim0042lr3e3m3ylstl	2026-06-05 12:34:48.067
cmq0wphox004mlr3em6712ybi	cmq0wphin0043lr3ezpzhigyi	2026-06-05 12:34:48.069
cmq0wphox004mlr3em6712ybi	cmq0wphio0044lr3eesuch3uq	2026-06-05 12:34:48.071
cmq0wphox004mlr3em6712ybi	cmq0wphiq0046lr3el595aegq	2026-06-05 12:34:48.073
cmq0wphox004mlr3em6712ybi	cmq0wphis0047lr3e4mc0edy7	2026-06-05 12:34:48.074
cmq0wphox004mlr3em6712ybi	cmq0wphit0048lr3e7b5segmu	2026-06-05 12:34:48.076
cmq0wphox004mlr3em6712ybi	cmq0wphiu0049lr3ehc1al4zr	2026-06-05 12:34:48.079
cmq0wphox004mlr3em6712ybi	cmq0wphiw004alr3e4gy84mgf	2026-06-05 12:34:48.081
cmq0wphox004mlr3em6712ybi	cmq0wphix004blr3eqiulk68n	2026-06-05 12:34:48.084
cmq0wphox004mlr3em6712ybi	cmq0wphiy004clr3e2nn13lye	2026-06-05 12:34:48.086
cmq0wphox004mlr3em6712ybi	cmq0wphj0004dlr3egno6zoci	2026-06-05 12:34:48.088
cmq0wphox004mlr3em6712ybi	cmq0wphj1004elr3edml5hckk	2026-06-05 12:34:48.089
cmq0wphox004mlr3em6712ybi	cmq0wphj2004flr3e1ggbgaum	2026-06-05 12:34:48.091
cmq0wphox004mlr3em6712ybi	cmq0wphj4004glr3ekcymt08o	2026-06-05 12:34:48.093
cmq0wphox004mlr3em6712ybi	cmq0wphj5004hlr3evpqytc1d	2026-06-05 12:34:48.095
cmq0wphox004mlr3em6712ybi	cmq0wphj6004ilr3eufvdu5qe	2026-06-05 12:34:48.096
cmq0wphox004mlr3em6712ybi	cmq0wphj7004jlr3enzpjjzh0	2026-06-05 12:34:48.098
cmq0wphox004mlr3em6712ybi	cmq0wphj9004klr3edjf0p982	2026-06-05 12:34:48.099
cmq0wphut004nlr3ehp014o8q	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.104
cmq0wphut004nlr3ehp014o8q	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.106
cmq0wphut004nlr3ehp014o8q	cmq0wphde0005lr3eybrfogf1	2026-06-05 12:34:48.108
cmq0wphut004nlr3ehp014o8q	cmq0wphdk0009lr3ear3sieho	2026-06-05 12:34:48.111
cmq0wphut004nlr3ehp014o8q	cmq0wphdl000alr3ee5bid0jr	2026-06-05 12:34:48.114
cmq0wphut004nlr3ehp014o8q	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.115
cmq0wphut004nlr3ehp014o8q	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.117
cmq0wphut004nlr3ehp014o8q	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:48.119
cmq0wphut004nlr3ehp014o8q	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.121
cmq0wphut004nlr3ehp014o8q	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:48.123
cmq0wphut004nlr3ehp014o8q	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:48.125
cmq0wphut004nlr3ehp014o8q	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:48.128
cmq0wphut004nlr3ehp014o8q	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:48.13
cmq0wphut004nlr3ehp014o8q	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:48.132
cmq0wphut004nlr3ehp014o8q	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:48.134
cmq0wphut004nlr3ehp014o8q	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:48.136
cmq0wphut004nlr3ehp014o8q	cmq0wphg80029lr3eb901eybh	2026-06-05 12:34:48.139
cmq0wphut004nlr3ehp014o8q	cmq0wphfe001nlr3ewtawu9eu	2026-06-05 12:34:48.141
cmq0wphut004nlr3ehp014o8q	cmq0wphfm001tlr3ehpy79fka	2026-06-05 12:34:48.143
cmq0wphut004nlr3ehp014o8q	cmq0wphfn001ulr3e9g7ic41u	2026-06-05 12:34:48.145
cmq0wphut004nlr3ehp014o8q	cmq0wphfu001zlr3e8gtxsrwd	2026-06-05 12:34:48.147
cmq0wphut004nlr3ehp014o8q	cmq0wphg00023lr3ereyy27cj	2026-06-05 12:34:48.149
cmq0wphut004nlr3ehp014o8q	cmq0wphgb002blr3evgkui70e	2026-06-05 12:34:48.151
cmq0wphut004nlr3ehp014o8q	cmq0wphgh002glr3eqw4bpn4v	2026-06-05 12:34:48.152
cmq0wphut004nlr3ehp014o8q	cmq0wphgi002hlr3eiixupy1h	2026-06-05 12:34:48.154
cmq0wphut004nlr3ehp014o8q	cmq0wphgm002klr3e5kc7vxfa	2026-06-05 12:34:48.155
cmq0wphut004nlr3ehp014o8q	cmq0wphgn002llr3ec6org46i	2026-06-05 12:34:48.157
cmq0wphut004nlr3ehp014o8q	cmq0wphgs002plr3eyg15sgqj	2026-06-05 12:34:48.159
cmq0wphut004nlr3ehp014o8q	cmq0wphh5002xlr3e4sl9l803	2026-06-05 12:34:48.161
cmq0wphut004nlr3ehp014o8q	cmq0wphhc0032lr3epukoudo9	2026-06-05 12:34:48.162
cmq0wphut004nlr3ehp014o8q	cmq0wphhi0037lr3eq65amrmm	2026-06-05 12:34:48.164
cmq0wphut004nlr3ehp014o8q	cmq0wphhp003dlr3e2dn6yyck	2026-06-05 12:34:48.166
cmq0wphut004nlr3ehp014o8q	cmq0wphhu003ilr3ev0yb98sv	2026-06-05 12:34:48.167
cmq0wphut004nlr3ehp014o8q	cmq0wphhz003mlr3e4uzt3qpk	2026-06-05 12:34:48.169
cmq0wphut004nlr3ehp014o8q	cmq0wphi2003olr3ehzyv90ss	2026-06-05 12:34:48.17
cmq0wphut004nlr3ehp014o8q	cmq0wphib003ulr3e9b2cirgf	2026-06-05 12:34:48.172
cmq0wphut004nlr3ehp014o8q	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.174
cmq0wphut004nlr3ehp014o8q	cmq0wphim0042lr3e3m3ylstl	2026-06-05 12:34:48.176
cmq0wphut004nlr3ehp014o8q	cmq0wphiq0046lr3el595aegq	2026-06-05 12:34:48.177
cmq0wphut004nlr3ehp014o8q	cmq0wphj4004glr3ekcymt08o	2026-06-05 12:34:48.179
cmq0wphut004nlr3ehp014o8q	cmq0wphj7004jlr3enzpjjzh0	2026-06-05 12:34:48.18
cmq0wphx2004olr3e4eudg4lw	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.188
cmq0wphx2004olr3e4eudg4lw	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.19
cmq0wphx2004olr3e4eudg4lw	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.193
cmq0wphx2004olr3e4eudg4lw	cmq0wphdp000dlr3egitdeb7p	2026-06-05 12:34:48.195
cmq0wphx2004olr3e4eudg4lw	cmq0wphdr000elr3ebij726h2	2026-06-05 12:34:48.197
cmq0wphx2004olr3e4eudg4lw	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.198
cmq0wphx2004olr3e4eudg4lw	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.2
cmq0wphx2004olr3e4eudg4lw	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:48.202
cmq0wphx2004olr3e4eudg4lw	cmq0wphev0017lr3e9pn00g8b	2026-06-05 12:34:48.203
cmq0wphx2004olr3e4eudg4lw	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:48.204
cmq0wphx2004olr3e4eudg4lw	cmq0wphex0019lr3e6kigrqem	2026-06-05 12:34:48.206
cmq0wphx2004olr3e4eudg4lw	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:48.208
cmq0wphx2004olr3e4eudg4lw	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:48.209
cmq0wphx2004olr3e4eudg4lw	cmq0wphf1001clr3eyr130fgg	2026-06-05 12:34:48.211
cmq0wphx2004olr3e4eudg4lw	cmq0wphf2001dlr3esmpfybx5	2026-06-05 12:34:48.212
cmq0wphx2004olr3e4eudg4lw	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:48.214
cmq0wphx2004olr3e4eudg4lw	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:48.216
cmq0wphx2004olr3e4eudg4lw	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:48.218
cmq0wphx2004olr3e4eudg4lw	cmq0wphf8001ilr3erbt3wiq2	2026-06-05 12:34:48.219
cmq0wphx2004olr3e4eudg4lw	cmq0wphf9001jlr3evyt0o9pq	2026-06-05 12:34:48.222
cmq0wphx2004olr3e4eudg4lw	cmq0wphfa001klr3e2zxrgx3w	2026-06-05 12:34:48.224
cmq0wphx2004olr3e4eudg4lw	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:48.226
cmq0wphyc004plr3ebl9vqf5i	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.232
cmq0wphyc004plr3ebl9vqf5i	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.234
cmq0wphyc004plr3ebl9vqf5i	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.235
cmq0wphyc004plr3ebl9vqf5i	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.236
cmq0wphyc004plr3ebl9vqf5i	cmq0wphdy000jlr3e107tynan	2026-06-05 12:34:48.238
cmq0wphyc004plr3ebl9vqf5i	cmq0wphe0000klr3eyy4m8sv1	2026-06-05 12:34:48.239
cmq0wphyc004plr3ebl9vqf5i	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:48.242
cmq0wphyc004plr3ebl9vqf5i	cmq0wphe8000plr3eajt5xrgd	2026-06-05 12:34:48.244
cmq0wphyc004plr3ebl9vqf5i	cmq0wphe9000qlr3e74p7aomo	2026-06-05 12:34:48.245
cmq0wphyu004qlr3eabmws6yf	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.249
cmq0wphyu004qlr3eabmws6yf	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.251
cmq0wphyu004qlr3eabmws6yf	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.253
cmq0wphyu004qlr3eabmws6yf	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.254
cmq0wphyu004qlr3eabmws6yf	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:48.255
cmq0wphyu004qlr3eabmws6yf	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:48.256
cmq0wphyu004qlr3eabmws6yf	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:48.257
cmq0wphyu004qlr3eabmws6yf	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:48.26
cmq0wphyu004qlr3eabmws6yf	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:48.261
cmq0wphyu004qlr3eabmws6yf	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:48.263
cmq0wphyu004qlr3eabmws6yf	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:48.265
cmq0wphyu004qlr3eabmws6yf	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:48.266
cmq0wphyu004qlr3eabmws6yf	cmq0wphfw0020lr3euxk2jcv5	2026-06-05 12:34:48.268
cmq0wphyu004qlr3eabmws6yf	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.27
cmq0wphyu004qlr3eabmws6yf	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:48.274
cmq0wphzo004rlr3e9mcazj1e	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.279
cmq0wphzo004rlr3e9mcazj1e	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.281
cmq0wphzo004rlr3e9mcazj1e	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.283
cmq0wphzo004rlr3e9mcazj1e	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.284
cmq0wphzo004rlr3e9mcazj1e	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:48.286
cmq0wphzo004rlr3e9mcazj1e	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.288
cmq0wphzo004rlr3e9mcazj1e	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:48.29
cmq0wphzo004rlr3e9mcazj1e	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:48.291
cmq0wphzo004rlr3e9mcazj1e	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:48.293
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:48.295
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf1001clr3eyr130fgg	2026-06-05 12:34:48.297
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf2001dlr3esmpfybx5	2026-06-05 12:34:48.298
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:48.3
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:48.301
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:48.303
cmq0wphzo004rlr3e9mcazj1e	cmq0wphf8001ilr3erbt3wiq2	2026-06-05 12:34:48.304
cmq0wphzo004rlr3e9mcazj1e	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:48.306
cmq0wpi0j004slr3eq2r3k1oq	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.31
cmq0wpi0j004slr3eq2r3k1oq	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.311
cmq0wpi0j004slr3eq2r3k1oq	cmq0wphfx0021lr3e7nyk5105	2026-06-05 12:34:48.313
cmq0wpi0j004slr3eq2r3k1oq	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.315
cmq0wpi0j004slr3eq2r3k1oq	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:48.316
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.32
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.322
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:48.324
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphfz0022lr3e4q3ym6tz	2026-06-05 12:34:48.326
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.327
cmq0wpi0t004tlr3ey2rfiou2	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:48.329
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.334
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.335
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:48.336
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphg80029lr3eb901eybh	2026-06-05 12:34:48.338
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphga002alr3ebg7qbfnq	2026-06-05 12:34:48.34
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfe001nlr3ewtawu9eu	2026-06-05 12:34:48.342
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphff001olr3eb6ima827	2026-06-05 12:34:48.344
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfh001plr3eh7euk6lq	2026-06-05 12:34:48.346
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfm001tlr3ehpy79fka	2026-06-05 12:34:48.348
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfn001ulr3e9g7ic41u	2026-06-05 12:34:48.35
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfo001vlr3exj1nepge	2026-06-05 12:34:48.352
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphfu001zlr3e8gtxsrwd	2026-06-05 12:34:48.354
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphg00023lr3ereyy27cj	2026-06-05 12:34:48.355
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphg10024lr3ereihnz0j	2026-06-05 12:34:48.357
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphg60027lr3e960k1ym4	2026-06-05 12:34:48.359
cmq0wpi16004ulr3ew7ikxqd9	cmq0wphg70028lr3e595lx151	2026-06-05 12:34:48.361
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.367
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.369
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphd80002lr3efr61m8gp	2026-06-05 12:34:48.371
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphda0003lr3ek62wozbr	2026-06-05 12:34:48.373
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.375
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdp000dlr3egitdeb7p	2026-06-05 12:34:48.377
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdr000elr3ebij726h2	2026-06-05 12:34:48.379
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdu000glr3e1drre922	2026-06-05 12:34:48.381
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdv000hlr3eq52ntjin	2026-06-05 12:34:48.382
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.384
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphdy000jlr3e107tynan	2026-06-05 12:34:48.386
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe0000klr3eyy4m8sv1	2026-06-05 12:34:48.387
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe2000mlr3e17cn71xm	2026-06-05 12:34:48.389
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe4000nlr3e7ngxh192	2026-06-05 12:34:48.39
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe6000olr3ejcvwdjsp	2026-06-05 12:34:48.392
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe8000plr3eajt5xrgd	2026-06-05 12:34:48.394
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphe9000qlr3e74p7aomo	2026-06-05 12:34:48.395
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphec000slr3ezuzutkhn	2026-06-05 12:34:48.397
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphed000tlr3euzttx1ni	2026-06-05 12:34:48.399
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.401
cmq0wpi23004vlr3eqnz4j8fu	cmq0wpheg000vlr3e3qvint09	2026-06-05 12:34:48.402
cmq0wpi23004vlr3eqnz4j8fu	cmq0wpheh000wlr3erftql2ef	2026-06-05 12:34:48.404
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphek000ylr3eez6cunwf	2026-06-05 12:34:48.405
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphel000zlr3e1x7tey5h	2026-06-05 12:34:48.407
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:48.409
cmq0wpi23004vlr3eqnz4j8fu	cmq0wpheo0011lr3ennyesqcy	2026-06-05 12:34:48.414
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphep0012lr3ehkev53td	2026-06-05 12:34:48.416
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphes0014lr3e27l8bea5	2026-06-05 12:34:48.418
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphet0015lr3ejnt2cl5k	2026-06-05 12:34:48.421
cmq0wpi23004vlr3eqnz4j8fu	cmq0wpheu0016lr3ejqpgd82q	2026-06-05 12:34:48.423
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphev0017lr3e9pn00g8b	2026-06-05 12:34:48.425
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphew0018lr3em78ntkln	2026-06-05 12:34:48.427
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphex0019lr3e6kigrqem	2026-06-05 12:34:48.429
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphez001alr3ecq98uwq7	2026-06-05 12:34:48.431
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf0001blr3efgz4zha4	2026-06-05 12:34:48.433
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf1001clr3eyr130fgg	2026-06-05 12:34:48.435
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf5001flr3edxq4l8cz	2026-06-05 12:34:48.436
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf6001glr3e677ft7zq	2026-06-05 12:34:48.438
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf7001hlr3e2c9wuw1b	2026-06-05 12:34:48.44
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphf8001ilr3erbt3wiq2	2026-06-05 12:34:48.441
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphfd001mlr3en7e5bzfm	2026-06-05 12:34:48.443
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphfe001nlr3ewtawu9eu	2026-06-05 12:34:48.444
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphfm001tlr3ehpy79fka	2026-06-05 12:34:48.446
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphfn001ulr3e9g7ic41u	2026-06-05 12:34:48.447
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphfu001zlr3e8gtxsrwd	2026-06-05 12:34:48.448
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphgb002blr3evgkui70e	2026-06-05 12:34:48.45
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphgm002klr3e5kc7vxfa	2026-06-05 12:34:48.451
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphi2003olr3ehzyv90ss	2026-06-05 12:34:48.453
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphi4003plr3evlfzzn6j	2026-06-05 12:34:48.455
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphi5003qlr3e42h5i5my	2026-06-05 12:34:48.456
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphi7003slr3ew9roelpe	2026-06-05 12:34:48.458
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphi9003tlr3ec2ba3gmr	2026-06-05 12:34:48.459
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphib003ulr3e9b2cirgf	2026-06-05 12:34:48.461
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphic003vlr3egmlw6ard	2026-06-05 12:34:48.463
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphid003wlr3e5m3fgjpt	2026-06-05 12:34:48.465
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphif003ylr3ex4q58tgc	2026-06-05 12:34:48.466
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphih003zlr3exqw6y0td	2026-06-05 12:34:48.467
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphij0040lr3elxriny85	2026-06-05 12:34:48.469
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphim0042lr3e3m3ylstl	2026-06-05 12:34:48.47
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphiq0046lr3el595aegq	2026-06-05 12:34:48.471
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphis0047lr3e4mc0edy7	2026-06-05 12:34:48.472
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphj4004glr3ekcymt08o	2026-06-05 12:34:48.473
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphj5004hlr3evpqytc1d	2026-06-05 12:34:48.474
cmq0wpi23004vlr3eqnz4j8fu	cmq0wphj7004jlr3enzpjjzh0	2026-06-05 12:34:48.475
cmq0wpi58004wlr3e8sy3zaya	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.478
cmq0wpi58004wlr3e8sy3zaya	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.479
cmq0wpi58004wlr3e8sy3zaya	cmq0wphd80002lr3efr61m8gp	2026-06-05 12:34:48.48
cmq0wpi58004wlr3e8sy3zaya	cmq0wphda0003lr3ek62wozbr	2026-06-05 12:34:48.481
cmq0wpi58004wlr3e8sy3zaya	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.483
cmq0wpi58004wlr3e8sy3zaya	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.484
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgb002blr3evgkui70e	2026-06-05 12:34:48.485
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgc002clr3evxtshbdt	2026-06-05 12:34:48.486
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgd002dlr3efqyrlr5t	2026-06-05 12:34:48.488
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgg002flr3e0ywxcc9c	2026-06-05 12:34:48.489
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgh002glr3eqw4bpn4v	2026-06-05 12:34:48.49
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgi002hlr3eiixupy1h	2026-06-05 12:34:48.492
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgj002ilr3e7ocu0llv	2026-06-05 12:34:48.493
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgk002jlr3ezf5hnrm0	2026-06-05 12:34:48.494
cmq0wpi58004wlr3e8sy3zaya	cmq0wphgm002klr3e5kc7vxfa	2026-06-05 12:34:48.496
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.5
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.501
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.502
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.503
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphee000ulr3esxxa8iiy	2026-06-05 12:34:48.504
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphgn002llr3ec6org46i	2026-06-05 12:34:48.506
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphgs002plr3eyg15sgqj	2026-06-05 12:34:48.507
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphgt002qlr3eecwym18v	2026-06-05 12:34:48.508
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphgv002rlr3et2cdgler	2026-06-05 12:34:48.509
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphgy002tlr3emp26211b	2026-06-05 12:34:48.51
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh0002ulr3ee4wziq33	2026-06-05 12:34:48.511
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh2002vlr3e895hyfwd	2026-06-05 12:34:48.512
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh3002wlr3erku810ky	2026-06-05 12:34:48.513
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh5002xlr3e4sl9l803	2026-06-05 12:34:48.514
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh6002ylr3e2y65hxd2	2026-06-05 12:34:48.515
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh8002zlr3evt7soiys	2026-06-05 12:34:48.516
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphh90030lr3e851tzdh5	2026-06-05 12:34:48.518
cmq0wpi5u004xlr3ef3lcqjtm	cmq0wphha0031lr3e3vugi071	2026-06-05 12:34:48.519
cmq0wpi6g004ylr3e597ah2w2	cmq0wphd00000lr3egmo6bgwv	2026-06-05 12:34:48.523
cmq0wpi6g004ylr3e597ah2w2	cmq0wphd60001lr3em3ne9gud	2026-06-05 12:34:48.524
cmq0wpi6g004ylr3e597ah2w2	cmq0wphdo000clr3en5nn9rxn	2026-06-05 12:34:48.525
cmq0wpi6g004ylr3e597ah2w2	cmq0wphdx000ilr3euoxjdflv	2026-06-05 12:34:48.526
cmq0wpi6g004ylr3e597ah2w2	cmq0wphem0010lr3el1pce9dd	2026-06-05 12:34:48.527
cmq0wpi6g004ylr3e597ah2w2	cmq0wphgn002llr3ec6org46i	2026-06-05 12:34:48.528
cmq0wpi6g004ylr3e597ah2w2	cmq0wphgo002mlr3ee03uy6kd	2026-06-05 12:34:48.529
cmq0wpi6g004ylr3e597ah2w2	cmq0wphgp002nlr3e8ihmz2vf	2026-06-05 12:34:48.531
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhc0032lr3epukoudo9	2026-06-05 12:34:48.532
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhd0033lr3emvybcmr1	2026-06-05 12:34:48.533
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhe0034lr3eyywsso8m	2026-06-05 12:34:48.534
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhg0036lr3e2s57m4dt	2026-06-05 12:34:48.535
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhi0037lr3eq65amrmm	2026-06-05 12:34:48.536
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhj0038lr3e5ebnc8tg	2026-06-05 12:34:48.537
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhk0039lr3exza6r358	2026-06-05 12:34:48.538
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhm003blr3eov8nvsoz	2026-06-05 12:34:48.539
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhn003clr3ev95z34to	2026-06-05 12:34:48.54
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhp003dlr3e2dn6yyck	2026-06-05 12:34:48.541
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhq003elr3egxolom55	2026-06-05 12:34:48.543
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhr003flr3eitt4k491	2026-06-05 12:34:48.544
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhs003glr3ej4xkdpfm	2026-06-05 12:34:48.546
cmq0wpi6g004ylr3e597ah2w2	cmq0wphht003hlr3edce8lin4	2026-06-05 12:34:48.55
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhu003ilr3ev0yb98sv	2026-06-05 12:34:48.552
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhw003jlr3e7o9isd8o	2026-06-05 12:34:48.554
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhx003klr3e75j782a0	2026-06-05 12:34:48.555
cmq0wpi6g004ylr3e597ah2w2	cmq0wphhz003mlr3e4uzt3qpk	2026-06-05 12:34:48.556
cmq0wpi6g004ylr3e597ah2w2	cmq0wphi1003nlr3eik6se2fo	2026-06-05 12:34:48.557
cmq0wpi6g004ylr3e597ah2w2	cmq0wphiq0046lr3el595aegq	2026-06-05 12:34:48.559
cmq0wpi6g004ylr3e597ah2w2	cmq0wphis0047lr3e4mc0edy7	2026-06-05 12:34:48.56
cmq0wpi6g004ylr3e597ah2w2	cmq0wphj4004glr3ekcymt08o	2026-06-05 12:34:48.562
cmq0wpi6g004ylr3e597ah2w2	cmq0wphj5004hlr3evpqytc1d	2026-06-05 12:34:48.563
cmq0wpi6g004ylr3e597ah2w2	cmq0wphj7004jlr3enzpjjzh0	2026-06-05 12:34:48.564
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.roles (id, name, slug, description, is_active, created_at, updated_at) FROM stdin;
cmq0wphja004llr3e4muazamm	Super Admin	super-admin	Full access untuk development dan operasional platform.	t	2026-06-05 12:34:47.686	2026-06-05 12:34:47.686
cmq0wphox004mlr3em6712ybi	Admin Sekolah	admin-sekolah	Admin operasional sekolah.	t	2026-06-05 12:34:47.889	2026-06-05 12:34:47.889
cmq0wphut004nlr3ehp014o8q	Kepala Sekolah	kepala-sekolah	Akses monitoring manajemen sekolah.	t	2026-06-05 12:34:48.101	2026-06-05 12:34:48.101
cmq0wphx2004olr3e4eudg4lw	Waka Kurikulum	waka-kurikulum	Akses kurikulum dan master data akademik.	t	2026-06-05 12:34:48.183	2026-06-05 12:34:48.183
cmq0wphyc004plr3ebl9vqf5i	Waka Kesiswaan	waka-kesiswaan	Akses kesiswaan dan data pendukung.	t	2026-06-05 12:34:48.229	2026-06-05 12:34:48.229
cmq0wphyu004qlr3eabmws6yf	Guru	guru	Akses guru.	t	2026-06-05 12:34:48.247	2026-06-05 12:34:48.247
cmq0wphzo004rlr3e9mcazj1e	Wali Kelas	wali-kelas	Akses wali kelas.	t	2026-06-05 12:34:48.276	2026-06-05 12:34:48.276
cmq0wpi0j004slr3eq2r3k1oq	Siswa	siswa	Akses siswa.	t	2026-06-05 12:34:48.307	2026-06-05 12:34:48.307
cmq0wpi0t004tlr3ey2rfiou2	Orang Tua/Wali	orang-tua-wali	Akses orang tua atau wali.	t	2026-06-05 12:34:48.318	2026-06-05 12:34:48.318
cmq0wpi16004ulr3ew7ikxqd9	Bendahara	bendahara	Akses keuangan sekolah.	t	2026-06-05 12:34:48.331	2026-06-05 12:34:48.331
cmq0wpi23004vlr3eqnz4j8fu	Staff TU	staff-tu	Akses administrasi tata usaha.	t	2026-06-05 12:34:48.363	2026-06-05 12:34:48.363
cmq0wpi58004wlr3e8sy3zaya	Panitia PPDB	panitia-ppdb	Akses operasional PPDB.	t	2026-06-05 12:34:48.476	2026-06-05 12:34:48.476
cmq0wpi5u004xlr3ef3lcqjtm	Pembimbing PKL	pembimbing-pkl	Akses pembimbing PKL.	t	2026-06-05 12:34:48.498	2026-06-05 12:34:48.498
cmq0wpi6g004ylr3e597ah2w2	Admin BKK	admin-bkk	Akses bursa kerja khusus.	t	2026-06-05 12:34:48.521	2026-06-05 12:34:48.521
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.rooms (id, code, name, type, capacity, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-room-1	RK-10A	Ruang Kelas X A	KAMPUS	36	t	2026-06-05 12:34:48.599	2026-06-05 12:34:48.599	\N
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.schedules (id, teaching_assignment_id, room_id, lesson_hour_id, day_of_week, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-schedule-1	seed-ta-1	seed-room-1	seed-lh-1	MONDAY	t	2026-06-05 12:34:48.668	2026-06-05 12:34:48.668	\N
seed-schedule-2	seed-ta-2	seed-room-1	seed-lh-2	WEDNESDAY	t	2026-06-05 12:34:48.672	2026-06-05 12:34:48.672	\N
\.


--
-- Data for Name: school_profiles; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.school_profiles (id, name, npsn, address, phone, email, website, principal_name, logo_url, description, created_at, updated_at) FROM stdin;
cmq0wpi820050lr3e96xuk89a	NexSMSID School	\N	\N	\N	\N	\N	\N	\N	Profil sekolah awal untuk Phase 5.	2026-06-05 12:34:48.578	2026-06-05 12:34:48.578
\.


--
-- Data for Name: semesters; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.semesters (id, academic_year_id, name, "order", start_date, end_date, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-sem-1	seed-ay-2025	Ganjil	1	2025-07-01 00:00:00	2025-12-31 00:00:00	t	2026-06-05 12:34:48.586	2026-06-05 12:34:48.586	\N
\.


--
-- Data for Name: staffs; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.staffs (id, nip, name, gender, phone, email, address, "position", department, employment_status, status, photo_url, created_at, updated_at, deleted_at) FROM stdin;
seed-staff-1	198002022005011003	Hartono	MALE	081366611000	hartono@example.com	Jl. Diponegoro No. 3, Semarang	Kepala Tata Usaha	Tata Usaha	PERMANENT	ACTIVE	\N	2026-06-05 12:34:48.647	2026-06-05 12:34:48.647	\N
seed-staff-2	\N	Lina Marlina	FEMALE	081366622111	lina.marlina@example.com	Jl. Asia Afrika No. 8, Bandung	Staf Bendahara	Keuangan	PERMANENT	ACTIVE	\N	2026-06-05 12:34:48.65	2026-06-05 12:34:48.65	\N
\.


--
-- Data for Name: student_guardians; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.student_guardians (student_id, guardian_id, is_primary, created_at) FROM stdin;
cmq0wpi9e0052lr3enbuvc7rx	seed-guardian-ayah	t	2026-06-05 12:34:48.634
cmq0wpi9e0052lr3enbuvc7rx	seed-guardian-ibu	f	2026-06-05 12:34:48.637
cmq0wpi9j0054lr3eikzy8xdk	seed-guardian-ayah	t	2026-06-05 12:34:49.214
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.students (id, nis, nisn, name, gender, birth_place, birth_date, address, phone, email, classroom_id, status, photo_url, enrolled_at, created_at, updated_at, deleted_at, user_id) FROM stdin;
cmq0wpi9e0052lr3enbuvc7rx	20260001	1234567890	Andi Pratama	MALE	Jakarta	2008-05-12 00:00:00	Jl. Merdeka No. 1, Jakarta	081298765432	andi.pratama@example.com	seed-class-1	GRADUATED	\N	2024-07-15 00:00:00	2026-06-05 12:34:48.626	2026-06-05 12:34:48.801	\N	\N
cmq0wpi9j0054lr3eikzy8xdk	20260002	1234567891	Citra Lestari	FEMALE	Bandung	2008-09-20 00:00:00	Jl. Sudirman No. 2, Bandung	081298765433	siswa@nexsmsid.dev	seed-class-1	ACTIVE	\N	2024-07-15 00:00:00	2026-06-05 12:34:48.632	2026-06-05 12:34:49.21	\N	cmq0wpipi005qlr3ed8m8otq8
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.subjects (id, code, name, "group", is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-subj-mat	MAT	Matematika	A	t	2026-06-05 12:34:48.607	2026-06-05 12:34:48.607	\N
seed-subj-ind	IND	Bahasa Indonesia	A	t	2026-06-05 12:34:48.611	2026-06-05 12:34:48.611	\N
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.teachers (id, nip, nuptk, name, gender, birth_place, birth_date, phone, email, address, employment_status, status, photo_url, created_at, updated_at, deleted_at, user_id) FROM stdin;
seed-teacher-2	199003152015021002	\N	Rian Hidayat, M.Pd	MALE	Surabaya	1990-03-15 00:00:00	081355533444	rian.hidayat@example.com	Jl. Tunjungan No. 5, Surabaya	CONTRACT	ACTIVE	\N	2026-06-05 12:34:48.644	2026-06-05 12:34:48.644	\N	\N
seed-teacher-1	198501012010011001	1234567890123456	Dewi Anggraini, S.Pd	FEMALE	Yogyakarta	1985-01-01 00:00:00	081355511222	dewi.anggraini@example.com	Jl. Malioboro No. 10, Yogyakarta	PERMANENT	ACTIVE	\N	2026-06-05 12:34:48.639	2026-06-05 12:34:49.203	\N	cmq0wpipa005plr3etedgrwwq
\.


--
-- Data for Name: teaching_assignments; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.teaching_assignments (id, teacher_id, subject_id, classroom_id, academic_year_id, semester_id, is_active, created_at, updated_at, deleted_at) FROM stdin;
seed-ta-1	seed-teacher-1	seed-subj-mat	seed-class-1	seed-ay-2025	seed-sem-1	t	2026-06-05 12:34:48.662	2026-06-05 12:34:48.662	\N
seed-ta-2	seed-teacher-2	seed-subj-ind	seed-class-1	seed-ay-2025	seed-sem-1	t	2026-06-05 12:34:48.666	2026-06-05 12:34:48.666	\N
\.


--
-- Data for Name: tracer_studies; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.tracer_studies (id, alumni_id, year, status, company_name, "position", university, major, business_name, income_range, feedback, created_at, updated_at) FROM stdin;
seed-tracer-study-1	seed-alumni-1	2026	WORKING	PT Maju Motor Indonesia	Junior Mechanic	\N	\N	\N	Rp3.000.000 - Rp5.000.000	Kompetensi praktik sangat membantu pekerjaan	2026-06-05 12:34:48.823	2026-06-05 12:34:48.823
seed-tracer-study-2	seed-alumni-2	2026	STUDYING	\N	\N	Politeknik Negeri Bandung	Teknik Informatika	\N	\N	Perlu lebih banyak materi persiapan karier	2026-06-05 12:34:48.826	2026-06-05 12:34:48.826
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.user_roles (user_id, role_id, created_at) FROM stdin;
cmq0wpi7r004zlr3e1bl37xe8	cmq0wphja004llr3e4muazamm	2026-06-05 12:34:48.571
cmq0wpipa005plr3etedgrwwq	cmq0wphyu004qlr3eabmws6yf	2026-06-05 12:34:49.2
cmq0wpipi005qlr3ed8m8otq8	cmq0wpi0j004slr3eq2r3k1oq	2026-06-05 12:34:49.208
cmq0wpipr005rlr3e8w54v7rv	cmq0wpi0t004tlr3ey2rfiou2	2026-06-05 12:34:49.217
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nexsmsid
--

COPY public.users (id, email, username, name, password_hash, status, last_login_at, created_at, updated_at, deleted_at) FROM stdin;
cmq0wpipa005plr3etedgrwwq	guru@nexsmsid.dev	\N	Dewi Anggraini, S.Pd	$2a$12$1CXLpearQXQ.RM8rXnJi.uisdaJrAHo9acoas7qHGxadJNtNChM5a	ACTIVE	2026-06-05 12:43:38.121	2026-06-05 12:34:49.198	2026-06-05 12:43:38.123	\N
cmq0wpipi005qlr3ed8m8otq8	siswa@nexsmsid.dev	\N	Citra Lestari	$2a$12$1CXLpearQXQ.RM8rXnJi.uisdaJrAHo9acoas7qHGxadJNtNChM5a	ACTIVE	2026-06-05 12:43:38.743	2026-06-05 12:34:49.206	2026-06-05 12:43:38.744	\N
cmq0wpipr005rlr3e8w54v7rv	wali@nexsmsid.dev	\N	Budi Santoso	$2a$12$1CXLpearQXQ.RM8rXnJi.uisdaJrAHo9acoas7qHGxadJNtNChM5a	ACTIVE	2026-06-05 12:43:39.363	2026-06-05 12:34:49.215	2026-06-05 12:43:39.365	\N
cmq0wpi7r004zlr3e1bl37xe8	superadmin@nexsmsid.dev	\N	Super Admin NexSMSID	$2a$10$FqYsOtnYwqWM4FtOKKvt.Oq/coy/QFN9W/sr5GHQ89XPjqgKCuxfG	ACTIVE	2026-06-05 13:26:30.969	2026-06-05 12:34:48.567	2026-06-05 14:50:52.748	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: alumni alumni_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_pkey PRIMARY KEY (id);


--
-- Name: announcement_recipients announcement_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: attendance_sessions attendance_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: classrooms classrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.classrooms
    ADD CONSTRAINT classrooms_pkey PRIMARY KEY (id);


--
-- Name: competencies competencies_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.competencies
    ADD CONSTRAINT competencies_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: export_histories export_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.export_histories
    ADD CONSTRAINT export_histories_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: guardians guardians_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.guardians
    ADD CONSTRAINT guardians_pkey PRIMARY KEY (id);


--
-- Name: industry_partners industry_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.industry_partners
    ADD CONSTRAINT industry_partners_pkey PRIMARY KEY (id);


--
-- Name: internal_messages internal_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_pkey PRIMARY KEY (id);


--
-- Name: internship_logs internship_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_logs
    ADD CONSTRAINT internship_logs_pkey PRIMARY KEY (id);


--
-- Name: internship_scores internship_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_scores
    ADD CONSTRAINT internship_scores_pkey PRIMARY KEY (id);


--
-- Name: internships internships_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_vacancies job_vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.job_vacancies
    ADD CONSTRAINT job_vacancies_pkey PRIMARY KEY (id);


--
-- Name: lesson_hours lesson_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.lesson_hours
    ADD CONSTRAINT lesson_hours_pkey PRIMARY KEY (id);


--
-- Name: notification_templates notification_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payment_categories payment_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.payment_categories
    ADD CONSTRAINT payment_categories_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: ppdb_documents ppdb_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_documents
    ADD CONSTRAINT ppdb_documents_pkey PRIMARY KEY (id);


--
-- Name: ppdb_periods ppdb_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_periods
    ADD CONSTRAINT ppdb_periods_pkey PRIMARY KEY (id);


--
-- Name: ppdb_registrations ppdb_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_pkey PRIMARY KEY (id);


--
-- Name: ppdb_status_histories ppdb_status_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_status_histories
    ADD CONSTRAINT ppdb_status_histories_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: report_jobs report_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.report_jobs
    ADD CONSTRAINT report_jobs_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: school_profiles school_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.school_profiles
    ADD CONSTRAINT school_profiles_pkey PRIMARY KEY (id);


--
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (id);


--
-- Name: staffs staffs_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.staffs
    ADD CONSTRAINT staffs_pkey PRIMARY KEY (id);


--
-- Name: student_guardians student_guardians_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.student_guardians
    ADD CONSTRAINT student_guardians_pkey PRIMARY KEY (student_id, guardian_id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: teaching_assignments teaching_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_pkey PRIMARY KEY (id);


--
-- Name: tracer_studies tracer_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.tracer_studies
    ADD CONSTRAINT tracer_studies_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_years_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX academic_years_deleted_at_idx ON public.academic_years USING btree (deleted_at);


--
-- Name: academic_years_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX academic_years_is_active_idx ON public.academic_years USING btree (is_active);


--
-- Name: alumni_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX alumni_deleted_at_idx ON public.alumni USING btree (deleted_at);


--
-- Name: alumni_graduation_year_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX alumni_graduation_year_idx ON public.alumni USING btree (graduation_year);


--
-- Name: alumni_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX alumni_name_idx ON public.alumni USING btree (name);


--
-- Name: alumni_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX alumni_status_idx ON public.alumni USING btree (status);


--
-- Name: alumni_student_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX alumni_student_id_key ON public.alumni USING btree (student_id);


--
-- Name: announcement_recipients_announcement_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcement_recipients_announcement_id_idx ON public.announcement_recipients USING btree (announcement_id);


--
-- Name: announcement_recipients_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcement_recipients_user_id_idx ON public.announcement_recipients USING btree (user_id);


--
-- Name: announcements_audience_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcements_audience_idx ON public.announcements USING btree (audience);


--
-- Name: announcements_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcements_deleted_at_idx ON public.announcements USING btree (deleted_at);


--
-- Name: announcements_published_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcements_published_at_idx ON public.announcements USING btree (published_at);


--
-- Name: announcements_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX announcements_status_idx ON public.announcements USING btree (status);


--
-- Name: assessments_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX assessments_deleted_at_idx ON public.assessments USING btree (deleted_at);


--
-- Name: assessments_teaching_assignment_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX assessments_teaching_assignment_id_idx ON public.assessments USING btree (teaching_assignment_id);


--
-- Name: attendance_records_session_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX attendance_records_session_id_idx ON public.attendance_records USING btree (session_id);


--
-- Name: attendance_records_session_id_student_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX attendance_records_session_id_student_id_key ON public.attendance_records USING btree (session_id, student_id);


--
-- Name: attendance_records_student_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX attendance_records_student_id_idx ON public.attendance_records USING btree (student_id);


--
-- Name: attendance_sessions_date_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX attendance_sessions_date_idx ON public.attendance_sessions USING btree (date);


--
-- Name: attendance_sessions_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX attendance_sessions_deleted_at_idx ON public.attendance_sessions USING btree (deleted_at);


--
-- Name: attendance_sessions_schedule_id_date_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX attendance_sessions_schedule_id_date_key ON public.attendance_sessions USING btree (schedule_id, date);


--
-- Name: attendance_sessions_schedule_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX attendance_sessions_schedule_id_idx ON public.attendance_sessions USING btree (schedule_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_actor_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX audit_logs_actor_id_idx ON public.audit_logs USING btree (actor_id);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_entity_entity_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX audit_logs_entity_entity_id_idx ON public.audit_logs USING btree (entity, entity_id);


--
-- Name: classrooms_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX classrooms_code_key ON public.classrooms USING btree (code);


--
-- Name: classrooms_competency_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX classrooms_competency_id_idx ON public.classrooms USING btree (competency_id);


--
-- Name: classrooms_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX classrooms_deleted_at_idx ON public.classrooms USING btree (deleted_at);


--
-- Name: classrooms_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX classrooms_is_active_idx ON public.classrooms USING btree (is_active);


--
-- Name: competencies_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX competencies_code_key ON public.competencies USING btree (code);


--
-- Name: competencies_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX competencies_deleted_at_idx ON public.competencies USING btree (deleted_at);


--
-- Name: competencies_department_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX competencies_department_id_idx ON public.competencies USING btree (department_id);


--
-- Name: competencies_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX competencies_is_active_idx ON public.competencies USING btree (is_active);


--
-- Name: departments_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX departments_code_key ON public.departments USING btree (code);


--
-- Name: departments_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX departments_deleted_at_idx ON public.departments USING btree (deleted_at);


--
-- Name: departments_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX departments_is_active_idx ON public.departments USING btree (is_active);


--
-- Name: expenses_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX expenses_deleted_at_idx ON public.expenses USING btree (deleted_at);


--
-- Name: expenses_expense_number_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX expenses_expense_number_key ON public.expenses USING btree (expense_number);


--
-- Name: expenses_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX expenses_status_idx ON public.expenses USING btree (status);


--
-- Name: export_histories_entity_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX export_histories_entity_idx ON public.export_histories USING btree (entity);


--
-- Name: export_histories_report_job_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX export_histories_report_job_id_idx ON public.export_histories USING btree (report_job_id);


--
-- Name: export_histories_requested_by_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX export_histories_requested_by_id_idx ON public.export_histories USING btree (requested_by_id);


--
-- Name: grades_assessment_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX grades_assessment_id_idx ON public.grades USING btree (assessment_id);


--
-- Name: grades_assessment_id_student_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX grades_assessment_id_student_id_key ON public.grades USING btree (assessment_id, student_id);


--
-- Name: grades_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX grades_status_idx ON public.grades USING btree (status);


--
-- Name: grades_student_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX grades_student_id_idx ON public.grades USING btree (student_id);


--
-- Name: guardians_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX guardians_email_key ON public.guardians USING btree (email);


--
-- Name: guardians_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX guardians_name_idx ON public.guardians USING btree (name);


--
-- Name: guardians_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX guardians_user_id_idx ON public.guardians USING btree (user_id);


--
-- Name: guardians_user_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX guardians_user_id_key ON public.guardians USING btree (user_id);


--
-- Name: industry_partners_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX industry_partners_deleted_at_idx ON public.industry_partners USING btree (deleted_at);


--
-- Name: industry_partners_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX industry_partners_name_idx ON public.industry_partners USING btree (name);


--
-- Name: industry_partners_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX industry_partners_status_idx ON public.industry_partners USING btree (status);


--
-- Name: internal_messages_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internal_messages_deleted_at_idx ON public.internal_messages USING btree (deleted_at);


--
-- Name: internal_messages_recipient_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internal_messages_recipient_id_idx ON public.internal_messages USING btree (recipient_id);


--
-- Name: internal_messages_sender_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internal_messages_sender_id_idx ON public.internal_messages USING btree (sender_id);


--
-- Name: internal_messages_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internal_messages_status_idx ON public.internal_messages USING btree (status);


--
-- Name: internship_logs_internship_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internship_logs_internship_id_idx ON public.internship_logs USING btree (internship_id);


--
-- Name: internship_logs_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internship_logs_status_idx ON public.internship_logs USING btree (status);


--
-- Name: internship_scores_assessed_by_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internship_scores_assessed_by_id_idx ON public.internship_scores USING btree (assessed_by_id);


--
-- Name: internship_scores_internship_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX internship_scores_internship_id_key ON public.internship_scores USING btree (internship_id);


--
-- Name: internships_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internships_deleted_at_idx ON public.internships USING btree (deleted_at);


--
-- Name: internships_industry_partner_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internships_industry_partner_id_idx ON public.internships USING btree (industry_partner_id);


--
-- Name: internships_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internships_status_idx ON public.internships USING btree (status);


--
-- Name: internships_student_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internships_student_id_idx ON public.internships USING btree (student_id);


--
-- Name: internships_supervisor_teacher_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX internships_supervisor_teacher_id_idx ON public.internships USING btree (supervisor_teacher_id);


--
-- Name: invoice_items_invoice_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX invoice_items_invoice_id_idx ON public.invoice_items USING btree (invoice_id);


--
-- Name: invoices_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX invoices_deleted_at_idx ON public.invoices USING btree (deleted_at);


--
-- Name: invoices_invoice_number_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX invoices_invoice_number_key ON public.invoices USING btree (invoice_number);


--
-- Name: invoices_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX invoices_status_idx ON public.invoices USING btree (status);


--
-- Name: invoices_student_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX invoices_student_id_idx ON public.invoices USING btree (student_id);


--
-- Name: job_applications_alumni_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_applications_alumni_id_idx ON public.job_applications USING btree (alumni_id);


--
-- Name: job_applications_job_vacancy_id_applicant_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX job_applications_job_vacancy_id_applicant_email_key ON public.job_applications USING btree (job_vacancy_id, applicant_email);


--
-- Name: job_applications_job_vacancy_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_applications_job_vacancy_id_idx ON public.job_applications USING btree (job_vacancy_id);


--
-- Name: job_applications_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_applications_status_idx ON public.job_applications USING btree (status);


--
-- Name: job_vacancies_deadline_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_vacancies_deadline_idx ON public.job_vacancies USING btree (deadline);


--
-- Name: job_vacancies_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_vacancies_deleted_at_idx ON public.job_vacancies USING btree (deleted_at);


--
-- Name: job_vacancies_industry_partner_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_vacancies_industry_partner_id_idx ON public.job_vacancies USING btree (industry_partner_id);


--
-- Name: job_vacancies_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX job_vacancies_status_idx ON public.job_vacancies USING btree (status);


--
-- Name: lesson_hours_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX lesson_hours_deleted_at_idx ON public.lesson_hours USING btree (deleted_at);


--
-- Name: lesson_hours_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX lesson_hours_is_active_idx ON public.lesson_hours USING btree (is_active);


--
-- Name: lesson_hours_order_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX lesson_hours_order_idx ON public.lesson_hours USING btree ("order");


--
-- Name: notification_templates_channel_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notification_templates_channel_idx ON public.notification_templates USING btree (channel);


--
-- Name: notification_templates_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX notification_templates_code_key ON public.notification_templates USING btree (code);


--
-- Name: notification_templates_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notification_templates_deleted_at_idx ON public.notification_templates USING btree (deleted_at);


--
-- Name: notification_templates_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notification_templates_is_active_idx ON public.notification_templates USING btree (is_active);


--
-- Name: notifications_channel_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notifications_channel_idx ON public.notifications USING btree (channel);


--
-- Name: notifications_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notifications_status_idx ON public.notifications USING btree (status);


--
-- Name: notifications_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);


--
-- Name: payment_categories_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX payment_categories_code_key ON public.payment_categories USING btree (code);


--
-- Name: payment_categories_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX payment_categories_deleted_at_idx ON public.payment_categories USING btree (deleted_at);


--
-- Name: payment_categories_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX payment_categories_is_active_idx ON public.payment_categories USING btree (is_active);


--
-- Name: payments_invoice_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX payments_invoice_id_idx ON public.payments USING btree (invoice_id);


--
-- Name: payments_payment_number_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX payments_payment_number_key ON public.payments USING btree (payment_number);


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: permissions_key_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX permissions_key_key ON public.permissions USING btree (key);


--
-- Name: ppdb_documents_registration_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_documents_registration_id_idx ON public.ppdb_documents USING btree (registration_id);


--
-- Name: ppdb_periods_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_periods_is_active_idx ON public.ppdb_periods USING btree (is_active);


--
-- Name: ppdb_registrations_converted_student_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_registrations_converted_student_id_idx ON public.ppdb_registrations USING btree (converted_student_id);


--
-- Name: ppdb_registrations_period_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_registrations_period_id_idx ON public.ppdb_registrations USING btree (period_id);


--
-- Name: ppdb_registrations_registration_number_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX ppdb_registrations_registration_number_key ON public.ppdb_registrations USING btree (registration_number);


--
-- Name: ppdb_registrations_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_registrations_status_idx ON public.ppdb_registrations USING btree (status);


--
-- Name: ppdb_status_histories_registration_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX ppdb_status_histories_registration_id_idx ON public.ppdb_status_histories USING btree (registration_id);


--
-- Name: refresh_tokens_expires_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX refresh_tokens_expires_at_idx ON public.refresh_tokens USING btree (expires_at);


--
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- Name: report_jobs_requested_by_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX report_jobs_requested_by_id_idx ON public.report_jobs USING btree (requested_by_id);


--
-- Name: report_jobs_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX report_jobs_status_idx ON public.report_jobs USING btree (status);


--
-- Name: report_jobs_type_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX report_jobs_type_idx ON public.report_jobs USING btree (type);


--
-- Name: role_permissions_permission_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX role_permissions_permission_id_idx ON public.role_permissions USING btree (permission_id);


--
-- Name: roles_slug_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX roles_slug_key ON public.roles USING btree (slug);


--
-- Name: rooms_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX rooms_code_key ON public.rooms USING btree (code);


--
-- Name: rooms_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX rooms_deleted_at_idx ON public.rooms USING btree (deleted_at);


--
-- Name: rooms_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX rooms_is_active_idx ON public.rooms USING btree (is_active);


--
-- Name: schedules_day_of_week_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX schedules_day_of_week_idx ON public.schedules USING btree (day_of_week);


--
-- Name: schedules_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX schedules_deleted_at_idx ON public.schedules USING btree (deleted_at);


--
-- Name: schedules_lesson_hour_id_day_of_week_teaching_assignment_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX schedules_lesson_hour_id_day_of_week_teaching_assignment_id_key ON public.schedules USING btree (lesson_hour_id, day_of_week, teaching_assignment_id);


--
-- Name: schedules_lesson_hour_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX schedules_lesson_hour_id_idx ON public.schedules USING btree (lesson_hour_id);


--
-- Name: schedules_room_id_day_of_week_lesson_hour_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX schedules_room_id_day_of_week_lesson_hour_id_key ON public.schedules USING btree (room_id, day_of_week, lesson_hour_id);


--
-- Name: schedules_room_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX schedules_room_id_idx ON public.schedules USING btree (room_id);


--
-- Name: schedules_teaching_assignment_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX schedules_teaching_assignment_id_idx ON public.schedules USING btree (teaching_assignment_id);


--
-- Name: semesters_academic_year_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX semesters_academic_year_id_idx ON public.semesters USING btree (academic_year_id);


--
-- Name: semesters_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX semesters_deleted_at_idx ON public.semesters USING btree (deleted_at);


--
-- Name: semesters_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX semesters_is_active_idx ON public.semesters USING btree (is_active);


--
-- Name: staffs_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX staffs_deleted_at_idx ON public.staffs USING btree (deleted_at);


--
-- Name: staffs_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX staffs_email_key ON public.staffs USING btree (email);


--
-- Name: staffs_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX staffs_name_idx ON public.staffs USING btree (name);


--
-- Name: staffs_nip_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX staffs_nip_key ON public.staffs USING btree (nip);


--
-- Name: staffs_position_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX staffs_position_idx ON public.staffs USING btree ("position");


--
-- Name: staffs_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX staffs_status_idx ON public.staffs USING btree (status);


--
-- Name: student_guardians_guardian_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX student_guardians_guardian_id_idx ON public.student_guardians USING btree (guardian_id);


--
-- Name: students_classroom_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX students_classroom_id_idx ON public.students USING btree (classroom_id);


--
-- Name: students_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX students_deleted_at_idx ON public.students USING btree (deleted_at);


--
-- Name: students_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX students_email_key ON public.students USING btree (email);


--
-- Name: students_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX students_name_idx ON public.students USING btree (name);


--
-- Name: students_nis_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX students_nis_key ON public.students USING btree (nis);


--
-- Name: students_nisn_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX students_nisn_key ON public.students USING btree (nisn);


--
-- Name: students_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX students_status_idx ON public.students USING btree (status);


--
-- Name: students_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX students_user_id_idx ON public.students USING btree (user_id);


--
-- Name: students_user_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);


--
-- Name: subjects_code_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX subjects_code_key ON public.subjects USING btree (code);


--
-- Name: subjects_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX subjects_deleted_at_idx ON public.subjects USING btree (deleted_at);


--
-- Name: subjects_is_active_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX subjects_is_active_idx ON public.subjects USING btree (is_active);


--
-- Name: teachers_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teachers_deleted_at_idx ON public.teachers USING btree (deleted_at);


--
-- Name: teachers_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX teachers_email_key ON public.teachers USING btree (email);


--
-- Name: teachers_name_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teachers_name_idx ON public.teachers USING btree (name);


--
-- Name: teachers_nip_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX teachers_nip_key ON public.teachers USING btree (nip);


--
-- Name: teachers_nuptk_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX teachers_nuptk_key ON public.teachers USING btree (nuptk);


--
-- Name: teachers_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teachers_status_idx ON public.teachers USING btree (status);


--
-- Name: teachers_user_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teachers_user_id_idx ON public.teachers USING btree (user_id);


--
-- Name: teachers_user_id_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX teachers_user_id_key ON public.teachers USING btree (user_id);


--
-- Name: teaching_assignments_academic_year_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_academic_year_id_idx ON public.teaching_assignments USING btree (academic_year_id);


--
-- Name: teaching_assignments_classroom_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_classroom_id_idx ON public.teaching_assignments USING btree (classroom_id);


--
-- Name: teaching_assignments_deleted_at_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_deleted_at_idx ON public.teaching_assignments USING btree (deleted_at);


--
-- Name: teaching_assignments_semester_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_semester_id_idx ON public.teaching_assignments USING btree (semester_id);


--
-- Name: teaching_assignments_subject_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_subject_id_idx ON public.teaching_assignments USING btree (subject_id);


--
-- Name: teaching_assignments_teacher_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX teaching_assignments_teacher_id_idx ON public.teaching_assignments USING btree (teacher_id);


--
-- Name: teaching_assignments_teacher_id_subject_id_classroom_id_sem_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX teaching_assignments_teacher_id_subject_id_classroom_id_sem_key ON public.teaching_assignments USING btree (teacher_id, subject_id, classroom_id, semester_id);


--
-- Name: tracer_studies_alumni_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX tracer_studies_alumni_id_idx ON public.tracer_studies USING btree (alumni_id);


--
-- Name: tracer_studies_status_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX tracer_studies_status_idx ON public.tracer_studies USING btree (status);


--
-- Name: tracer_studies_year_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX tracer_studies_year_idx ON public.tracer_studies USING btree (year);


--
-- Name: user_roles_role_id_idx; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE INDEX user_roles_role_id_idx ON public.user_roles USING btree (role_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: nexsmsid
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: alumni alumni_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.alumni
    ADD CONSTRAINT alumni_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: announcement_recipients announcement_recipients_announcement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.announcement_recipients
    ADD CONSTRAINT announcement_recipients_announcement_id_fkey FOREIGN KEY (announcement_id) REFERENCES public.announcements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: announcements announcements_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_teaching_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_teaching_assignment_id_fkey FOREIGN KEY (teaching_assignment_id) REFERENCES public.teaching_assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.attendance_sessions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_records attendance_records_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attendance_sessions attendance_sessions_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.attendance_sessions
    ADD CONSTRAINT attendance_sessions_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.schedules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: classrooms classrooms_competency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.classrooms
    ADD CONSTRAINT classrooms_competency_id_fkey FOREIGN KEY (competency_id) REFERENCES public.competencies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: competencies competencies_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.competencies
    ADD CONSTRAINT competencies_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: expenses expenses_approved_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_id_fkey FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: export_histories export_histories_report_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.export_histories
    ADD CONSTRAINT export_histories_report_job_id_fkey FOREIGN KEY (report_job_id) REFERENCES public.report_jobs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: export_histories export_histories_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.export_histories
    ADD CONSTRAINT export_histories_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: grades grades_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: guardians guardians_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.guardians
    ADD CONSTRAINT guardians_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: internal_messages internal_messages_read_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_read_by_id_fkey FOREIGN KEY (read_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: internal_messages internal_messages_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: internal_messages internal_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: internship_logs internship_logs_internship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_logs
    ADD CONSTRAINT internship_logs_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: internship_logs internship_logs_reviewed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_logs
    ADD CONSTRAINT internship_logs_reviewed_by_id_fkey FOREIGN KEY (reviewed_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: internship_scores internship_scores_assessed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_scores
    ADD CONSTRAINT internship_scores_assessed_by_id_fkey FOREIGN KEY (assessed_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: internship_scores internship_scores_internship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internship_scores
    ADD CONSTRAINT internship_scores_internship_id_fkey FOREIGN KEY (internship_id) REFERENCES public.internships(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: internships internships_industry_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_industry_partner_id_fkey FOREIGN KEY (industry_partner_id) REFERENCES public.industry_partners(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: internships internships_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: internships internships_supervisor_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_supervisor_teacher_id_fkey FOREIGN KEY (supervisor_teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_payment_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_payment_category_id_fkey FOREIGN KEY (payment_category_id) REFERENCES public.payment_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_applications job_applications_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_applications job_applications_job_vacancy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_vacancy_id_fkey FOREIGN KEY (job_vacancy_id) REFERENCES public.job_vacancies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: job_vacancies job_vacancies_industry_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.job_vacancies
    ADD CONSTRAINT job_vacancies_industry_partner_id_fkey FOREIGN KEY (industry_partner_id) REFERENCES public.industry_partners(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notification_templates notification_templates_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.notification_templates
    ADD CONSTRAINT notification_templates_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_documents ppdb_documents_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_documents
    ADD CONSTRAINT ppdb_documents_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.ppdb_registrations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ppdb_periods ppdb_periods_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_periods
    ADD CONSTRAINT ppdb_periods_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_registrations ppdb_registrations_converted_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_converted_student_id_fkey FOREIGN KEY (converted_student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_registrations ppdb_registrations_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.ppdb_periods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ppdb_registrations ppdb_registrations_selected_competency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_selected_competency_id_fkey FOREIGN KEY (selected_competency_id) REFERENCES public.competencies(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_registrations ppdb_registrations_selected_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_selected_department_id_fkey FOREIGN KEY (selected_department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_registrations ppdb_registrations_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_registrations
    ADD CONSTRAINT ppdb_registrations_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_status_histories ppdb_status_histories_changed_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_status_histories
    ADD CONSTRAINT ppdb_status_histories_changed_by_id_fkey FOREIGN KEY (changed_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ppdb_status_histories ppdb_status_histories_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.ppdb_status_histories
    ADD CONSTRAINT ppdb_status_histories_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.ppdb_registrations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: report_jobs report_jobs_requested_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.report_jobs
    ADD CONSTRAINT report_jobs_requested_by_id_fkey FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedules schedules_lesson_hour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_lesson_hour_id_fkey FOREIGN KEY (lesson_hour_id) REFERENCES public.lesson_hours(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_teaching_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_teaching_assignment_id_fkey FOREIGN KEY (teaching_assignment_id) REFERENCES public.teaching_assignments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: semesters semesters_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_guardians student_guardians_guardian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.student_guardians
    ADD CONSTRAINT student_guardians_guardian_id_fkey FOREIGN KEY (guardian_id) REFERENCES public.guardians(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_guardians student_guardians_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.student_guardians
    ADD CONSTRAINT student_guardians_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: students students_classroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teaching_assignments teaching_assignments_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_assignments teaching_assignments_classroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_assignments teaching_assignments_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_assignments teaching_assignments_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_assignments teaching_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.teaching_assignments
    ADD CONSTRAINT teaching_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tracer_studies tracer_studies_alumni_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.tracer_studies
    ADD CONSTRAINT tracer_studies_alumni_id_fkey FOREIGN KEY (alumni_id) REFERENCES public.alumni(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nexsmsid
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict TDNgzuAQk6p0ZnmZggYQX7XLWgqUWEeC8yxR1VV2dgqZ4oHJTVywWRJzLwyntne

