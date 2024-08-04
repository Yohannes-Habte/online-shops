import express from 'express';
import { getFooterData } from '../controllers/rowDataController.js';

// Row Data Router
const rowDataRouter = express.Router();

// Row data routes
rowDataRouter.get('/footer', getFooterData);

// Export row data Router
export default rowDataRouter;
