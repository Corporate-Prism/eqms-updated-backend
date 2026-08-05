import mongoose from 'mongoose';

const subDepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }
  },
  { timestamps: true }
);

// name must be unique within a given department
subDepartmentSchema.index({ name: 1, departmentId: 1 }, { unique: true });

export const SubDepartment = mongoose.model('SubDepartment', subDepartmentSchema);