-- ============================================
-- BASE DE DONNÉES GRH AMÉLIORÉE
-- Version: 2.0
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Grade
CREATE TABLE Grade (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(191) NOT NULL,
    name_ar VARCHAR(191) DEFAULT NULL,
    level INT(11) NOT NULL,
    category VARCHAR(100) NOT NULL,
    min_salary DOUBLE NOT NULL,
    max_salary DOUBLE NOT NULL,
    description TEXT DEFAULT NULL,
    benefits JSON DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    INDEX idx_grade_level (level),
    INDEX idx_grade_category (category)
) ;

-- 2. User
CREATE TABLE User (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(191) NOT NULL,
    role VARCHAR(191) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login DATETIME(3) DEFAULT NULL,
    failed_login_attempts INT(11) DEFAULT 0,
    account_locked_until DATETIME(3) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ;

-- 3. Department
CREATE TABLE Department (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(191) NOT NULL,
    name_ar VARCHAR(191) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    budget DOUBLE DEFAULT NULL,
    manager_id INT(11) DEFAULT NULL,
    parent_department_id INT(11) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 4. Employee
CREATE TABLE Employee (
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL UNIQUE,
    employee_code VARCHAR(191) NOT NULL UNIQUE,
    first_name VARCHAR(191) NOT NULL,
    last_name VARCHAR(191) NOT NULL,
    first_name_ar VARCHAR(191) DEFAULT NULL,
    last_name_ar VARCHAR(191) DEFAULT NULL,
    position VARCHAR(191) NOT NULL,
    grade_id INT(11) DEFAULT NULL,
    department_id INT(11) DEFAULT NULL,
    manager_id INT(11) DEFAULT NULL,
    hire_date DATETIME(3) NOT NULL,
    contract_start_date DATETIME(3) DEFAULT NULL,
    contract_end_date DATETIME(3) DEFAULT NULL,
    probation_end_date DATETIME(3) DEFAULT NULL,
    base_salary DOUBLE NOT NULL,
    currency VARCHAR(191) NOT NULL DEFAULT 'MRU',
    date_of_birth DATE DEFAULT NULL,
    gender VARCHAR(20) DEFAULT NULL,
    nationality VARCHAR(100) DEFAULT NULL,
    national_id VARCHAR(100) DEFAULT NULL,
    passport_number VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(191) NOT NULL,
    emergency_contact VARCHAR(191) DEFAULT NULL,
    emergency_phone VARCHAR(191) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    bank_name VARCHAR(191) DEFAULT NULL,
    bank_account VARCHAR(191) DEFAULT NULL,
    iban VARCHAR(191) DEFAULT NULL,
    education_level VARCHAR(100) DEFAULT NULL,
    skills JSON DEFAULT NULL,
    certifications JSON DEFAULT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'active',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 5. GradeHistory
CREATE TABLE GradeHistory (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    old_grade_id INT(11) DEFAULT NULL,
    new_grade_id INT(11) NOT NULL,
    old_salary DOUBLE DEFAULT NULL,
    new_salary DOUBLE NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT DEFAULT NULL,
    approved_by INT(11) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 6. Attendance
CREATE TABLE Attendance (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    date DATE NOT NULL,
    check_in DATETIME(3) DEFAULT NULL,
    check_out DATETIME(3) DEFAULT NULL,
    break_start DATETIME(3) DEFAULT NULL,
    break_end DATETIME(3) DEFAULT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'present',
    work_hours DECIMAL(5,2) DEFAULT NULL,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    location VARCHAR(191) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY unique_employee_date (employee_id, date)
) ;

-- 7. LeaveType
CREATE TABLE LeaveType (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(191) NOT NULL,
    name_ar VARCHAR(191) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    max_days_per_year INT(11) DEFAULT NULL,
    is_paid TINYINT(1) NOT NULL DEFAULT 1,
    requires_approval TINYINT(1) NOT NULL DEFAULT 1,
    min_notice_days INT(11) DEFAULT 0,
    color VARCHAR(20) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 8. LeaveRequest
CREATE TABLE LeaveRequest (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    leave_type_id INT(11) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INT(11) NOT NULL,
    reason TEXT DEFAULT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'pending',
    approved_by INT(11) DEFAULT NULL,
    approval_date DATETIME(3) DEFAULT NULL,
    rejection_reason TEXT DEFAULT NULL,
    document_url VARCHAR(191) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 9. LeaveBalance
CREATE TABLE LeaveBalance (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    leave_type_id INT(11) NOT NULL,
    year INT(11) NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    used_days DECIMAL(5,2) NOT NULL DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days) STORED,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY unique_employee_leave_year (employee_id, leave_type_id, year)
) ;

-- 10. PayrollRecord
CREATE TABLE PayrollRecord (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    payroll_period VARCHAR(191) NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    base_salary DOUBLE NOT NULL,
    grade_allowance DOUBLE DEFAULT 0,
    transport_allowance DOUBLE DEFAULT 0,
    housing_allowance DOUBLE DEFAULT 0,
    seniority_bonus DOUBLE DEFAULT 0,
    performance_bonus DOUBLE DEFAULT 0,
    overtime_pay DOUBLE DEFAULT 0,
    other_allowances DOUBLE DEFAULT 0,
    gross_salary DOUBLE NOT NULL,
    social_security DOUBLE NOT NULL DEFAULT 0,
    income_tax DOUBLE NOT NULL DEFAULT 0,
    health_insurance DOUBLE DEFAULT 0,
    pension_contribution DOUBLE DEFAULT 0,
    loan_deduction DOUBLE DEFAULT 0,
    other_deductions DOUBLE DEFAULT 0,
    total_deductions DOUBLE NOT NULL DEFAULT 0,
    net_salary DOUBLE NOT NULL,
    worked_days INT(11) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    absent_days INT(11) DEFAULT 0,
    status VARCHAR(191) NOT NULL DEFAULT 'pending',
    payment_date DATE DEFAULT NULL,
    payment_method VARCHAR(100) DEFAULT NULL,
    payment_reference VARCHAR(191) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 11. PerformanceReview
CREATE TABLE PerformanceReview (
    id INT(11) NOT NULL AUTO_INCREMENT,
    employee_id INT(11) NOT NULL,
    reviewer_id INT(11) NOT NULL,
    review_period VARCHAR(191) NOT NULL,
    review_date DATE NOT NULL,
    technical_skills INT(11) DEFAULT NULL,
    soft_skills INT(11) DEFAULT NULL,
    productivity INT(11) DEFAULT NULL,
    teamwork INT(11) DEFAULT NULL,
    leadership INT(11) DEFAULT NULL,
    innovation INT(11) DEFAULT NULL,
    overall_rating DECIMAL(3,2) DEFAULT NULL,
    strengths TEXT DEFAULT NULL,
    areas_for_improvement TEXT DEFAULT NULL,
    achievements TEXT DEFAULT NULL,
    goals_next_period TEXT DEFAULT NULL,
    reviewer_comments TEXT DEFAULT NULL,
    employee_comments TEXT DEFAULT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'draft',
    employee_signed_at DATETIME(3) DEFAULT NULL,
    reviewer_signed_at DATETIME(3) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 12. Training
CREATE TABLE Training (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(191) NOT NULL,
    title_ar VARCHAR(191) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    instructor VARCHAR(191) DEFAULT NULL,
    provider VARCHAR(191) DEFAULT NULL,
    location VARCHAR(191) DEFAULT 'Online',
    type VARCHAR(191) DEFAULT 'General',
    category VARCHAR(100) DEFAULT NULL,
    level VARCHAR(50) DEFAULT NULL,
    start_date DATETIME(3) NOT NULL,
    end_date DATETIME(3) NOT NULL,
    duration_hours INT(11) DEFAULT NULL,
    max_participants INT(11) DEFAULT NULL,
    cost DOUBLE DEFAULT NULL,
    currency VARCHAR(20) DEFAULT 'MRU',
    status VARCHAR(191) NOT NULL DEFAULT 'planned',
    certificate_provided TINYINT(1) DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 13. TrainingEnrollment
CREATE TABLE TrainingEnrollment (
    id INT(11) NOT NULL AUTO_INCREMENT,
    training_id INT(11) NOT NULL,
    employee_id INT(11) NOT NULL,
    enrollment_date DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    status VARCHAR(191) NOT NULL DEFAULT 'enrolled',
    attendance_percentage DECIMAL(5,2) DEFAULT NULL,
    completion_status VARCHAR(191) NOT NULL DEFAULT 'not_started',
    final_score DECIMAL(5,2) DEFAULT NULL,
    certificate_issued TINYINT(1) DEFAULT 0,
    certificate_url VARCHAR(191) DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY unique_training_employee (training_id, employee_id)
) ;

-- 14. JobOffer
CREATE TABLE JobOffer (
    id INT(11) NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(191) NOT NULL,
    department_id INT(11) DEFAULT NULL,
    grade_id INT(11) DEFAULT NULL,
    location VARCHAR(191) NOT NULL DEFAULT 'Nouakchott',
    type VARCHAR(191) NOT NULL,
    contract_duration VARCHAR(100) DEFAULT NULL,
    description TEXT NOT NULL,
    requirements TEXT DEFAULT NULL,
    responsibilities TEXT DEFAULT NULL,
    salary_range_min DOUBLE DEFAULT NULL,
    salary_range_max DOUBLE DEFAULT NULL,
    benefits TEXT DEFAULT NULL,
    application_deadline DATE DEFAULT NULL,
    positions_available INT(11) DEFAULT 1,
    status VARCHAR(191) NOT NULL DEFAULT 'open',
    posted_by INT(11) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 15. Candidate
CREATE TABLE Candidate (
    id INT(11) NOT NULL AUTO_INCREMENT,
    job_offer_id INT(11) NOT NULL,
    first_name VARCHAR(191) NOT NULL,
    last_name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(191) NOT NULL,
    date_of_birth DATE DEFAULT NULL,
    nationality VARCHAR(100) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    education_level VARCHAR(100) DEFAULT NULL,
    years_of_experience INT(11) DEFAULT NULL,
    cv_url VARCHAR(191) DEFAULT NULL,
    cover_letter TEXT DEFAULT NULL,
    linkedin_url VARCHAR(191) DEFAULT NULL,
    portfolio_url VARCHAR(191) DEFAULT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'new',
    current_stage VARCHAR(100) DEFAULT 'application_received',
    overall_score DECIMAL(5,2) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    interview_date DATETIME(3) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 16. Announcement
CREATE TABLE Announcement (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(191) NOT NULL,
    title_ar VARCHAR(191) DEFAULT NULL,
    content TEXT NOT NULL,
    content_ar TEXT DEFAULT NULL,
    author_id INT(11) DEFAULT NULL,
    target_audience VARCHAR(100) DEFAULT 'all',
    department_id INT(11) DEFAULT NULL,
    is_pinned TINYINT(1) NOT NULL DEFAULT 0,
    priority VARCHAR(50) DEFAULT 'normal',
    expires_at DATETIME(3) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 17. CompanySettings
CREATE TABLE CompanySettings (
    id INT(11) NOT NULL AUTO_INCREMENT,
    company_name VARCHAR(191) NOT NULL DEFAULT 'Ma Société',
    company_name_ar VARCHAR(191) DEFAULT NULL,
    logo_url VARCHAR(191) DEFAULT NULL,
    timezone VARCHAR(191) NOT NULL DEFAULT 'Africa/Nouakchott',
    language VARCHAR(191) NOT NULL DEFAULT 'fr',
    currency VARCHAR(191) NOT NULL DEFAULT 'MRU',
    cnss_rate DOUBLE NOT NULL DEFAULT 0.08,
    its_rate DOUBLE NOT NULL DEFAULT 0.15,
    leave_rules JSON DEFAULT NULL,
    working_hours_per_day DECIMAL(4,2) DEFAULT 8.00,
    working_days_per_week INT(11) DEFAULT 5,
    overtime_rate DOUBLE DEFAULT 1.5,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- 18. Task
CREATE TABLE Task (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(191) NOT NULL,
    description TEXT DEFAULT NULL,
    assigned_to INT(11) DEFAULT NULL,
    assigned_by INT(11) DEFAULT NULL,
    department_id INT(11) DEFAULT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(191) NOT NULL DEFAULT 'todo',
    due_date DATE DEFAULT NULL,
    completed_at DATETIME(3) DEFAULT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id)
) ;

-- ============================================
-- FOREIGN KEYS
-- ============================================

-- Employee
ALTER TABLE Employee
    ADD CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_employee_grade FOREIGN KEY (grade_id) REFERENCES Grade(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES Department(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_employee_manager FOREIGN KEY (manager_id) REFERENCES Employee(id) ON DELETE SET NULL;

-- Department
ALTER TABLE Department
    ADD CONSTRAINT fk_department_manager FOREIGN KEY (manager_id) REFERENCES Employee(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id) REFERENCES Department(id) ON DELETE SET NULL;

-- GradeHistory
ALTER TABLE GradeHistory
    ADD CONSTRAINT fk_grade_history_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_grade_history_old_grade FOREIGN KEY (old_grade_id) REFERENCES Grade(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_grade_history_new_grade FOREIGN KEY (new_grade_id) REFERENCES Grade(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_grade_history_approver FOREIGN KEY (approved_by) REFERENCES Employee(id) ON DELETE SET NULL;

-- Attendance
ALTER TABLE Attendance
    ADD CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE;

-- LeaveRequest
ALTER TABLE LeaveRequest
    ADD CONSTRAINT fk_leave_request_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_leave_request_type FOREIGN KEY (leave_type_id) REFERENCES LeaveType(id) ON DELETE RESTRICT,
    ADD CONSTRAINT fk_leave_request_approver FOREIGN KEY (approved_by) REFERENCES Employee(id) ON DELETE SET NULL;

-- LeaveBalance
ALTER TABLE LeaveBalance
    ADD CONSTRAINT fk_leave_balance_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_leave_balance_type FOREIGN KEY (leave_type_id) REFERENCES LeaveType(id) ON DELETE CASCADE;

-- PayrollRecord
ALTER TABLE PayrollRecord
    ADD CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE;

-- PerformanceReview
ALTER TABLE PerformanceReview
    ADD CONSTRAINT fk_performance_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_performance_reviewer FOREIGN KEY (reviewer_id) REFERENCES Employee(id) ON DELETE CASCADE;

-- TrainingEnrollment
ALTER TABLE TrainingEnrollment
    ADD CONSTRAINT fk_enrollment_training FOREIGN KEY (training_id) REFERENCES Training(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_enrollment_employee FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE;

-- JobOffer
ALTER TABLE JobOffer
    ADD CONSTRAINT fk_joboffer_department FOREIGN KEY (department_id) REFERENCES Department(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_joboffer_grade FOREIGN KEY (grade_id) REFERENCES Grade(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_joboffer_author FOREIGN KEY (posted_by) REFERENCES Employee(id) ON DELETE SET NULL;

-- Candidate
ALTER TABLE Candidate
    ADD CONSTRAINT fk_candidate_joboffer FOREIGN KEY (job_offer_id) REFERENCES JobOffer(id) ON DELETE CASCADE;

-- Announcement
ALTER TABLE Announcement
    ADD CONSTRAINT fk_announcement_author FOREIGN KEY (author_id) REFERENCES Employee(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_announcement_department FOREIGN KEY (department_id) REFERENCES Department(id) ON DELETE SET NULL;

-- Task
ALTER TABLE Task
    ADD CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to) REFERENCES Employee(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_task_assigned_by FOREIGN KEY (assigned_by) REFERENCES Employee(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_task_department FOREIGN KEY (department_id) REFERENCES Department(id) ON DELETE SET NULL;

-- ============================================
-- SEED DATA (EXEMPLES)
-- ============================================

INSERT INTO Grade (code, name, name_ar, level, category, min_salary, max_salary, description, benefits) VALUES

('GRD-A1', 'Grade A1 - Débutant', 'الدرجة أ1', 1, 'Opérationnel', 15000, 25000, 'Grade d\'entrée', '{"prime_transport": 2000}'),
('GRD-C2', 'Grade C2 - Manager', 'الدرجة ج2', 6, 'Cadre', 120000, 180000, 'Grade pour managers', '{"prime_transport": 8000, "voiture_fonction": true}');

INSERT INTO LeaveType (code, name, name_ar, description, max_days_per_year, is_paid, color) VALUES
('ANNUAL', 'Congé Annuel', 'إجازة سنوية', 'Congé annuel payé', 30, 1, '#4CAF50'),
('SICK', 'Congé Maladie', 'إجازة مرضية', 'Congé pour raison de santé', 15, 1, '#FF9800');

COMMIT;
