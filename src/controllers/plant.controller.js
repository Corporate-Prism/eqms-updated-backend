import { plantService } from '../services/plant.service.js';

export const createPlant = async (req, res, next) => {
  try {
    const plant = await plantService.createPlant(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Plant created successfully',
      data: { item: plant }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPlants = async (req, res, next) => {
  try {
    const { plants, pagination } = await plantService.getAllPlants(req.query);
    return res.status(200).json({
      status: 'success',
      data: {
        items: plants,
        pagination
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPlantById = async (req, res, next) => {
  try {
    const plant = await plantService.getPlantById(req.params.id);
    return res.status(200).json({ status: 'success', data: { item: plant } });
  } catch (error) {
    next(error);
  }
};

export const updatePlant = async (req, res, next) => {
  try {
    const plant = await plantService.updatePlant(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Plant updated successfully',
      data: { item: plant }
    });
  } catch (error) {
    next(error);
  }
};