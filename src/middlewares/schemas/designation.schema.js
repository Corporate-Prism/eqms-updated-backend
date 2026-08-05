import { z } from 'zod';
import { mongoObjectId } from './user.schema.js';

export const createDesignationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Designation name is required').trim()
  })
});

export const getDesignationsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const designationIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});

export const updateDesignationSchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z.object({
    name: z.string().min(2, 'Designation name is required').trim()
  })
});