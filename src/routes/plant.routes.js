import { Router } from 'express';
import { createPlant, getAllPlants, getPlantById, updatePlant } from '../controllers/plant.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createPlantSchema,
  getPlantsQuerySchema,
  plantIdParamSchema,
  updatePlantSchema
} from '../middlewares/schemas/plant.schema.js';

const router = Router();

/**
 * @openapi
 * /plants:
 *   post:
 *     summary: Create a new plant
 *     tags: [Plants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cityId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Karachi Plant 1
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *     responses:
 *       201: { description: Plant created }
 *       404: { description: City not found }
 *       409: { description: A plant with this name already exists in this city }
 */
router.post('/', validate(createPlantSchema), createPlant);

/**
 * @openapi
 * /plants:
 *   get:
 *     summary: List plants with search and pagination
 *     tags: [Plants]
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
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated list of plants }
 */
router.get('/', validate(getPlantsQuerySchema), getAllPlants);

/**
 * @openapi
 * /plants/{id}:
 *   get:
 *     summary: Get a plant by ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Plant found }
 *       404: { description: Plant not found }
 */
router.get('/:id', validate(plantIdParamSchema), getPlantById);

/**
 * @openapi
 * /plants/{id}:
 *   patch:
 *     summary: Update a plant
 *     tags: [Plants]
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
 *               name:
 *                 type: string
 *                 example: Karachi Plant 1 - Renamed
 *               cityId:
 *                 type: string
 *                 example: 660f1b2c3d4e5f6a7b8c9d01
 *     responses:
 *       200: { description: Plant updated }
 *       404: { description: Plant or City not found }
 *       409: { description: A plant with this name already exists in this city }
 */
router.patch('/:id', validate(updatePlantSchema), updatePlant);

export default router;