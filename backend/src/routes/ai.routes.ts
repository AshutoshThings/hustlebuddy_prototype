import { Router } from 'express';
import { generateProposal } from '../controllers/ai.controller';

const router = Router();
router.post('/generate-proposal', generateProposal);

export default router;