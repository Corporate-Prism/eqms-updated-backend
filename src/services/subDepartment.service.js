import { subDepartmentRepository } from '../repositories/subDepartment.repository.js';
import { cityRepository } from '../repositories/city.repository.js';
import { plantRepository } from '../repositories/plant.repository.js';
import { departmentRepository } from '../repositories/department.repository.js';

const idOf = (ref) => (ref && ref._id ? ref._id.toString() : ref.toString());

const assertChainConsistency = async (departmentId, plantId, cityId) => {
  const department = await departmentRepository.findById(departmentId);
  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }
  if (idOf(department.plantId) !== plantId.toString()) {
    const error = new Error('The given department does not belong to the given plant.');
    error.statusCode = 400;
    throw error;
  }

  const plant = await plantRepository.findById(plantId);
  if (!plant) {
    const error = new Error('Plant not found');
    error.statusCode = 404;
    throw error;
  }
  if (idOf(plant.cityId) !== cityId.toString()) {
    const error = new Error('The given plant does not belong to the given city.');
    error.statusCode = 400;
    throw error;
  }
};

export const subDepartmentService = {
  createSubDepartment: async (subDepartmentData) => {
    const { cityId, plantId, departmentId } = subDepartmentData;

    const city = await cityRepository.findById(cityId);
    if (!city) {
      const error = new Error('City not found');
      error.statusCode = 404;
      throw error;
    }

    await assertChainConsistency(departmentId, plantId, cityId);

    const existingSubDepartmentByName = await subDepartmentRepository.findByNameInDepartment(
      subDepartmentData.name,
      departmentId
    );
    if (existingSubDepartmentByName) {
      const error = new Error('A sub-department with this name already exists in this department.');
      error.statusCode = 409;
      throw error;
    }

    const existingSubDepartmentByCode = await subDepartmentRepository.findByCodeInDepartment(
      subDepartmentData.code,
      departmentId
    );
    if (existingSubDepartmentByCode) {
      const error = new Error('A sub-department with this code already exists in this department.');
      error.statusCode = 409;
      throw error;
    }

    return subDepartmentRepository.create(subDepartmentData);
  },

  getAllSubDepartments: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const { search, cityId, plantId, departmentId, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const { subDepartments, total } = await subDepartmentRepository.findAll({
      page,
      limit,
      search,
      cityId,
      plantId,
      departmentId,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      subDepartments,
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

  getSubDepartmentById: async (subDepartmentId) => {
    const subDepartment = await subDepartmentRepository.findById(subDepartmentId);
    if (!subDepartment) {
      const error = new Error('Sub-department not found');
      error.statusCode = 404;
      throw error;
    }
    return subDepartment;
  },

  updateSubDepartment: async (subDepartmentId, updateData) => {
    const subDepartmentExists = await subDepartmentRepository.findById(subDepartmentId);
    if (!subDepartmentExists) {
      const error = new Error('Sub-department not found');
      error.statusCode = 404;
      throw error;
    }

    const nextCityId = updateData.cityId || idOf(subDepartmentExists.cityId);
    const nextPlantId = updateData.plantId || idOf(subDepartmentExists.plantId);
    const nextDepartmentId = updateData.departmentId || idOf(subDepartmentExists.departmentId);

    if (updateData.cityId || updateData.plantId || updateData.departmentId) {
      const city = await cityRepository.findById(nextCityId);
      if (!city) {
        const error = new Error('City not found');
        error.statusCode = 404;
        throw error;
      }
      await assertChainConsistency(nextDepartmentId, nextPlantId, nextCityId);
    }

    if (updateData.name || updateData.departmentId) {
      const nameToCheck = updateData.name || subDepartmentExists.name;
      const nameConflict = await subDepartmentRepository.findByNameInDepartment(
        nameToCheck,
        nextDepartmentId,
        subDepartmentId
      );
      if (nameConflict) {
        const error = new Error('A sub-department with this name already exists in this department.');
        error.statusCode = 409;
        throw error;
      }
    }

    if (updateData.code || updateData.departmentId) {
      const codeToCheck = updateData.code || subDepartmentExists.code;
      const codeConflict = await subDepartmentRepository.findByCodeInDepartment(
        codeToCheck,
        nextDepartmentId,
        subDepartmentId
      );
      if (codeConflict) {
        const error = new Error('A sub-department with this code already exists in this department.');
        error.statusCode = 409;
        throw error;
      }
    }

    return subDepartmentRepository.updateById(subDepartmentId, updateData);
  }
};