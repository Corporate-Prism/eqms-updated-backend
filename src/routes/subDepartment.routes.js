import { Router } from 'express';
import {
  createSubDepartment,
  getAllSubDepartments,
  getSubDepartmentById,
  updateSubDepartment
} from '../controllers/subDepartment.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createSubDepartmentSchema,
  getSubDepartmentsQuerySchema,
  subDepartmentIdParamSchema,
  updateSubDepartmentSchema
} from '../middlewares/schemas/subDepartment.schema.js';

const router = Router();

/**
 * @openapi
 * /sub-departments:
 *   post:
 *     summary: Create a new sub-department
 *     tags: [SubDepartments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, cityId, plantId, departmentId]
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUB-001
 *               name:
 *                 type: string
 *                 example: Incoming QA
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *               departmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d03
 *     responses:
 *       201: { description: Sub-department created }
 *       400: { description: Department/Plant chain inconsistent }
 *       404: { description: City, Plant, or Department not found }
 *       409: { description: A sub-department with this name already exists in this department }
 */
router.post('/', validate(createSubDepartmentSchema), createSubDepartment);

/**
 * @openapi
 * /sub-departments:
 *   get:
 *     summary: List sub-departments with search and pagination
 *     tags: [SubDepartments]
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
 *         name: departmentId
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated list of sub-departments }
 */
router.get('/', validate(getSubDepartmentsQuerySchema), getAllSubDepartments);

/**
 * @openapi
 * /sub-departments/{id}:
 *   get:
 *     summary: Get a sub-department by ID
 *     tags: [SubDepartments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Sub-department found }
 *       404: { description: Sub-department not found }
 */
router.get('/:id', validate(subDepartmentIdParamSchema), getSubDepartmentById);

/**
 * @openapi
 * /sub-departments/{id}:
 *   patch:
 *     summary: Update a sub-department
 *     tags: [SubDepartments]
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
 *                 example: SUB-001
 *               name:
 *                 type: string
 *                 example: Incoming QA - Renamed
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *               plantId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d02
 *               departmentId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d03
 *     responses:
 *       200: { description: Sub-department updated }
 *       400: { description: Department/Plant chain inconsistent }
 *       404: { description: Sub-department, City, Plant, or Department not found }
 *       409: { description: A sub-department with this name already exists in this department }
 */
router.patch('/:id', validate(updateSubDepartmentSchema), updateSubDepartment);

export default router;