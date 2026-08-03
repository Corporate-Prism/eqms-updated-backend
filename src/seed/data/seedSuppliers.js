// Supplier Management seed data (ICH Q10 §2.7).
// status: prospective -> under_qualification -> approved | disqualified

export const suppliers = [
  {
    id: 'sup1',
    supNo: 'SUP-2026-0001',
    name: 'Kemwell Fine Chemicals',
    materialCategory: 'API',
    country: 'India',
    status: 'approved',
    qualification: {
      methods: ['Documentation Review', 'On-site Audit'],
      lastAuditDate: '2026-02-15',
      nextAuditDue: '2028-02-15',
    },
    performanceReviews: [
      { id: 'pv1', date: '2026-06-30', reviewer: 'Anita Sharma', rating: 'Green', onTimeDelivery: '98%', qualityIssues: '0', comments: 'Consistent quality across all lots this half.' },
    ],
    approvedMaterials: [
      { id: 'am1', materialName: 'Paracetamol IP', materialCode: 'RM-PARA-01', specRef: 'SPEC-RM-045' },
    ],
  },
  {
    id: 'sup2',
    supNo: 'SUP-2026-0002',
    name: 'Sterling Excipients Ltd.',
    materialCategory: 'Excipient',
    country: 'India',
    status: 'approved',
    qualification: {
      methods: ['Documentation Review'],
      lastAuditDate: '2026-01-20',
      nextAuditDue: '2029-01-20',
    },
    performanceReviews: [
      { id: 'pv1', date: '2026-06-30', reviewer: 'Anita Sharma', rating: 'Amber', onTimeDelivery: '89%', qualityIssues: '1', comments: 'One delayed shipment; COA turnaround slightly slower than agreed.' },
    ],
    approvedMaterials: [
      { id: 'am1', materialName: 'Microcrystalline Cellulose PH102', materialCode: 'RM-MCC-102', specRef: '' },
      { id: 'am2', materialName: 'Magnesium Stearate', materialCode: 'RM-MGST-01', specRef: '' },
    ],
  },
  {
    id: 'sup3',
    supNo: 'SUP-2026-0003',
    name: 'Novapack Films Pvt. Ltd.',
    materialCategory: 'Packaging Material',
    country: 'India',
    status: 'under_qualification',
    qualification: {
      methods: ['Documentation Review'],
      lastAuditDate: '',
      nextAuditDue: '',
    },
    performanceReviews: [],
    approvedMaterials: [],
  },
  {
    id: 'sup4',
    supNo: 'SUP-2026-0004',
    name: 'Global API Sourcing Co.',
    materialCategory: 'API',
    country: 'China',
    status: 'prospective',
    qualification: { methods: [], lastAuditDate: '', nextAuditDue: '' },
    performanceReviews: [],
    approvedMaterials: [],
  },
];
