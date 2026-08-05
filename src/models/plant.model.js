import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }
  },
  { timestamps: true }
);
plantSchema.index({ name: 1, cityId: 1 }, { unique: true });

export const Plant = mongoose.model('Plant', plantSchema);