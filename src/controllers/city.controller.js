import { cityService } from '../services/city.service.js';

export const createCity = async (req, res, next) => {
  try {
    const city = await cityService.createCity(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'City created successfully',
      data: { item: city }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCities = async (req, res, next) => {
  try {
    const { cities, pagination } = await cityService.getAllCities(req.query);
    return res.status(200).json({
      status: 'success',
      data: {
        items: cities,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const city = await cityService.getCityById(req.params.id);
    return res.status(200).json({ status: 'success', data: { item: city } });
  } catch (error) {
    next(error);
  }
};

export const updateCity = async (req, res, next) => {
  try {
    const city = await cityService.updateCity(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'City updated successfully',
      data: { item: city }
    });
  } catch (error) {
    next(error);
  }
};