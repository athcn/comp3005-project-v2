import express from 'express';
import { createAchievement, createExercise, createGoal, createPersonalSession, createRoutine, deleteAchievement, deleteExercise, deleteGoal, deleteRoutine, getAchievements, getAvailableSessions, getBill, getBills, getExercise, getExercises, getGoal, getGoals, getGroupSessions, getMemberInfo, getRegisteredSession, getRegisteredSessions, getRoutine, getRoutines, getTrainers, joinSession, payBill, unregisterSession, updateExercise, updateGoal, updateProfile, updateRoutine } from '../controllers/member.ts';

const router = express.Router();

router.post('/update-profile', updateProfile);
router.get('/profile', getMemberInfo);

router.get('/goals', getGoals);
router.get('/goal', getGoal);
router.post('/create-goal', createGoal);
router.post('/update-goal', updateGoal);
router.delete('/delete-goal', deleteGoal);

router.get('/achievements', getAchievements);
router.post('/create-achievement', createAchievement);
router.delete('/delete-achievement', deleteAchievement);

router.get('/exercises', getExercises);
router.get('/exercise', getExercise);
router.post('/create-exercise', createExercise);
router.post('/update-exercise', updateExercise);
router.delete('/delete-exercise', deleteExercise);

router.get('/routines', getRoutines);
router.get('/routine', getRoutine);
router.post('/create-routine', createRoutine);
router.post('/update-routine', updateRoutine);
router.delete('/delete-routine', deleteRoutine);

router.get('/sessions', getRegisteredSessions);
router.get('/session', getRegisteredSession);
router.get('/trainers', getTrainers);
router.get('/group-sessions', getGroupSessions);
router.post('/join-session', joinSession);
router.post('/create-session', createPersonalSession);
router.delete('/unregister-session', unregisterSession);

router.get('/bills', getBills);
router.get('/bill', getBill);
router.post('/pay-bill', payBill);

export default router;