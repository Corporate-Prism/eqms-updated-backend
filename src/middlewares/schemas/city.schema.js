import { z } from 'zod';
import { mongoObjectId } from './user.schema.js'; // Reuse mongoObjectId helper

export const createCitySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'City name is required').trim()
  })
});

export const getCitiesQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    sortBy: z.enum(['name', 'createdAt']).default('name'),
    sortOrder: z.enum(['asc', 'desc']).default('asc')
  })
});

export const cityIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});

export const updateCitySchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z.object({
    name: z.string().min(2, 'City name is required').trim()
  })
});