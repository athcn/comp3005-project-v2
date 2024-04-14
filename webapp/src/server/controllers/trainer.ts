import { Request, Response } from 'express';
import { sql } from '../db.ts';

/* Schedule Timetable Related */
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const {trainerId, day, startingTime, endingTime} = req.body;


    console.log(req.body);

    const newSchedule = await sql`
      INSERT INTO schedules (trainer_id, day, start_time, end_time)
        VALUES (${trainerId}, ${day}, ${startingTime}, ${endingTime})
    `

    res.status(201).json({
      message: "Schedule created",
      scheduleData: newSchedule,
    });
  } catch (err) {
    console.log(err);
  }
}

export const getSchedules = async (req: Request, res: Response) => {
  try {
    if (!req.query.trainerId) {
      throw "Missing userId";
    }
    const trainerId = String(req.query.trainerId);

    // Finding all the schedules
    const schedules = await sql`
      SELECT * FROM schedules
        WHERE trainer_id = ${trainerId}
        ORDER BY day
    `

    // Categorizing into days of the week
    const organizedSchedule: any = [[], [], [], [], [], [], []];

    schedules.map(schedule => {
      switch (schedule.day) {
        case ("Sunday"): {
          organizedSchedule[0].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Monday"): {
          organizedSchedule[1].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Tuesday"): {
          organizedSchedule[2].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Wednesday"): {
          organizedSchedule[3].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Thursday"): {
          organizedSchedule[4].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Friday"): {
          organizedSchedule[5].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
        case ("Saturday"): {
          organizedSchedule[6].push({
              startTime: schedule.start_time,
              endTime: schedule.end_time,
          })
          break;
        }
      }
    })

    res.status(200).json({
      schedules: organizedSchedule
    })
  } catch (err) {
    console.log(err);
  }
}

// export const getSchedule = async (req: Request, res: Response) => {} 

/* Session Related */
export const createSession = async (req: Request, res: Response) => {
  try {
    const {trainerId, date, startTime, endTime, type} = req.body;

    const newSession = await sql`
      INSERT INTO sessions (trainer_id, session_date, start_time, end_time, session_type)
        VALUES (${trainerId}, ${date}, ${startTime}, ${endTime}, ${type})

      RETURNING *
    `

    const sessionId = newSession[0].session_id;

    // // Creating a room booking for this session
    // const newRoomBooking = await sql`
    //   INSERT INTO booking (session_id, room_id)
    //     VALUES (${sessionId}, ${roomId});
    // `

    res.status(201).json({
      message: "Session created",
      sessionData: newSession,
      // booking: newRoomBooking,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getSessions = async (req: Request, res: Response) => {
  try {
    if (!req.query.trainerId) {
      throw "Missing userId";
    }
    const trainerId = String(req.query.trainerId);

    const sessions = await sql`
      SELECT session_id, session_date, start_time, end_time, session_type FROM sessions
        WHERE trainer_id = ${trainerId}
        ORDER BY session_date
    `

    // Constructing Response Data
    const responseData = sessions.map(session => {
      return {
        sessionId: session.session_id,
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

// Member Related
export const getMembers = async (req: Request, res: Response) => {
  try {
    const firstName = String(req.query.firstName).toLowerCase();
    const lastName = String(req.query.lastName).toLowerCase();

    if (firstName != "" || lastName != "") {
      let members;

      if (firstName != "" && lastName != "") {
        members = await sql`
          SELECT member_id, first_name, last_name, current_weight, body_fat_percentage FROM members
            WHERE 
              (LOWER(first_name) LIKE ${'%' + firstName + '%'} AND LOWER(last_name) LIKE ${'%' + lastName + '%'})
        ` 
      } else if (firstName != "") {
        console.log('triggered here');
        members = await sql`
          SELECT member_id, first_name, last_name, current_weight, body_fat_percentage FROM members
            WHERE LOWER(first_name) LIKE ${'%' + firstName + '%'}
        ` 
      } else {
        members = await sql`
          SELECT member_id, first_name, last_name, current_weight, body_fat_percentage FROM members
            WHERE LOWER(last_name) LIKE ${'%' + lastName + '%'}
        `
      }
      res.status(200).json({
        members,
      })
      
    } else {
      const members = await sql`
        SELECT member_id, first_name, last_name, current_weight, body_fat_percentage FROM members
      `

      res.status(200).json({
        members,
      })
    }
  } catch (err) {
    console.log(err)
  }
}