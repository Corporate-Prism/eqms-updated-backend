import { City } from '../models/city.model.js';

export const cityRepository = {
  findByName: (name, excludeId) => {
    const filter = { name: new RegExp(`^${name}$`, 'i') };
    if (excludeId) filter._id = { $ne: excludeId };
    return City.findOne(filter);
  },

  create: (cityData) => City.create(cityData),

  findById: (id) => City.findById(id),

  findAll: async ({ filter, skip, limit, sort }) => {
    const [cities, total] = await Promise.all([
      City.find(filter).sort(sort).skip(skip).limit(limit),
      City.countDocuments(filter)
    ]);
    return { cities, total };
  },

  updateById: (id, updateData) =>
    City.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
};