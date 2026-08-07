import jwt from 'jsonwebtoken';
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

const invalidatedRefreshTokens = new Set();
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const signTokens = (user) => {
  const payload = { sub: user._id, role: user.role, email: user.email };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  return { accessToken, refreshToken };
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
  loginUser: async ({ identifier, password }) => {
    const user = await userRepository.findByCredentials(identifier);

    if (!user) {
      const error = new Error('Invalid email/employee ID or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error = new Error('Invalid email/employee ID or password');
      error.statusCode = 401;
      throw error;
    }

    if (user.status !== 'active') {
      const error = new Error('User account is not active');
      error.statusCode = 403;
      throw error;
    }

    const userObject = user.toObject();
    delete userObject.password;

    const { accessToken, refreshToken } = signTokens(user);

    return {
      user: userObject,
      accessToken,
      refreshToken
    };
  },

  refreshToken: async ({ refreshToken }) => {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    if (invalidatedRefreshTokens.has(refreshToken)) {
      const error = new Error('Refresh token has been invalidated');
      error.statusCode = 401;
      throw error;
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }

    const user = await userRepository.findById(payload.sub);
    if (!user || user.status !== 'active') {
      const error = new Error('User not found or inactive');
      error.statusCode = 401;
      throw error;
    }

    invalidatedRefreshTokens.add(refreshToken);
    const tokens = signTokens(user);

    return {
      message: 'Access token refreshed successfully',
      ...tokens
    };
  },

  logoutUser: async ({ refreshToken }) => {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    invalidatedRefreshTokens.add(refreshToken);
    return { message: 'Logged out successfully' };
  },

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