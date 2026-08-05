import { Router } from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation
} from '../controllers/location.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  createLocationSchema,
  getLocationsQuerySchema,
  locationIdParamSchema,
  updateLocationSchema
} from '../middlewares/schemas/location.schema.js';

const router = Router();

/**
 * @openapi
 * /locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cityId, plantId, departmentId, subDepartmentId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Raw Material Warehouse Bay A
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
 *     responses:
 *       201: { description: Location created }
 *       400: { description: Hierarchy chain inconsistent }
 *       404: { description: City, Plant, Department, or Sub-department not found }
 *       409: { description: A location with this name already exists in this sub-department }
 */
router.post('/', validate(createLocationSchema), createLocation);

/**
 * @openapi
 * /locations:
 *   get:
 *     summary: List locations with search and pagination
 *     tags: [Locations]
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
 *         name: subDepartmentId
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200: { description: Paginated list of locations }
 */
router.get('/', validate(getLocationsQuerySchema), getAllLocations);

/**
 * @openapi
 * /locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Location found }
 *       404: { description: Location not found }
 */
router.get('/:id', validate(locationIdParamSchema), getLocationById);

/**
 * @openapi
 * /locations/{id}:
 *   patch:
 *     summary: Update a location
 *     tags: [Locations]
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
 *                 example: Raw Material Warehouse Bay B
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
 *     responses:
 *       200: { description: Location updated }
 *       400: { description: Hierarchy chain inconsistent }
 *       404: { description: Location, City, Plant, Department, or Sub-department not found }
 *       409: { description: A location with this name already exists in this sub-department }
 */
router.patch('/:id', validate(updateLocationSchema), updateLocation);

export default router;