import mongoose from 'mongoose';

const { Schema } = mongoose;
const Mixed = Schema.Types.Mixed;

const TrainingCourseSchema = new Schema(
  {
    _id: { type: String },
    courseNo: { type: String, required: true },
    title: { type: String, required: true },
    category: String,
    courseType: String,
    trainingType: String,
    departmentId: String,
    relatedSOP: String,
    requiresEffectivenessCheck: Boolean,
    effectivenessMethod: String,
    passingScore: String,
    frequencyMonths: String,
    status: { type: String, enum: ['draft', 'active'], default: 'draft' },
    quizQuestions: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

const TrainingNeedSchema = new Schema(
  {
    _id: { type: String },
    tnaNo: { type: String, required: true },
    title: { type: String, required: true },
    basis: String,
    role: String,
    departmentIds: Mixed,
    individualNames: Mixed,
    targetQuarter: String,
    courseId: String,
    courseTitle: String,
    justification: String,
    status: { type: String, enum: ['draft', 'pending_approval', 'approved'], default: 'draft' },
    requestedBy: String,
    approvedBy: String,
    approveDate: String,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

const TrainingRecordSchema = new Schema(
  {
    _id: { type: String },
    trnNo: { type: String, required: true },
    courseId: String,
    courseTitle: String,
    departmentId: String,
    sessionDate: String,
    trainer: String,
    status: { type: String, enum: ['scheduled', 'in_progress', 'pending_review', 'pending_approval', 'closed'], default: 'scheduled' },
    trainees: Mixed,
    timeline: Mixed,
  },
  { versionKey: false, minimize: false }
);

export const TrainingCourse = mongoose.model('TrainingCourse', TrainingCourseSchema);
export const TrainingNeed = mongoose.model('TrainingNeed', TrainingNeedSchema);
export const TrainingRecord = mongoose.model('TrainingRecord', TrainingRecordSchema);
