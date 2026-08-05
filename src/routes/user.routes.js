import { Router } from 'express';
import { getAllUsers, getUserById, register, updateUser } from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.js';
import { getUsersQuerySchema, registerUserSchema, updateUserSchema, userIdParamSchema } from '../middlewares/schemas/user.schema.js';

const router = Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new eQMS user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - employeeId
 *               - email
 *               - mobile
 *               - role
 *               - cityId
 *               - plantId
 *               - departmentId
 *               - subDepartmentId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               employeeId:
 *                 type: string
 *                 example: EMP-9042
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.doe@company.com
 *               mobile:
 *                 type: string
 *                 example: "+1234567890"
 *               designationId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d05
 *               role:
 *                 type: string
 *                 enum: [Admin, QualityManager, Auditor, Employee]
 *                 example: QualityManager
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *               departmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d03
 *               subDepartmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d04
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecureP@ss123
 *               status:
 *                 type: string
 *                 enum: [active, inActive, suspended]
 *                 default: active
 *                 example: active
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User with email or employeeId already exists
 */
router.post('/register', validate(registerUserSchema), register);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users with search and pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Matches firstName, lastName, email, or employeeId
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *       - in: query
 *         name: designationId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inActive, suspended] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
router.get('/', validate(getUsersQuerySchema), getAllUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User found }
 *       404: { description: User not found }
 */
router.get('/:id', validate(userIdParamSchema), getUserById);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 660f1b2c3d4e5f6a7b8c9d01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               employeeId:
 *                 type: string
 *                 example: EMP-9042
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@company.com
 *               mobile:
 *                 type: string
 *                 example: "+1234567890"
 *               role:
 *                 type: string
 *                 enum: [Creator, Reviewer, Approver, Approver 2, Master Admin, Member, Trainer, Trainee]
 *                 example: Reviewer
 *               designationId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d05
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *               departmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d03
 *               subDepartmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d04
 *               status:
 *                 type: string
 *                 enum: [active, inActive, suspended]
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error or empty update body
 *       404:
 *         description: User not found
 *       409:
 *         description: Email or employeeId already in use
 */
router.patch('/:id', validate(updateUserSchema), updateUser);

export default router;