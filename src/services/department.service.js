import { departmentRepository } from '../repositories/department.repository.js';
import { cityRepository } from '../repositories/city.repository.js';
import { plantRepository } from '../repositories/plant.repository.js';

const assertPlantBelongsToCity = async (plantId, cityId) => {
  const plant = await plantRepository.findById(plantId);
  if (!plant) {
    const error = new Error('Plant not found');
    error.statusCode = 404;
    throw error;
  }
  // plant.cityId is populated (an object) via findById, so compare its _id
  const plantCityId = plant.cityId._id ? plant.cityId._id.toString() : plant.cityId.toString();
  if (plantCityId !== cityId.toString()) {
    const error = new Error('The given plant does not belong to the given city.');
    error.statusCode = 400;
    throw error;
  }
};

export const departmentService = {
  createDepartment: async (departmentData) => {
    const city = await cityRepository.findById(departmentData.cityId);
    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    await assertPlantBelongsToCity(departmentData.plantId, departmentData.cityId);

    const existingDepartment = await departmentRepository.findByNameInPlant(
      departmentData.name,
      departmentData.plantId
    );
    if (existingDepartment) {
      const error = new Error('A department with this name already exists in this plant.');
      error.statusCode = 409;
      throw error;
    }

    return departmentRepository.create(departmentData);
  },

  getAllDepartments: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const { search, cityId, plantId, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const { departments, total } = await departmentRepository.findAll({
      page,
      limit,
      search,
      cityId,
      plantId,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      departments,
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

  getDepartmentById: async (departmentId) => {
    const department = await departmentRepository.findById(departmentId);
    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }
    return department;
  },

  updateDepartment: async (departmentId, updateData) => {
    const departmentExists = await departmentRepository.findById(departmentId);
    if (!departmentExists) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    const nextCityId = updateData.cityId || departmentExists.cityId._id || departmentExists.cityId;
    const nextPlantId = updateData.plantId || departmentExists.plantId._id || departmentExists.plantId;

    if (updateData.cityId || updateData.plantId) {
      const city = await cityRepository.findById(nextCityId);
      if (!city) {
        const error = new Error('City not found');
        error.statusCode = 404;
        throw error;
      }
      await assertPlantBelongsToCity(nextPlantId, nextCityId);
    }

    if (updateData.name || updateData.plantId) {
      const nameToCheck = updateData.name || departmentExists.name;
      const conflict = await departmentRepository.findByNameInPlant(nameToCheck, nextPlantId, departmentId);
      if (conflict) {
        const error = new Error('A department with this name already exists in this plant.');
        error.statusCode = 409;
        throw error;
      }
    }

    return departmentRepository.updateById(departmentId, updateData);
  }
};