import { departmentService } from '../services/department.service.js';

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Department created successfully',
      data: { department }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartments = async (req, res, next) => {
  try {
    const { departments, pagination } = await departmentService.getAllDepartments(req.query);
    return res.status(200).json({
      status: 'success',
      data: departments,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    return res.status(200).json({ status: 'success', data: { department } });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Department updated successfully',
      data: { department }
    });
  } catch (error) {
    next(error);
  }
};