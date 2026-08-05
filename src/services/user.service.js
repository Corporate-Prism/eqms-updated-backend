import { userRepository } from '../repositories/user.repository.js';
import { designationRepository } from '../repositories/designation.repository.js';
import { cityRepository } from '../repositories/city.repository.js';
import { plantRepository } from '../repositories/plant.repository.js';
import { departmentRepository } from '../repositories/department.repository.js';
import { subDepartmentRepository } from '../repositories/subDepartment.repository.js';

const notFound = (label) => {
  const error = new Error(`${label} not found`);
  error.statusCode = 404;
  throw error;
};

const assertRefsExist = async ({ designationId, cityId, plantId, departmentId, subDepartmentId }) => {
  const checks = [];
  if (designationId) checks.push(designationRepository.findById(designationId).then((r) => r || notFound('Designation')));
  if (cityId) checks.push(cityRepository.findById(cityId).then((r) => r || notFound('City')));
  if (plantId) checks.push(plantRepository.findById(plantId).then((r) => r || notFound('Plant')));
  if (departmentId) checks.push(departmentRepository.findById(departmentId).then((r) => r || notFound('Department')));
  if (subDepartmentId) checks.push(subDepartmentRepository.findById(subDepartmentId).then((r) => r || notFound('SubDepartment')));

  await Promise.all(checks);
};

export const userService = {
  registerUser: async (userData) => {
    const existingUser = await userRepository.findByEmailOrEmployeeId(
      userData.email,
      userData.employeeId
    );

    if (existingUser) {
      const field =
        existingUser.email === userData.email.toLowerCase() ? 'email' : 'employeeId';
      const error = new Error(`User with this ${field} already exists.`);
      error.statusCode = 409;
      throw error;
    }

    await assertRefsExist(userData);

    const newUser = await userRepository.create(userData);
    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject;
  },

  getAllUsers: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const {
      search,
      role,
      status,
      designationId,
      cityId,
      plantId,
      departmentId,
      subDepartmentId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    const { users, total } = await userRepository.findAll({
      page,
      limit,
      search,
      role,
      status,
      designationId,
      cityId,
      plantId,
      departmentId,
      subDepartmentId,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      users,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  getUserById: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  updateUser: async (userId, updateData) => {
    const userExists = await userRepository.findById(userId);
    if (!userExists) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.email || updateData.employeeId) {
      const existingUser = await userRepository.findByEmailOrEmployeeIdExcludingId(
        updateData.email || '',
        updateData.employeeId || '',
        userId
      );

      if (existingUser) {
        const field =
          existingUser.email === updateData.email?.toLowerCase() ? 'email' : 'employeeId';
        const error = new Error(`Another user with this ${field} already exists.`);
        error.statusCode = 409;
        throw error;
      }
    }

    await assertRefsExist(updateData);

    const updatedUser = await userRepository.updateById(userId, updateData);
    return updatedUser;
  }
};