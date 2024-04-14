import { Request, Response } from 'express';
import { sql } from '../db.ts';

/* Equipment Related */
export const getEquipment = async (req: Request, res: Response) => {
  try {
    if (!req.query.adminId) {
      throw "Missing adminId";
    }
    const adminId = String(req.query.adminId);

    const equipmentData = await sql`
      SELECT equipment.equipment_id, rooms.room_number, rooms.floor, equipment.name, equipment.serial_num, equipment.last_maintenance FROM equipment
        LEFT JOIN rooms ON rooms.room_id = equipment.room_id
        ORDER BY rooms.floor ASC, rooms.room_number ASC
    `

    // Building the response data
    const responseData = equipmentData.map(row => {
      return {
        equipmentId: row.equipment_id,
        roomNumber: `${row.floor}${String(row.room_number).padStart(2, '0')}`,
        name: row.name,
        serialNum: row.serial_num,
        lastMaintenance: row.last_maintenance,
      }
    })

    res.status(200).json({
      equipment: responseData,
    })
  } catch (err) {
    console.log(err);
  }
}

export const performMaintenance = async (req: Request, res: Response) => {
  try {
    const {equipmentId, date} = req.body;

    await sql`
      UPDATE equipment
        SET last_maintenance = ${date}
        WHERE equipment_id = ${equipmentId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err
    })
  }
}

/* Billing Related */
export const getBills = async (req: Request, res: Response) => {
  try {
    if (!req.query.adminId) {
      throw "Missing adminId";
    }
    const adminId = String(req.query.adminId);

    const billData = await sql`
      SELECT bills.bill_id, members.first_name, members.last_name, bills.charged_amount, bills.created_date, bills.paid, bills.paid_date FROM bills
        LEFT JOIN members ON members.member_id = bills.member_id
    `

    // Building the response data
    const responseData = billData.map(row => {
      return {
        billId: row.bill_id,
        memberName: `${row.first_name} ${row.last_name}`,
        charged: row.charged_amount,
        created: row.created_date,
        paidStatus: row.paid,
        paidOn: row.paid_date
      }
    })

    res.status(200).json({
      bills: responseData,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await sql`
      SELECT member_id, first_name, last_name FROM members
    `

    // Building the response data
    const responseData = members.map(row => {
      return {
        memberId: row.member_id,
        memberName: `${row.first_name} ${row.last_name}`
      }
    })

    res.status(200).json({
      members: responseData
    })
  } catch (err) {
    console.log(err)
  }
}

export const createBill = async (req: Request, res: Response) => {
  try {
    const {memberId, charge, created, paid} = req.body;

    console.log(req.body);

    const newBill = await sql`
      INSERT INTO bills (member_id, charged_amount, created_date, paid)
        VALUES (${memberId}, ${charge}, ${created}, ${paid})

      RETURNING *
    `

    res.status(201).json({
      message: "Bill created!",
      bill: newBill,
    })
  } catch (err) {
    console.log("ERROR OCCURED");
    console.log(err);
    res.json({
      info: err,
    })
  }
}

/* Session Related */
export const getSessions = async (req: Request, res: Response) => {
  try {

    const sessions = await sql`
      SELECT trainers.first_name, trainers.last_name, sessions.session_id, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM sessions
        LEFT JOIN trainers ON sessions.trainer_id = trainers.trainer_id
        LEFT JOIN bookings ON sessions.session_id = bookings.session_id
        WHERE bookings.room_id IS NULL
        ORDER BY session_date, sessions.start_time
    `

    // Constructing Response Data
    const responseData = sessions.map(session => {
      return {
        sessionId: session.session_id,
        trainerName: `${session.first_name} ${session.last_name}`,
        date: session.session_date,
        startTime: session.start_time,
        endTime: session.end_time,
        type: session.session_type,
      }
    })

    res.status(200).json({
      sessions: responseData,
    })
  } catch (err) {
    console.log(err)
  }
}

export const getSession = async (req: Request, res: Response) => {
  try {
    if (!req.query.sessionId) {
      throw "Missing adminId";
    }
    const sessionId = String(req.query.sessionId);

    const session = await sql`
      SELECT trainers.first_name, trainers.last_name, sessions.session_id, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM sessions
        LEFT JOIN trainers ON sessions.trainer_id = trainers.trainer_id
        WHERE session_id = ${sessionId}
    `

    res.status(200).json({
      session: {
        sessionId: session[0].session_id,
        trainerName: `${session[0].first_name} ${session[0].last_name}`,
        date: session[0].session_date,
        startTime: session[0].start_time,
        endTime: session[0].end_time,
        type: session[0].session_type,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export const deleteSession = async (req: Request, res: Response) => {
  try {
    if (!req.query.sessionId) {
      throw "Missing sessionId";
    }
    const sessionId = String(req.query.sessionId);

    // Delete from participants first
    await sql`
      DELETE FROM participants
        WHERE session_id = ${sessionId};
    `

    await sql`
      DELETE FROM sessions
          WHERE session_id = ${sessionId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

/* Room Booking Related */
export const getRoomBookings = async (req: Request, res: Response) => {
  try {

    const bookings = await sql`
      SELECT rooms.room_id, rooms.room_number, rooms.floor, trainers.first_name, trainers.last_name, sessions.session_id, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM rooms
        LEFT JOIN bookings ON rooms.room_id = bookings.room_id
        LEFT JOIN sessions ON sessions.session_id = bookings.session_id
        LEFT JOIN trainers ON trainers.trainer_id = sessions.trainer_id
        ORDER BY rooms.room_id, sessions.session_date, sessions.start_time
    `


    // Constructing Response Data
    const addedRooms = [];
    const responseData = [];
    bookings.forEach(booking => {
      if (addedRooms.indexOf(booking.room_id) == -1) {
        addedRooms.push(booking.room_id);

        if (booking.session_id == null) {
          responseData.push([
            {
              roomName: `${booking.floor}${String(booking.room_number).padStart(2, '0')}`
            },
          ])
        } else {
          responseData.push([
            {
              roomName: `${booking.floor}${String(booking.room_number).padStart(2, '0')}`
            },
            {
              sessionId: booking.session_id,
              trainerName: `${booking.first_name} ${booking.last_name}`,
              date: booking.session_date,
              startTime: booking.start_time,
              endTime: booking.end_time,
              type: booking.session_type,
            }
          ])
        }
      } else {
        responseData[addedRooms.indexOf(booking.room_id)].push(
          {
            sessionId: booking.session_id,
            trainerName: `${booking.first_name} ${booking.last_name}`,
            date: booking.session_date,
            startTime: booking.start_time,
            endTime: booking.end_time,
            type: booking.session_type,
          }
        )
      }
    })

    res.status(200).json({
      bookings: responseData,
    })
  } catch (err) {
    console.log(err)
  }
}

export const getRooms = async (req: Request, res: Response) => {
  try {

    const rooms = await sql`
      SELECT rooms.room_id, rooms.room_number, rooms.floor FROM rooms
    `

    const responseData = rooms.map(room => {
      return {
        roomId: room.room_id,
        roomNumber: `${room.floor}${String(room.room_number).padStart(2, '0')}`
      }
    })

    res.status(200).json({
      rooms: responseData,
    })
  } catch (err) {
    console.log(err)
  }
}

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {sessionId, roomId} = req.body;

    console.log(req.body);

    await sql`
      INSERT INTO bookings (session_id, room_id)
        VALUES (${sessionId}, ${roomId})
    `

    res.status(201).json({})
  } catch (err) {
    res.status(400).json({
      info: err,
    })
  }
} 

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    if (!req.query.sessionId) {
      throw "Missing sessionId";
    }
    const sessionId = String(req.query.sessionId);

    await sql`
      DELETE FROM bookings
        WHERE session_id = ${sessionId};
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}