import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

// `sections`, `timeline`, parallel-workflow name lists and `printCopies` are
// variable-shape nested structures — stored as Mixed rather than fully typed
// sub-schemas, which is idiomatic for MongoDB and keeps this fast to extend.
const DocumentSchema = new Schema(
  {
    _id: { type: String },
    docNo: { type: String, required: true },
    version: String,
    type: String,
    title: { type: String, required: true },
    departmentId: String,
    workflowType: { type: String, enum: ['series', 'parallel'], default: 'series' },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'parallel_review', 'in_approval', 'in_approval_2', 'publication', 'effective', 'superseded'],
      default: 'draft',
    },
    author: String,
    sections: Mixed,
    effectiveDate: String,
    reviewDueDate: String,
    rejectionComment: String,
    parallelReviewerNames: Mixed,
    parallelApproverNames: Mixed,
    parallelAckNames: Mixed,
    parallelDecisions: Mixed,
    printCopies: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export default mongoose.model('Document', DocumentSchema);
