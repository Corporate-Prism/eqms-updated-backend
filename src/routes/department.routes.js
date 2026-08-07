import { Router } from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment
} from '../controllers/department.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createDepartmentSchema,
  getDepartmentsQuerySchema,
  departmentIdParamSchema,
  updateDepartmentSchema
} from '../middlewares/schemas/department.schema.js';

const router = Router();

/**
 * @openapi
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, cityId, plantId]
 *             properties:
 *               code:
 *                 type: string
 *                 example: DEPT-001
 *               name:
 *                 type: string
 *                 example: Quality Assurance
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *     responses:
 *       201: { description: Department created }
 *       400: { description: Plant does not belong to given city }
 *       404: { description: City or Plant not found }
 *       409: { description: A department with this name already exists in this plant }
 */
router.post('/', validate(createDepartmentSchema), createDepartment);

/**
 * @openapi
 * /departments:
 *   get:
 *     summary: List departments with search and pagination
 *     tags: [Departments]
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
 *       - in: query
 *         name: cityId
 *         schema: { type: string }
 *       - in: query
 *         name: plantId
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated list of departments }
 */
router.get('/', validate(getDepartmentsQuerySchema), getAllDepartments);

/**
 * @openapi
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Department found }
 *       404: { description: Department not found }
 */
router.get('/:id', validate(departmentIdParamSchema), getDepartmentById);

/**
 * @openapi
 * /departments/{id}:
 *   patch:
 *     summary: Update a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               code:
 *                 type: string
 *                 example: DEPT-001
 *               name:
 *                 type: string
 *                 example: Quality Assurance - Renamed
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *     responses:
 *       200: { description: Department updated }
 *       400: { description: Plant does not belong to given city }
 *       404: { description: Department, City, or Plant not found }
 *       409: { description: A department with this name already exists in this plant }
 */
router.patch('/:id', validate(updateDepartmentSchema), updateDepartment);

export default router;