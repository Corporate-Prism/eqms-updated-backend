import { Router } from 'express';
import { createCity, getAllCities, getCityById, updateCity } from '../controllers/city.controller.js';
import { validate } from '../middlewares/validate.js';
import { createCitySchema, getCitiesQuerySchema, cityIdParamSchema, updateCitySchema } from '../middlewares/schemas/city.schema.js';

const router = Router();

/**
 * @openapi
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
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
 *                 example: Karachi
 *     responses:
 *       201: { description: City created }
 *       409: { description: City with this name already exists }
 */
router.post('/', validate(createCitySchema), createCity);

/**
 * @openapi
 * /cities:
 *   get:
 *     summary: List cities with search and pagination
 *     tags: [Cities]
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
 *       200: { description: Paginated list of cities }
 */
router.get('/', validate(getCitiesQuerySchema), getAllCities);

/**
 * @openapi
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: City found }
 *       404: { description: City not found }
 */
router.get('/:id', validate(cityIdParamSchema), getCityById);

/**
 * @openapi
 * /cities/{id}:
 *   patch:
 *     summary: Update a city
 *     tags: [Cities]
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
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: New York
 *     responses:
 *       200:
 *         description: City updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: City not found
 *       409:
 *         description: City with this name already exists
 */
router.patch('/:id', validate(updateCitySchema), updateCity);

export default router;