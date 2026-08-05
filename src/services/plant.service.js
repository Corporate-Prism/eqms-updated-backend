import { plantRepository } from '../repositories/plant.repository.js';
import { cityRepository } from '../repositories/city.repository.js';

export const plantService = {
  createPlant: async (plantData) => {
    const city = await cityRepository.findById(plantData.cityId);
    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    const existingPlant = await plantRepository.findByNameInCity(plantData.name, plantData.cityId);
    if (existingPlant) {
      const error = new Error('A plant with this name already exists in this city.');
      error.statusCode = 409;
      throw error;
    }

    return plantRepository.create(plantData);
  },

  getAllPlants: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const { search, cityId, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const { plants, total } = await plantRepository.findAll({
      page,
      limit,
      search,
      cityId,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      plants,
      pagination: {
        total,
        totalPages,
        page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  getPlantById: async (plantId) => {
    const plant = await plantRepository.findById(plantId);
    if (!plant) {
      const error = new Error('Plant not found');
      error.statusCode = 404;
      throw error;
    }
    return plant;
  },

  updatePlant: async (plantId, updateData) => {
    const plantExists = await plantRepository.findById(plantId);
    if (!plantExists) {
      const error = new Error('Plant not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.cityId) {
      const city = await cityRepository.findById(updateData.cityId);
      if (!city) {
        const error = new Error('City not found');
        error.statusCode = 404;
        throw error;
      }
    }

    // if name or cityId is changing, re-check the compound uniqueness
    if (updateData.name || updateData.cityId) {
      const nameToCheck = updateData.name || plantExists.name;
      const cityToCheck = updateData.cityId || plantExists.cityId;

      const conflict = await plantRepository.findByNameInCity(nameToCheck, cityToCheck, plantId);
      if (conflict) {
        const error = new Error('A plant with this name already exists in this city.');
        error.statusCode = 409;
        throw error;
      }
    }

    return plantRepository.updateById(plantId, updateData);
  }
};