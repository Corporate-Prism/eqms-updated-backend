import { Plant } from '../models/plant.model.js';

export const plantRepository = {
  findByCodeInCity: (code, cityId, excludeId) => {
    const filter = {
      code: code.toUpperCase(),
      cityId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Plant.findOne(filter);
  },

  findByNameInCity: (name, cityId, excludeId) => {
    const filter = {
      name: new RegExp(`^${name}$`, 'i'),
      cityId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Plant.findOne(filter);
  },

  create: (plantData) => Plant.create(plantData),

  findById: (id) => Plant.findById(id).populate('cityId'),

  findAll: async ({ page, limit, search, cityId, sortBy, sortOrder }) => {
    const filter = {};
    if (search) filter.name = new RegExp(search, 'i');
    if (cityId) filter.cityId = cityId;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [plants, total] = await Promise.all([
      Plant.find(filter).populate('cityId').sort(sort).skip(skip).limit(limit),
      Plant.countDocuments(filter)
    ]);

    return { plants, total };
  },

  updateById: (id, updateData) =>
    Plant.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('cityId')
};