import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const SupplierSchema = new Schema(
  {
    _id: { type: String },
    supNo: { type: String, required: true },
    name: { type: String, required: true },
    materialCategory: String,
    country: String,
    status: { type: String, enum: ['prospective', 'under_qualification', 'approved', 'disqualified'], default: 'prospective' },
    qualification: Mixed,
    performanceReviews: Mixed,
    approvedMaterials: Mixed,
  },
  { versionKey: false, minimize: false }
);

export default mongoose.model('Supplier', SupplierSchema);
