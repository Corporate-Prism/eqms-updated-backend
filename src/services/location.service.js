import { locationRepository } from '../repositories/location.repository.js';
import { subDepartmentRepository } from '../repositories/subDepartment.repository.js';
import { departmentRepository } from '../repositories/department.repository.js';
import { plantRepository } from '../repositories/plant.repository.js';
import { cityRepository } from '../repositories/city.repository.js';

const idOf = (ref) => {
  if (!ref) return '';
  return ref._id ? ref._id.toString() : ref.toString();
};

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Validates structural chain consistency for a Location:
 * SubDepartment -> Department -> Plant -> City
 */
const assertChainConsistency = async (subDepartmentId, departmentId, plantId, cityId) => {
  const [subDepartment, department, plant] = await Promise.all([
    subDepartmentRepository.findById(subDepartmentId),
    departmentRepository.findById(departmentId),
    plantRepository.findById(plantId)
  ]);

  if (!subDepartment) throw createError('Sub-department not found', 404);
  if (idOf(subDepartment.departmentId) !== departmentId.toString()) {
    throw createError('The given sub-department does not belong to the given department.', 400);
  }

  if (!department) throw createError('Department not found', 404);
  if (idOf(department.plantId) !== plantId.toString()) {
    throw createError('The given department does not belong to the given plant.', 400);
  }

  if (!plant) throw createError('Plant not found', 404);
  if (idOf(plant.cityId) !== cityId.toString()) {
    throw createError('The given plant does not belong to the given city.', 400);
  }
};

export const locationService = {
  createLocation: async (locationData) => {
    const { cityId, plantId, departmentId, subDepartmentId, name } = locationData;

    // 1. Verify Top-Level Ancestor
    const city = await cityRepository.findById(cityId);
    if (!city) throw createError('City not found', 404);

    // 2. Validate Entire Parental Hierarchy Chain
    await assertChainConsistency(subDepartmentId, departmentId, plantId, cityId);

    // 3. Enforce Uniqueness within Sub-Department
    const existingLocation = await locationRepository.findByNameInSubDepartment(
      name,
      subDepartmentId
    );
    if (existingLocation) {
      throw createError('A location with this name already exists in this sub-department.', 409);
    }

    return locationRepository.create(locationData);
  },

  getAllLocations: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const {
      search,
      cityId,
      plantId,
      departmentId,
      subDepartmentId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    const { locations, total } = await locationRepository.findAll({
      page,
      limit,
      search,
      cityId,
      plantId,
      departmentId,
      subDepartmentId,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      locations,
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

  getLocationById: async (locationId) => {
    const location = await locationRepository.findById(locationId);
    if (!location) throw createError('Location not found', 404);
    return location;
  },

  updateLocation: async (locationId, updateData) => {
    const locationExists = await locationRepository.findById(locationId);
    if (!locationExists) throw createError('Location not found', 404);

    // Derive target lineage (fall back to existing hierarchy if not supplied in patch)
    const nextCityId = updateData.cityId || idOf(locationExists.cityId);
    const nextPlantId = updateData.plantId || idOf(locationExists.plantId);
    const nextDepartmentId = updateData.departmentId || idOf(locationExists.departmentId);
    const nextSubDepartmentId = updateData.subDepartmentId || idOf(locationExists.subDepartmentId);

    // Re-verify hierarchy chain if any node changed
    if (
      updateData.cityId ||
      updateData.plantId ||
      updateData.departmentId ||
      updateData.subDepartmentId
    ) {
      const city = await cityRepository.findById(nextCityId);
      if (!city) throw createError('City not found', 404);

      await assertChainConsistency(
        nextSubDepartmentId,
        nextDepartmentId,
        nextPlantId,
        nextCityId
      );
    }

    // Check name collision within the parent sub-department
    if (updateData.name || updateData.subDepartmentId) {
      const nameToCheck = updateData.name || locationExists.name;
      const conflict = await locationRepository.findByNameInSubDepartment(
        nameToCheck,
        nextSubDepartmentId,
        locationId
      );
      if (conflict) {
        throw createError('A location with this name already exists in this sub-department.', 409);
      }
    }

    return locationRepository.updateById(locationId, updateData);
  }
};