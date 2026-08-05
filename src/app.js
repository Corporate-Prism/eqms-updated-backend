import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';
import userRoutes from './routes/user.routes.js';
import cityRoutes from './routes/city.routes.js';
import plantRoutes from './routes/plant.routes.js';
import departmentRoutes from './routes/department.routes.js';
import subDepartmentRoutes from './routes/subDepartment.routes.js';
import designationRoutes from './routes/designation.routes.js';
import locationRoutes from './routes/location.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// API Documentation Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/plants', plantRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/sub-departments', subDepartmentRoutes);
app.use('/api/v1/designations', designationRoutes);
app.use('/api/v1/locations', locationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`eQMS Server running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
});