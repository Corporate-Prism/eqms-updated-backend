import { Designation } from '../models/designation.model.js';

export const designationRepository = {
  findByName: (name, excludeId) => {
    const filter = { name: new RegExp(`^${name}$`, 'i') };
    if (excludeId) filter._id = { $ne: excludeId };
    return Designation.findOne(filter);
  },

  create: (designationData) => Designation.create(designationData),

  findById: (id) => Designation.findById(id),

  findAll: async ({ page, limit, search, sortBy, sortOrder }) => {
    const filter = {};
    if (search) filter.name = new RegExp(search, 'i');

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [designations, total] = await Promise.all([
      Designation.find(filter).sort(sort).skip(skip).limit(limit),
      Designation.countDocuments(filter)
    ]);

    return { designations, total };
  },

  updateById: (id, updateData) =>
    Designation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
};