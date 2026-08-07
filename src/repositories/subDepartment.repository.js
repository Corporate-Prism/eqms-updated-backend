import { SubDepartment } from '../models/subDepartment.model.js';

const POPULATE_FIELDS = [
  { path: 'cityId', select: 'name' },
  { path: 'plantId', select: 'name' },
  { path: 'departmentId', select: 'name' }
];

export const subDepartmentRepository = {
  findByCodeInDepartment: (code, departmentId, excludeId) => {
    const filter = {
      code: code.toUpperCase(),
      departmentId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return SubDepartment.findOne(filter);
  },

  findByNameInDepartment: (name, departmentId, excludeId) => {
    const filter = {
      name: new RegExp(`^${name}$`, 'i'),
      departmentId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return SubDepartment.findOne(filter);
  },

  create: (subDepartmentData) => SubDepartment.create(subDepartmentData),

  findById: (id) => SubDepartment.findById(id).populate(POPULATE_FIELDS),

  findAll: async ({ page, limit, search, cityId, plantId, departmentId, sortBy, sortOrder }) => {
    const filter = {};
    if (search) filter.name = new RegExp(search, 'i');
    if (cityId) filter.cityId = cityId;
    if (plantId) filter.plantId = plantId;
    if (departmentId) filter.departmentId = departmentId;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [subDepartments, total] = await Promise.all([
      SubDepartment.find(filter).populate(POPULATE_FIELDS).sort(sort).skip(skip).limit(limit),
      SubDepartment.countDocuments(filter)
    ]);

    return { subDepartments, total };
  },

  updateById: (id, updateData) =>
    SubDepartment.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(POPULATE_FIELDS)
};