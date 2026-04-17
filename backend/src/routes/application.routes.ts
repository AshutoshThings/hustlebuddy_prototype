import { Router } from 'express';
import { saveApplication } from '../controllers/application.controller';

const router = Router();

router.post('/save', saveApplication);

export default router;