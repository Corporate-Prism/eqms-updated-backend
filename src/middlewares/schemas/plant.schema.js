import { z } from 'zod';
import { mongoObjectId } from './user.schema.js';

export const createPlantSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Plant name is required').trim(),
    cityId: mongoObjectId
  })
});

export const getPlantsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    cityId: mongoObjectId.optional(),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const plantIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});

export const updatePlantSchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z
    .object({
      name: z.string().min(2, 'Plant name is required').trim().optional(),
      cityId: mongoObjectId.optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});