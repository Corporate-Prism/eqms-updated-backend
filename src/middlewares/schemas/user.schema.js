import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const mongoObjectId = z.string().regex(objectIdRegex, 'Invalid ObjectId format');

export const RoleEnum = z.enum([
  'Creator',
  'Reviewer',
  'Approver',
  'Approver 2',
  'Master Admin',
  'Member',
  'Trainer',
  'Trainee'
]);

export const StatusEnum = z.enum(['active', 'inActive', 'suspended']);

export const registerUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name is required').trim(),
    lastName: z.string().min(2, 'Last name is required').trim(),
    employeeId: z.string().min(2, 'Employee ID is required').trim(),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    role: RoleEnum,
    designationId: mongoObjectId,
    cityId: mongoObjectId,
    plantId: mongoObjectId,
    departmentId: mongoObjectId,
    subDepartmentId: mongoObjectId,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    status: StatusEnum.default('active')
  })
});

export const loginUserSchema = z.object({
  body: z.object({
    identifier: z.string().trim().min(2, 'Identifier is required'),
    password: z.string().min(1, 'Password is required')
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().trim().min(1, 'Refresh token is required')
  })
});

export const logoutUserSchema = z.object({
  body: z.object({
    refreshToken: z.string().trim().min(1, 'Refresh token is required')
  })
});

export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    role: RoleEnum.optional(),
    status: StatusEnum.optional(),
    designationId: mongoObjectId.optional(),
    cityId: mongoObjectId.optional(),
    plantId: mongoObjectId.optional(),
    departmentId: mongoObjectId.optional(),
    subDepartmentId: mongoObjectId.optional(),
    sortBy: z.enum(['firstName', 'lastName', 'email', 'employeeId', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: mongoObjectId
  }),
  body: z
    .object({
      firstName: z.string().min(2).trim().optional(),
      lastName: z.string().min(2).trim().optional(),
      employeeId: z.string().min(2).trim().optional(),
      email: z.string().email().trim().toLowerCase().optional(),
      mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
      role: RoleEnum.optional(),
      designationId: mongoObjectId.optional(),
      cityId: mongoObjectId.optional(),
      plantId: mongoObjectId.optional(),
      departmentId: mongoObjectId.optional(),
      subDepartmentId: mongoObjectId.optional(),
      status: StatusEnum.optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update'
    })
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: mongoObjectId
  })
});