import { userService } from '../services/user.service.js';

export const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: { item: result }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const tokens = await userService.refreshToken(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: { item: tokens }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await userService.logoutUser(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
      data: { item: result }
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { item: user }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await userService.getAllUsers(req.query);
    return res.status(200).json({
      status: 'success',
      data: {
        items: users,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ status: 'success', data: { item: user } });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { item: user }
    });
  } catch (error) {
    next(error);
  }
};