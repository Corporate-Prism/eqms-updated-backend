import { User } from '../models/user.model.js';

const POPULATE_FIELDS = [
  { path: 'designationId', select: 'name' },
  { path: 'cityId', select: 'name' },
  { path: 'plantId', select: 'name' },
  { path: 'departmentId', select: 'name' },
  { path: 'subDepartmentId', select: 'name' }
];

export const userRepository = {
  findByEmailOrEmployeeId: (email, employeeId) =>
    User.findOne({
      $or: [{ email: email.toLowerCase() }, { employeeId: employeeId.toUpperCase() }]
    }),

  findByEmailOrEmployeeIdExcludingId: (email, employeeId, excludeId) => {
    const or = [];
    if (email) or.push({ email: email.toLowerCase() });
    if (employeeId) or.push({ employeeId: employeeId.toUpperCase() });
    if (or.length === 0) return null;

    return User.findOne({ $or: or, _id: { $ne: excludeId } });
  },

  create: (userData) => User.create(userData),

  findByCredentials: (identifier) => {
    const normalizedIdentifier = identifier?.trim();
    return User.findOne({
      $or: [
        { email: normalizedIdentifier.toLowerCase() },
        { employeeId: normalizedIdentifier.toUpperCase() }
      ]
    }).select('+password').populate(POPULATE_FIELDS);
  },

  findById: (id) => User.findById(id).populate(POPULATE_FIELDS),

  findAll: async ({ page, limit, search, role, status, designationId, cityId, plantId, departmentId, subDepartmentId, sortBy, sortOrder }) => {
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex }
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (designationId) filter.designationId = designationId;
    if (cityId) filter.cityId = cityId;
    if (plantId) filter.plantId = plantId;
    if (departmentId) filter.departmentId = departmentId;
    if (subDepartmentId) filter.subDepartmentId = subDepartmentId;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).populate(POPULATE_FIELDS).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    return { users, total };
  },

  updateById: (id, updateData) =>
    User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(POPULATE_FIELDS)
};