// Quality Risk Management seed data.
// status: open (assessment in progress) -> control (reduction actions defined) -> accepted

export const qrmRecords = [
  {
    id: 'qrm1',
    riskNo: 'QRM-2026-0001',
    title: 'Risk assessment — Blend uniformity sampling technique',
    tool: 'FMEA',
    linkedDevNo: 'DEV-2026-0001',
    departmentId: 'd3',
    initiatedBy: 'Vikram Singh',
    status: 'accepted',
    team: [
      { name: 'Vikram Singh', role: 'Chair' },
      { name: 'Kavya Iyer', role: 'Subject Matter Expert' },
      { name: 'Meera Joshi', role: 'Quality' },
    ],
    hazards: [
      { id: 'h1', step: 'Blend sampling', desc: 'Inconsistent thief-probe insertion depth', cause: 'Operator technique variability', effect: 'Non-representative uniformity result', sev: 3, prob: 3, det: 2, notes: 'Detected via IPC trending' },
    ],
    reductionActions: [
      { id: 'ra1', action: 'Retrain sampling personnel on thief-probe technique', owner: 'Meera Joshi', targetDate: '2026-06-20', status: 'Closed' },
    ],
    reviewHistory: [
      { action: 'Risk reduction action defined', by: 'Rahul Verma', role: 'Creator', at: '2026-06-10T09:00:00', comment: '', meaning: 'Risk control planned' },
    ],
    timeline: [
      { action: 'Risk assessment initiated', by: 'Vikram Singh', role: 'Approver', at: '2026-06-05T09:00:00', comment: '', meaning: 'Assessment opened' },
      { action: 'Risk accepted', by: 'Vikram Singh', role: 'Approver', at: '2026-06-22T10:00:00', comment: '', meaning: 'Accepted' },
    ],
  },
  {
    id: 'qrm2',
    riskNo: 'QRM-2026-0002',
    title: 'Risk assessment — HPLC column oven temperature excursion impact',
    tool: 'FMEA',
    linkedDevNo: 'DEV-2026-0002',
    departmentId: 'd2',
    initiatedBy: 'Vikram Singh',
    status: 'open',
    team: [
      { name: 'Vikram Singh', role: 'Chair' },
      { name: 'Priya Nair', role: 'Subject Matter Expert' },
    ],
    hazards: [
      { id: 'h1', step: 'Overnight assay run', desc: 'Column oven temperature drift beyond validated range', cause: 'Column heater intermittent fault', effect: 'Potential impact on assay accuracy', sev: 4, prob: 2, det: 3, notes: '' },
    ],
    reductionActions: [],
    reviewHistory: [],
    timeline: [
      { action: 'Risk assessment initiated', by: 'Vikram Singh', role: 'Approver', at: '2026-07-11T10:00:00', comment: '', meaning: 'Assessment opened' },
    ],
  },
  {
    id: 'qrm3',
    riskNo: 'QRM-2026-0003',
    title: 'Supplier risk assessment — new API sub-supplier',
    tool: 'Risk Matrix',
    linkedDevNo: '',
    departmentId: 'd1',
    initiatedBy: 'Anita Sharma',
    status: 'control',
    team: [
      { name: 'Anita Sharma', role: 'Chair' },
      { name: 'Vikram Singh', role: 'Quality' },
    ],
    hazards: [
      { id: 'h1', step: 'Incoming raw material', desc: 'Limited audit history for newly qualified sub-supplier', cause: 'First-time onboarding', effect: 'Unverified quality system maturity', sev: 3, prob: 3, det: 3, notes: '' },
    ],
    reductionActions: [
      { id: 'ra1', action: 'Conduct on-site audit within 6 months of first delivery', owner: 'Anita Sharma', targetDate: '2026-12-01', status: 'Open' },
    ],
    reviewHistory: [],
    timeline: [
      { action: 'Risk assessment initiated', by: 'Anita Sharma', role: 'Master Admin', at: '2026-07-01T09:00:00', comment: '', meaning: 'Assessment opened' },
      { action: 'Risk reduction action defined', by: 'Anita Sharma', role: 'Master Admin', at: '2026-07-05T09:00:00', comment: '', meaning: 'Risk control planned' },
    ],
  },
];
