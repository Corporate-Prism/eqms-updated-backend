import { designationService } from '../services/designation.service.js';

export const createDesignation = async (req, res, next) => {
  try {
    const designation = await designationService.createDesignation(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Designation created successfully',
      data: { designation }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDesignations = async (req, res, next) => {
  try {
    const { designations, pagination } = await designationService.getAllDesignations(req.query);
    return res.status(200).json({
      status: 'success',
      data: designations,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getDesignationById = async (req, res, next) => {
  try {
    const designation = await designationService.getDesignationById(req.params.id);
    return res.status(200).json({ status: 'success', data: { designation } });
  } catch (error) {
    next(error);
  }
};

export const updateDesignation = async (req, res, next) => {
  try {
    const designation = await designationService.updateDesignation(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Designation updated successfully',
      data: { designation }
    });
  } catch (error) {
    next(error);
  }
};