import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    mobile: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['Creator', 'Reviewer', 'Approver', 'Approver 2', 'Master Admin', 'Member', 'Trainer', 'Trainee'],
      required: true
    },
    designationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation', required: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    subDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubDepartment', required: true },
    password: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: ['active', 'inActive', 'suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model('User', userSchema);