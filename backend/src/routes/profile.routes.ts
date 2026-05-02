import {Router} from 'express';
import {saveParsedProfile, getProfile} from '../controllers/profile.controller';

const router = Router();

router.post('/save-profile', saveParsedProfile);
router.get('/get-profile/:userId', getProfile);

export default router;