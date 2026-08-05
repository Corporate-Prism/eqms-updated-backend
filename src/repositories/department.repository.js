import { Department } from '../models/department.model.js';

const POPULATE_FIELDS = [
  { path: 'cityId', select: 'name' },
  { path: 'plantId', select: 'name' }
];

export const departmentRepository = {
  findByNameInPlant: (name, plantId, excludeId) => {
    const filter = {
      name: new RegExp(`^${name}$`, 'i'),
      plantId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Department.findOne(filter);
  },

  create: (departmentData) => Department.create(departmentData),

  findById: (id) => Department.findById(id).populate(POPULATE_FIELDS),

  findAll: async ({ page, limit, search, cityId, plantId, sortBy, sortOrder }) => {
    const filter = {};
    if (search) filter.name = new RegExp(search, 'i');
    if (cityId) filter.cityId = cityId;
    if (plantId) filter.plantId = plantId;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [departments, total] = await Promise.all([
      Department.find(filter).populate(POPULATE_FIELDS).sort(sort).skip(skip).limit(limit),
      Department.countDocuments(filter)
    ]);

    return { departments, total };
  },

  updateById: (id, updateData) =>
    Department.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(POPULATE_FIELDS)
};