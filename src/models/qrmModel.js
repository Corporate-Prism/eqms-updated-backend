import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const QrmRecordSchema = new Schema(
  {
    _id: { type: String },
    riskNo: { type: String, required: true },
    title: { type: String, required: true },
    tool: String,
    linkedDevNo: String,
    departmentId: String,
    initiatedBy: String,
    status: { type: String, enum: ['open', 'control', 'accepted'], default: 'open' },
    team: Mixed,
    hazards: Mixed,
    reductionActions: Mixed,
    reviewHistory: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export default mongoose.model('QrmRecord', QrmRecordSchema);
