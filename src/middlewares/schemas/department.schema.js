import { z } from 'zod';
import { mongoObjectId } from './user.schema.js';

export const createDepartmentSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Department code is required').trim().toUpperCase(),
    name: z.string().min(2, 'Department name is required').trim(),
    cityId: mongoObjectId,
    plantId: mongoObjectId
  })
});

export const getDepartmentsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    cityId: mongoObjectId.optional(),
    plantId: mongoObjectId.optional(),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const departmentIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z
    .object({
      code: z.string().min(2, 'Department code is required').trim().toUpperCase().optional(),
      name: z.string().min(2, 'Department name is required').trim().optional(),
      cityId: mongoObjectId.optional(),
      plantId: mongoObjectId.optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});