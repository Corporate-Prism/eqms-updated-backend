import { Router } from 'express';
import {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation
} from '../controllers/designation.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createDesignationSchema,
  getDesignationsQuerySchema,
  designationIdParamSchema,
  updateDesignationSchema
} from '../middlewares/schemas/designation.schema.js';

const router = Router();

/**
 * @openapi
 * /designations:
 *   post:
 *     summary: Create a new designation
 *     tags: [Designations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sr. Manager
 *     responses:
 *       201: { description: Designation created }
 *       409: { description: Designation with this name already exists }
 */
router.post('/', validate(createDesignationSchema), createDesignation);

/**
 * @openapi
 * /designations:
 *   get:
 *     summary: List designations with search and pagination
 *     tags: [Designations]
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
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated list of designations }
 */
router.get('/', validate(getDesignationsQuerySchema), getAllDesignations);

/**
 * @openapi
 * /designations/{id}:
 *   get:
 *     summary: Get a designation by ID
 *     tags: [Designations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Designation found }
 *       404: { description: Designation not found }
 */
router.get('/:id', validate(designationIdParamSchema), getDesignationById);

/**
 * @openapi
 * /designations/{id}:
 *   patch:
 *     summary: Update a designation
 *     tags: [Designations]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sr. Manager - Renamed
 *     responses:
 *       200: { description: Designation updated }
 *       404: { description: Designation not found }
 *       409: { description: Designation with this name already exists }
 */
router.patch('/:id', validate(updateDesignationSchema), updateDesignation);

export default router;