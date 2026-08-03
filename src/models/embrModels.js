import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const EmbrTemplateSchema = new Schema(
  {
    _id: { type: String },
    templateNo: { type: String, required: true },
    recordType: { type: String, enum: ['BMR', 'BPR'], default: 'BMR' },
    productId: String,
    dosageForm: String,
    strength: String,
    batchSizeStd: String,
    batchSizeUom: String,
    departmentId: String,
    status: { type: String, enum: ['draft', 'in_review', 'pending_qa', 'active'], default: 'draft' },
    version: String,
    createdBy: String,
    createdAt: String,
    equipmentIds: Mixed,
    materials: Mixed,
    packagingMaterials: Mixed,
    steps: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

const EmbrRecordSchema = new Schema(
  {
    _id: { type: String },
    recordNo: { type: String, required: true },
    templateId: String,
    recordType: { type: String, enum: ['BMR', 'BPR'], default: 'BMR' },
    productName: String,
    productCode: String,
    batchNo: String,
    batchSizeStd: String,
    batchSizeUom: String,
    mfgDate: String,
    departmentId: String,
    status: { type: String, enum: ['in_process', 'in_review', 'pending_release', 'released'], default: 'in_process' },
    equipment: Mixed,
    reviewChecklist: Mixed,
    materials: Mixed,
    packagingMaterials: Mixed,
    steps: Mixed,
    yieldStages: Mixed,
    finalYield: Mixed,
    linkedDeviations: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

const EmbrRequestSchema = new Schema(
  {
    _id: { type: String },
    requestNo: { type: String, required: true },
    productId: String,
    templateId: String,
    plannedMfgDate: String,
    status: { type: String, enum: ['pending', 'acknowledged', 'released'], default: 'pending' },
    batchNo: String,
    ackDepartments: Mixed,
    ackReceived: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export const EmbrTemplate = mongoose.model('EmbrTemplate', EmbrTemplateSchema);
export const EmbrRecord = mongoose.model('EmbrRecord', EmbrRecordSchema);
export const EmbrRequest = mongoose.model('EmbrRequest', EmbrRequestSchema);
