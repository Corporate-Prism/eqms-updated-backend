import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, uppercase: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true }
  },
  { timestamps: true }
);

// name must be unique within a given plant
departmentSchema.index({ name: 1, plantId: 1 }, { unique: true });

export const Department = mongoose.model('Department', departmentSchema);