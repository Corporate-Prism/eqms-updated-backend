import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const DeviationSchema = new Schema(
  {
    _id: { type: String },
    devNo: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    dateOfDeviation: String,
    departmentId: String,
    devType: String,
    gmpType: String,
    subjectType: String,
    originator: String,
    product: Mixed,
    equipment: Mixed,
    classification: { type: String, enum: ['', 'Minor', 'Major', 'Critical'], default: '' },
    caseType: { type: String, enum: ['', 'Event', 'QAR'], default: '' },
    status: {
      type: String,
      enum: ['draft', 'hod_review', 'qa_scope', 'qa_classify', 'investigation', 'team_ack', 'closure_review', 'pending_closure', 'closed'],
      default: 'draft',
    },
    returnComment: String,
    scope: Mixed,
    inv: Mixed,
    capas: Mixed,
    investigationTeam: Mixed,
    investigationTeamType: String,
    investigationTeamDetail: Mixed,
    acks: Mixed,
    closedAt: String,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export default mongoose.model('Deviation', DeviationSchema);
