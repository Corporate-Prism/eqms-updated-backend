import { cityRepository } from '../repositories/city.repository.js';

export const cityService = {
  createCity: async (cityData) => {
    const existingCity = await cityRepository.findByName(cityData.name);
    if (existingCity) {
      const error = new Error('City with this name already exists.');
      error.statusCode = 409;
      throw error;
    }
    return cityRepository.create(cityData);
  },

  getAllCities: async (queryParams) => {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (queryParams.search) {
      filter.name = new RegExp(queryParams.search, 'i');
    }

    const sortField = queryParams.sortBy || 'createdAt';
    const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const { cities, total } = await cityRepository.findAll({ filter, skip, limit, sort });

    return {
      cities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    };
  },

  getCityById: async (id) => {
    const city = await cityRepository.findById(id);
    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }
    return city;
  },

  updateCity: async (id, updateData) => {
    const existingCity = await cityRepository.findById(id);
    if (!existingCity) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name && updateData.name.toLowerCase() !== existingCity.name.toLowerCase()) {
      const nameTaken = await cityRepository.findByName(updateData.name, id);
      if (nameTaken) {
        const error = new Error('City with this name already exists.');
        error.statusCode = 409;
        throw error;
      }
    }

    return cityRepository.updateById(id, updateData);
  }
};