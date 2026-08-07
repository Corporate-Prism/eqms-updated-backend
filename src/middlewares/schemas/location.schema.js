import { z } from 'zod';
import { mongoObjectId } from './user.schema.js';

export const createLocationSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Location code is required').trim().toUpperCase(),
    name: z.string().min(2, 'Location name is required').trim(),
    cityId: mongoObjectId,
    plantId: mongoObjectId,
    departmentId: mongoObjectId,
    subDepartmentId: mongoObjectId
  })
});

export const getLocationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    cityId: mongoObjectId.optional(),
    plantId: mongoObjectId.optional(),
    departmentId: mongoObjectId.optional(),
    subDepartmentId: mongoObjectId.optional(),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const locationIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});

export const updateLocationSchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z
    .object({
      code: z.string().min(2, 'Location code is required').trim().toUpperCase().optional(),
      name: z.string().min(2, 'Location name is required').trim().optional(),
      cityId: mongoObjectId.optional(),
      plantId: mongoObjectId.optional(),
      departmentId: mongoObjectId.optional(),
      subDepartmentId: mongoObjectId.optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});