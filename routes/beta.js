import express from 'express';
import { authenticateToken } from './auth.js';

import {
	betaAll,
	betaForm,
	betaDetail,
} from "../controllers/beta.js";

const router = express.Router();

router.get('/', betaAll);
router.get('/:id', authenticateToken, betaDetail);
router.post('/form', betaForm);

export default router;
