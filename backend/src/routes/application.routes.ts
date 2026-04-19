import { Router } from 'express';
import { saveApplication } from '../controllers/application.controller';
import { sendApplicationEmail } from '../controllers/email.controller';

const router = Router();

router.post('/send-email', sendApplicationEmail);
router.post('/save', saveApplication);

export default router;