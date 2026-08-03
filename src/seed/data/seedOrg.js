// Organization hierarchy + access-control seed data.
// Field shapes mirror the source dashboard's seed() so the generic Hierarchy
// CRUD screens (see features/hierarchy) line up with real-looking records.

export const cities = [
  { id: 'c1', name: 'Mumbai', createdAt: '2026-01-08' },
  { id: 'c2', name: 'Pune', createdAt: '2026-01-09' },
  { id: 'c3', name: 'Ahmedabad', createdAt: '2026-01-11' },
  { id: 'c4', name: 'Hyderabad', createdAt: '2026-01-15' },
];

export const plants = [
  { id: 'p1', cityId: 'c1', name: 'Mumbai API Plant', code: 'MUM-API', createdAt: '2026-01-10' },
  { id: 'p2', cityId: 'c1', name: 'Mumbai OSD Plant', code: 'MUM-OSD', createdAt: '2026-01-10' },
  { id: 'p3', cityId: 'c2', name: 'Pune Biotech Plant', code: 'PUN-BIO', createdAt: '2026-01-12' },
  { id: 'p4', cityId: 'c3', name: 'Ahmedabad Formulation', code: 'AHM-FRM', createdAt: '2026-01-13' },
  { id: 'p5', cityId: 'c4', name: 'Hyderabad Sterile Plant', code: 'HYD-STR', createdAt: '2026-01-16' },
];

export const departments = [
  { id: 'd1', cityId: 'c1', plantId: 'p1', name: 'Quality Assurance', code: 'QA' },
  { id: 'd2', cityId: 'c1', plantId: 'p1', name: 'Quality Control', code: 'QC' },
  { id: 'd3', cityId: 'c1', plantId: 'p2', name: 'Production', code: 'PRD' },
  { id: 'd4', cityId: 'c2', plantId: 'p3', name: 'Microbiology', code: 'MICRO' },
  { id: 'd5', cityId: 'c3', plantId: 'p4', name: 'Warehouse', code: 'WH' },
  { id: 'd6', cityId: 'c4', plantId: 'p5', name: 'Quality Assurance', code: 'QA-HYD' },
];

export const subDepartments = [
  { id: 's1', cityId: 'c1', plantId: 'p1', departmentId: 'd1', name: 'QA Documentation', code: 'QA-DOC' },
  { id: 's2', cityId: 'c1', plantId: 'p1', departmentId: 'd2', name: 'Wet Chemistry Lab', code: 'QC-WET' },
  { id: 's3', cityId: 'c1', plantId: 'p2', departmentId: 'd3', name: 'Granulation', code: 'PRD-GRN' },
  { id: 's4', cityId: 'c2', plantId: 'p3', departmentId: 'd4', name: 'Sterility Testing', code: 'MIC-ST' },
];

export const locations = [
  { id: 'l1', cityId: 'c1', plantId: 'p1', departmentId: 'd1', subDepartmentId: 's1', name: 'Document Control Cell', code: 'LOC-DOC-01' },
  { id: 'l2', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', name: 'Instrument Room A', code: 'LOC-INS-02' },
  { id: 'l3', cityId: 'c1', plantId: 'p2', departmentId: 'd3', subDepartmentId: 's3', name: 'Granulation Area', code: 'LOC-GRN-03' },
];

export const roles = [
  { id: 'r1', name: 'Creator', description: 'Initiates and drafts records' },
  { id: 'r2', name: 'Reviewer', description: 'Reviews drafted records' },
  { id: 'r3', name: 'Approver', description: 'First-level approval authority' },
  { id: 'r4', name: 'Approver 2', description: 'Second-level / final approval' },
  { id: 'r5', name: 'Master Admin', description: 'Full system administration' },
  { id: 'r6', name: 'Member', description: 'Read & participate in assigned tasks' },
  { id: 'r7', name: 'Trainer', description: 'Conducts and evaluates training sessions' },
  { id: 'r8', name: 'Trainee', description: 'Completes assigned training' },
];

export const users = [
  { id: 'u1', firstName: 'Anita', lastName: 'Sharma', employeeId: 'EMP-1001', mobile: '9820011223', role: 'Master Admin', designation: 'Sr. Manager', cityId: 'c1', plantId: 'p1', departmentId: 'd1', subDepartmentId: 's1', password: 'Welcome@123', status: 'active', createdAt: '2026-01-10' },
  { id: 'u2', firstName: 'Rahul', lastName: 'Verma', employeeId: 'EMP-1002', mobile: '9820022114', role: 'Creator', designation: 'Executive', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', password: 'Welcome@123', status: 'active', createdAt: '2026-01-12' },
  { id: 'u3', firstName: 'Priya', lastName: 'Nair', employeeId: 'EMP-1003', mobile: '9820033225', role: 'Reviewer', designation: 'Sr. Executive', cityId: 'c1', plantId: 'p2', departmentId: 'd3', subDepartmentId: 's3', password: 'Welcome@123', status: 'active', createdAt: '2026-01-14' },
  { id: 'u4', firstName: 'Vikram', lastName: 'Singh', employeeId: 'EMP-1004', mobile: '9820044336', role: 'Approver', designation: 'Manager', cityId: 'c2', plantId: 'p3', departmentId: 'd4', subDepartmentId: 's4', password: 'Welcome@123', status: 'active', createdAt: '2026-01-15' },
  { id: 'u5', firstName: 'Sneha', lastName: 'Patel', employeeId: 'EMP-1005', mobile: '9820055447', role: 'Approver 2', designation: 'Asst. Manager', cityId: 'c3', plantId: 'p4', departmentId: 'd5', subDepartmentId: '', password: 'Welcome@123', status: 'inactive', createdAt: '2026-01-17' },
  { id: 'u6', firstName: 'Arjun', lastName: 'Mehta', employeeId: 'EMP-1006', mobile: '9820066558', role: 'Member', designation: 'Officer', cityId: 'c4', plantId: 'p5', departmentId: 'd6', subDepartmentId: '', password: 'Welcome@123', status: 'active', createdAt: '2026-01-18' },
  { id: 'u7', firstName: 'Kavya', lastName: 'Iyer', employeeId: 'EMP-1007', mobile: '9820077669', role: 'Creator', designation: 'Analyst', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', password: 'Welcome@123', status: 'active', createdAt: '2026-01-19' },
  { id: 'u8', firstName: 'Rohan', lastName: 'Das', employeeId: 'EMP-1008', mobile: '9820088770', role: 'Reviewer', designation: 'Sr. Analyst', cityId: 'c2', plantId: 'p3', departmentId: 'd4', subDepartmentId: 's4', password: 'Welcome@123', status: 'inactive', createdAt: '2026-01-20' },
  { id: 'u9', firstName: 'Meera', lastName: 'Joshi', employeeId: 'EMP-1009', mobile: '9820099881', role: 'Reviewer', designation: 'Head', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', password: 'Welcome@123', status: 'active', createdAt: '2026-01-21' },
  { id: 'u10', firstName: 'Sanjay', lastName: 'Kulkarni', employeeId: 'EMP-1010', mobile: '9820010102', role: 'Member', designation: 'Sr. Executive', cityId: 'c1', plantId: 'p1', departmentId: 'd1', subDepartmentId: 's1', password: 'Welcome@123', status: 'active', createdAt: '2026-01-22' },
  { id: 'u11', firstName: 'Deepak', lastName: 'Rao', employeeId: 'EMP-1011', mobile: '9820011234', role: 'Trainer', designation: 'Sr. Executive', cityId: 'c1', plantId: 'p1', departmentId: 'd1', subDepartmentId: 's1', password: 'Welcome@123', status: 'active', createdAt: '2026-01-25' },
  { id: 'u12', firstName: 'Neha', lastName: 'Kapoor', employeeId: 'EMP-1012', mobile: '9820012345', role: 'Trainee', designation: 'Officer', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', password: 'Welcome@123', status: 'active', createdAt: '2026-01-26' },
];

export const equipment = [
  { id: 'e1', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', locationId: 'l2', name: 'HPLC System', code: 'EQ-HPLC-01', category: 'Analytical Instrument', assetNo: 'AST-1001', manufacturer: 'Agilent Technologies', serialNo: 'SN-AG-55231', relatedSOP: 'SOP-QC-014', relatedWI: 'WI-QC-021', calibrationDueDate: '2026-08-15', qualificationStatus: 'Qualified', cleaningStatus: 'Clean' },
  { id: 'e2', cityId: 'c1', plantId: 'p1', departmentId: 'd2', subDepartmentId: 's2', locationId: 'l2', name: 'UV-Vis Spectrophotometer', code: 'EQ-UV-02', category: 'Analytical Instrument', assetNo: 'AST-1002', manufacturer: 'Shimadzu', serialNo: 'SN-SH-88114', relatedSOP: 'SOP-QC-009', relatedWI: 'WI-QC-016', calibrationDueDate: '2026-08-05', qualificationStatus: 'Qualified', cleaningStatus: 'Clean' },
  { id: 'e3', cityId: 'c1', plantId: 'p1', departmentId: 'd3', subDepartmentId: 's3', locationId: 'l3', name: 'Octagonal Blender', code: 'EQ-BLD-01', category: 'Blender', assetNo: 'AST-1003', manufacturer: 'ACG Pharma', serialNo: 'SN-ACG-2201', relatedSOP: 'SOP-PRD-014', relatedWI: 'WI-PRD-021', calibrationDueDate: '2026-09-01', qualificationStatus: 'Qualified', cleaningStatus: 'Clean' },
  { id: 'e4', cityId: 'c1', plantId: 'p1', departmentId: 'd3', subDepartmentId: 's3', locationId: 'l3', name: 'Rotary Tablet Press', code: 'EQ-RTP-01', category: 'Compression', assetNo: 'AST-1004', manufacturer: 'Cadmach', serialNo: 'SN-CAD-3301', relatedSOP: 'SOP-PRD-022', relatedWI: 'WI-PRD-030', calibrationDueDate: '2026-07-10', qualificationStatus: 'Qualified', cleaningStatus: 'Clean' },
];

export const questions = [
  { id: 'q1', text: 'Was the equipment cleaned and status labelled prior to use?', category: 'GMP', answerType: 'Yes/No' },
  { id: 'q2', text: 'Is the SOP for this operation the current effective version?', category: 'Documentation', answerType: 'Yes/No' },
  { id: 'q3', text: 'Rate your confidence in performing this operation unsupervised.', category: 'Training', answerType: 'Rating' },
];

export const deviationCategories = [
  { id: 'dc1', name: 'Process Deviation', createdAt: '2026-01-10' },
  { id: 'dc2', name: 'Equipment Malfunction', createdAt: '2026-01-10' },
  { id: 'dc3', name: 'Documentation Error', createdAt: '2026-01-11' },
  { id: 'dc4', name: 'Environmental Excursion', createdAt: '2026-01-12' },
];

export const changeControlCategories = [
  { id: 'cc1', name: 'Process Change', createdAt: '2026-01-10' },
  { id: 'cc2', name: 'Equipment Change', createdAt: '2026-01-10' },
  { id: 'cc3', name: 'Document Change', createdAt: '2026-01-11' },
  { id: 'cc4', name: 'Facility Change', createdAt: '2026-01-12' },
];

export const products = [
  { id: 'pr1', name: 'Paracetamol Tablets 500 mg', code: 'FG-PARA-500', number: 'PRD-0001', createdAt: '2026-01-08' },
  { id: 'pr2', name: 'Amoxicillin Capsules 250 mg', code: 'FG-AMOX-250', number: 'PRD-0002', createdAt: '2026-01-08' },
  { id: 'pr3', name: 'Ibuprofen Suspension 100 mg/5 ml', code: 'FG-IBU-100', number: 'PRD-0003', createdAt: '2026-01-09' },
];
