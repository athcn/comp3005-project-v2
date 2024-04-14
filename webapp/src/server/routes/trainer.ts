import express from 'express';
import { createSchedule, createSession, getMembers, getSchedules, getSessions } from '../controllers/trainer.ts';

const router = express.Router();

router.post('/create-schedule', createSchedule);
router.get('/schedules', getSchedules);

router.post('/create-sessions', createSession);
router.get('/sessions', getSessions);

router.get('/members', getMembers);

export default router;