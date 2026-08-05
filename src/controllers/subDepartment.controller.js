import { subDepartmentService } from '../services/subDepartment.service.js';

export const createSubDepartment = async (req, res, next) => {
  try {
    const subDepartment = await subDepartmentService.createSubDepartment(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Sub-department created successfully',
      data: { subDepartment }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubDepartments = async (req, res, next) => {
  try {
    const { subDepartments, pagination } = await subDepartmentService.getAllSubDepartments(req.query);
    return res.status(200).json({
      status: 'success',
      data: subDepartments,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getSubDepartmentById = async (req, res, next) => {
  try {
    const subDepartment = await subDepartmentService.getSubDepartmentById(req.params.id);
    return res.status(200).json({ status: 'success', data: { subDepartment } });
  } catch (error) {
    next(error);
  }
};

export const updateSubDepartment = async (req, res, next) => {
  try {
    const subDepartment = await subDepartmentService.updateSubDepartment(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Sub-department updated successfully',
      data: { subDepartment }
    });
  } catch (error) {
    next(error);
  }
};