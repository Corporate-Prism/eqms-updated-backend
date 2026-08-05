import { locationService } from '../services/location.service.js';

export const createLocation = async (req, res, next) => {
  try {
    const location = await locationService.createLocation(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Location created successfully',
      data: { location }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLocations = async (req, res, next) => {
  try {
    const { locations, pagination } = await locationService.getAllLocations(req.query);
    return res.status(200).json({
      status: 'success',
      data: locations,
      pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const location = await locationService.getLocationById(req.params.id);
    return res.status(200).json({ status: 'success', data: { location } });
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const location = await locationService.updateLocation(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Sub-department updated successfully',
      data: { location }
    });
  } catch (error) {
    next(error);
  }
};