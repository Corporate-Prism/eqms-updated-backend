import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// All models use a caller-supplied string _id (e.g. 'c1', 'u7') rather than
// ObjectId, so records keep the exact same ids the React frontend already
// uses to cross-reference collections (city.id, plant.cityId, etc). This is
// the one non-default thing every schema below opts into.
const idField = { _id: { type: String } };

const CitySchema = new Schema({ ...idField, name: { type: String, required: true }, createdAt: String }, { versionKey: false });

const PlantSchema = new Schema(
  { ...idField, cityId: String, name: { type: String, required: true }, code: String, createdAt: String },
  { versionKey: false }
);

const DepartmentSchema = new Schema(
  { ...idField, cityId: String, plantId: String, name: { type: String, required: true }, code: String },
  { versionKey: false }
);

const SubDepartmentSchema = new Schema(
  { ...idField, cityId: String, plantId: String, departmentId: String, name: { type: String, required: true }, code: String },
  { versionKey: false }
);

const LocationSchema = new Schema(
  {
    ...idField,
    cityId: String,
    plantId: String,
    departmentId: String,
    subDepartmentId: String,
    name: { type: String, required: true },
    code: String,
  },
  { versionKey: false }
);

const RoleSchema = new Schema({ ...idField, name: { type: String, required: true }, description: String }, { versionKey: false });

const UserSchema = new Schema(
  {
    ...idField,
    firstName: String,
    lastName: String,
    employeeId: { type: String, required: true, unique: true },
    mobile: String,
    role: String,
    designation: String,
    cityId: String,
    plantId: String,
    departmentId: String,
    subDepartmentId: String,
    password: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: String,
  },
  { versionKey: false }
);

// ✅ FIX: removed 'next' parameter and next() call – async hooks must NOT use next()
UserSchema.pre('save', async function hashOnSave() {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// ✅ FIX: same fix for findOneAndUpdate
UserSchema.pre('findOneAndUpdate', async function hashOnUpdate() {
  const update = this.getUpdate() || {};
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
    this.setUpdate(update);
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password || '');
};

const EquipmentSchema = new Schema(
  {
    ...idField,
    cityId: String,
    plantId: String,
    departmentId: String,
    subDepartmentId: String,
    locationId: String,
    name: { type: String, required: true },
    code: String,
    category: String,
    assetNo: String,
    manufacturer: String,
    serialNo: String,
    relatedSOP: String,
    relatedWI: String,
    calibrationDueDate: String,
    qualificationStatus: String,
    cleaningStatus: String,
  },
  { versionKey: false }
);

const QuestionSchema = new Schema(
  { ...idField, text: { type: String, required: true }, category: String, answerType: String },
  { versionKey: false }
);

const DeviationCategorySchema = new Schema({ ...idField, name: { type: String, required: true }, createdAt: String }, { versionKey: false });
const ChangeControlCategorySchema = new Schema({ ...idField, name: { type: String, required: true }, createdAt: String }, { versionKey: false });

const ProductSchema = new Schema(
  { ...idField, name: { type: String, required: true }, code: String, number: String, createdAt: String },
  { versionKey: false }
);

export const City = mongoose.model('City', CitySchema);
export const Plant = mongoose.model('Plant', PlantSchema);
export const Department = mongoose.model('Department', DepartmentSchema);
export const SubDepartment = mongoose.model('SubDepartment', SubDepartmentSchema);
export const Location = mongoose.model('Location', LocationSchema);
export const Role = mongoose.model('Role', RoleSchema);
export const User = mongoose.model('User', UserSchema);
export const Equipment = mongoose.model('Equipment', EquipmentSchema);
export const Question = mongoose.model('Question', QuestionSchema);
export const DeviationCategory = mongoose.model('DeviationCategory', DeviationCategorySchema);
export const ChangeControlCategory = mongoose.model('ChangeControlCategory', ChangeControlCategorySchema);
export const Product = mongoose.model('Product', ProductSchema);