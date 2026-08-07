import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, uppercase: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    subDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubDepartment', required: true }
  },
  { timestamps: true }
);

// name must be unique within a given department
locationSchema.index({ name: 1, subDepartmentId: 1 }, { unique: true });

export const Location = mongoose.model('Location', locationSchema);