import { Location } from '../models/location.model.js';

const POPULATE_FIELDS = [
  { path: 'cityId', select: 'name' },
  { path: 'plantId', select: 'name' },
  { path: 'departmentId', select: 'name' },
  { path: 'subDepartmentId', select: 'name' }
];

export const locationRepository = {
  findByNameInSubDepartment: (name, subDepartmentId, excludeId) => {
    const filter = {
      name: new RegExp(`^${name}$`, 'i'),
      subDepartmentId
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Location.findOne(filter);
  },

  create: (locationData) => Location.create(locationData),

  findById: (id) => Location.findById(id).populate(POPULATE_FIELDS),

  findAll: async ({
    page,
    limit,
    search,
    cityId,
    plantId,
    departmentId,
    subDepartmentId,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) => {
    const filter = {};
    if (search) filter.name = new RegExp(search, 'i');
    if (cityId) filter.cityId = cityId;
    if (plantId) filter.plantId = plantId;
    if (departmentId) filter.departmentId = departmentId;
    if (subDepartmentId) filter.subDepartmentId = subDepartmentId;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [locations, total] = await Promise.all([
      Location.find(filter).populate(POPULATE_FIELDS).sort(sort).skip(skip).limit(limit),
      Location.countDocuments(filter)
    ]);

    return { locations, total };
  },

  updateById: (id, updateData) =>
    Location.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
      POPULATE_FIELDS
    )
};