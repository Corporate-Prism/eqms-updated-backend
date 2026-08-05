import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true }
  },
  { timestamps: true }
);

export const Designation = mongoose.model('Designation', designationSchema);