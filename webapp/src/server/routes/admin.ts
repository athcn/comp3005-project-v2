import express from 'express';
import { createBill, createBooking, deleteBooking, deleteSession, getBills, getEquipment, getMembers, getRoomBookings, getRooms, getSession, getSessions, performMaintenance } from '../controllers/admin.ts';

const router = express.Router();

router.get('/equipment', getEquipment);
router.post('/equipment-maintenance', performMaintenance);

router.get('/billing', getBills);
router.get('/members', getMembers);
router.post('/create-bill', createBill)

router.get('/sessions', getSessions);
router.get('/session', getSession);
router.delete('/delete-session', deleteSession);

router.get('/room-bookings', getRoomBookings);
router.get('/rooms', getRooms);
router.post('/create-booking', createBooking);
router.delete('/delete-booking', deleteBooking);

export default router;