import { Router } from 'express';
import multer from 'multer';
import { generateProposal , parseResume} from '../controllers/ai.controller';


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();
router.post('/generate-proposal', generateProposal);
router.post('/parse-resume', upload.single('resume'), parseResume);

export default router;