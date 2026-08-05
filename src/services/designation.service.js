import { designationRepository } from '../repositories/designation.repository.js';

export const designationService = {
  createDesignation: async (designationData) => {
    const existingDesignation = await designationRepository.findByName(designationData.name);
    if (existingDesignation) {
      const error = new Error('Designation with this name already exists.');
      error.statusCode = 409;
      throw error;
    }
    return designationRepository.create(designationData);
  },

  getAllDesignations: async (queryParams) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const { designations, total } = await designationRepository.findAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder
    });

    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    return {
      designations,
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

  getDesignationById: async (designationId) => {
    const designation = await designationRepository.findById(designationId);
    if (!designation) {
      const error = new Error('Designation not found');
      error.statusCode = 404;
      throw error;
    }
    return designation;
  },

  updateDesignation: async (designationId, updateData) => {
    const existingDesignation = await designationRepository.findById(designationId);
    if (!existingDesignation) {
      const error = new Error('Designation not found');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name && updateData.name.toLowerCase() !== existingDesignation.name.toLowerCase()) {
      const nameTaken = await designationRepository.findByName(updateData.name, designationId);
      if (nameTaken) {
        const error = new Error('Designation with this name already exists.');
        error.statusCode = 409;
        throw error;
      }
    }

    return designationRepository.updateById(designationId, updateData);
  }
};