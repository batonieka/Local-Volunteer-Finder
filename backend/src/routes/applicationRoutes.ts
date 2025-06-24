import express from 'express';
import { submitApplication, getApplications } from '../controllers/applicationController';

const router = express.Router();

router.post('/', submitApplication);
router.get('/', getApplications);

export default router;
