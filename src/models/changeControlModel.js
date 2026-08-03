import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const ChangeControlSchema = new Schema(
  {
    _id: { type: String },
    ccNo: { type: String, required: true },
    title: { type: String, required: true },
    category: String,
    departmentId: String,
    initiatedBy: String,
    reasonForChange: String,
    status: {
      type: String,
      enum: ['draft', 'in_review', 'assessment', 'ack', 'pending_approver2', 'implemented', 'effectiveness_check', 'closed'],
      default: 'draft',
    },
    returnComment: String,
    impactAssessment: Mixed,
    evalTeam: Mixed,
    ackBy: Mixed,
    implementationTasks: Mixed,
    linkedDeviations: Mixed,
    linkedCapas: Mixed,
    effectivenessCheck: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export default mongoose.model('ChangeControl', ChangeControlSchema);
