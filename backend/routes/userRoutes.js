import express from 'express';
import { getUser, updateUserProfile} from "../controllers/userController.js"
import { authenticate } from "../middlewares/authMiddleware.js"
import { updateProfileSchema } from "../validators/userValidator.js"
import { validate } from '../middlewares/validate.js';

const router = express.Router()

router.get('/profile', authenticate, getUser)
router.put('/profile', authenticate, updateUserProfile)

export default router; 
