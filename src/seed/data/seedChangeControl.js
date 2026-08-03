// Change Control seed data (ICH Q10 §3.2.3).
// status: draft -> in_review -> assessment -> ack -> pending_approver2 -> implemented -> effectiveness_check -> closed

export const changeControls = [
  {
    id: 'cc1',
    ccNo: 'CC-2026-0001',
    title: 'Update blend time from 15 to 18 minutes for Paracetamol Tablets 500mg',
    category: 'Process Change',
    departmentId: 'd3',
    initiatedBy: 'Kavya Iyer',
    reasonForChange: 'Trend analysis of blend uniformity results shows improved consistency with an extended blend time.',
    status: 'closed',
    impactAssessment: [
      { area: 'Marketing Authorisation / Design Space', answer: 'No', comment: 'Within registered range.' },
      { area: 'Validated status of process / equipment', answer: 'Yes', comment: 'Requires re-validation of blending step.' },
      { area: 'SOPs / controlled documents', answer: 'Yes', comment: 'WI-PRD-021 to be revised.' },
    ],
    evalTeam: [
      { name: 'Vikram Singh', role: 'Quality' },
      { name: 'Kavya Iyer', role: 'Production' },
    ],
    implementationTasks: [
      { id: 'it1', task: 'Revise WI-PRD-021 blend time', owner: 'Kavya Iyer', dueDate: '2026-06-25', status: 'Closed' },
      { id: 'it2', task: 'Execute 3-batch revalidation', owner: 'Vikram Singh', dueDate: '2026-07-15', status: 'Closed' },
    ],
    linkedDeviations: ['DEV-2026-0001'],
    linkedCapas: ['CAPA-2026-0001'],
    effectivenessCheck: { objectivesAchieved: 'Yes', deleteriousImpact: 'No', comment: 'Blend uniformity RSD improved across 3 confirmation batches.' },
    timeline: [
      { action: 'Change control raised', by: 'Kavya Iyer', role: 'Creator', at: '2026-06-15T09:00:00', comment: '', meaning: 'Raised' },
      { action: 'Submit for Review', by: 'Kavya Iyer', role: 'Creator', at: '2026-06-15T09:30:00', comment: '', meaning: 'Submitted for review' },
      { action: 'Approve Review & Forward for Assessment', by: 'Meera Joshi', role: 'Reviewer', at: '2026-06-16T10:00:00', comment: '', meaning: 'Reviewed' },
      { action: 'Send for Acknowledgement', by: 'Vikram Singh', role: 'Approver', at: '2026-06-20T09:00:00', comment: '', meaning: 'Assessment complete' },
      { action: 'Acknowledge', by: 'Kavya Iyer', role: 'Member', at: '2026-06-20T14:00:00', comment: '', meaning: 'Acknowledged' },
      { action: 'Forward to Approver 2', by: 'Vikram Singh', role: 'Approver', at: '2026-06-21T09:00:00', comment: '', meaning: 'Forwarded' },
      { action: 'Approve for Implementation', by: 'Sneha Patel', role: 'Approver 2', at: '2026-06-22T10:00:00', comment: '', meaning: 'Final approval' },
      { action: 'Effectiveness check recorded', by: 'Vikram Singh', role: 'Approver', at: '2026-07-20T09:00:00', comment: '', meaning: 'Effective — Closed' },
    ],
  },
  {
    id: 'cc2',
    ccNo: 'CC-2026-0002',
    title: 'Replace column brand for Amoxicillin Capsules assay method',
    category: 'Process Change',
    departmentId: 'd2',
    initiatedBy: 'Rahul Verma',
    reasonForChange: 'Current column manufacturer discontinued; equivalent column identified and bridging study proposed.',
    status: 'ack',
    impactAssessment: [
      { area: 'Validated status of process / equipment', answer: 'Yes', comment: 'Method verification required.' },
      { area: 'SOPs / controlled documents', answer: 'Yes', comment: 'TM-QC-009 to be revised.' },
    ],
    evalTeam: [
      { name: 'Priya Nair', role: 'Quality' },
      { name: 'Rahul Verma', role: 'QC' },
    ],
    implementationTasks: [
      { id: 'it1', task: 'Execute column bridging study', owner: 'Rahul Verma', dueDate: '2026-08-10', status: 'Open' },
    ],
    linkedDeviations: [],
    linkedCapas: [],
    timeline: [
      { action: 'Change control raised', by: 'Rahul Verma', role: 'Creator', at: '2026-07-05T09:00:00', comment: '', meaning: 'Raised' },
      { action: 'Submit for Review', by: 'Rahul Verma', role: 'Creator', at: '2026-07-05T09:30:00', comment: '', meaning: 'Submitted for review' },
      { action: 'Approve Review & Forward for Assessment', by: 'Meera Joshi', role: 'Reviewer', at: '2026-07-06T10:00:00', comment: '', meaning: 'Reviewed' },
      { action: 'Send for Acknowledgement', by: 'Vikram Singh', role: 'Approver', at: '2026-07-10T09:00:00', comment: '', meaning: 'Assessment complete' },
    ],
  },
  {
    id: 'cc3',
    ccNo: 'CC-2026-0003',
    title: 'Add secondary temperature logger to raw material warehouse',
    category: 'Facility Change',
    departmentId: 'd5',
    initiatedBy: 'Sneha Patel',
    reasonForChange: 'Improve redundancy following recent logger battery failure (DEV-2026-0004).',
    status: 'draft',
    impactAssessment: [],
    evalTeam: [],
    implementationTasks: [],
    linkedDeviations: ['DEV-2026-0004'],
    linkedCapas: [],
    timeline: [
      { action: 'Change control raised', by: 'Sneha Patel', role: 'Creator', at: '2026-07-29T09:00:00', comment: '', meaning: 'Raised' },
    ],
  },
];
