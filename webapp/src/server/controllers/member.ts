import { Request, Response } from 'express';
import { sql } from '../db.ts';

/* Profile Related */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {userId, firstName, lastName, currentWeight, avgSleep, bodyFatPercentage} = req.body;

    console.log("[Member] Updating profile...");

    if (!firstName || !lastName) {
      throw "Empty first or last name";
    }

    const updateProfile = await sql`
      UPDATE members
        SET first_name = ${firstName}, last_name=${lastName}, current_weight = ${currentWeight}, avg_sleep = ${avgSleep}, body_fat_percentage = ${bodyFatPercentage}
        WHERE member_id = ${userId}

      RETURNING first_name, last_name, current_weight, avg_sleep, body_fat_percentage
    `

    res.status(204).json({
      message: "Profile updated",
      profile: updateProfile,
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err
    })
  }
}

export const getMemberInfo = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);

    const memberData = await sql`
      SELECT first_name, last_name, current_weight, avg_sleep, body_fat_percentage FROM members
        WHERE member_id = ${userId}
        LIMIT 1
    `

    res.status(200).json({
      firstName: memberData[0].first_name,
      lastName: memberData[0].last_name,
      currentWeight: memberData[0].current_weight,
      avgSleep: memberData[0].avg_sleep,
      bodyFatPercentage: memberData[0].body_fat_percentage,
    })
  } catch (err) {
    console.log(err);
  }
}

/* Fitness Goal Related */
export const createGoal = async (req: Request, res: Response) => {
  try {
    const {memberId, description, weight, duration, achieveBy} = req.body;

    console.log("[Goals] New goal creation requested | ", description);

    const newGoal = await sql`
      INSERT INTO goals (member_id, description, weight, duration, achieve_by)
        VALUES (${memberId}, ${description}, ${weight}, ${duration}, ${achieveBy})

      RETURNING *
    `

    res.status(201).json({
      message: "Goal created!",
      goalData: newGoal,
    })
  } catch (err) {
    console.log("ERROR OCCURED");
    console.log(err);
    res.json({
      info: err,
    })
  }
}

export const getGoals = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);

    console.log("[Goals] Getting goals");

    const userGoals = await sql`
      SELECT goal_id, description, weight, duration, achieve_by FROM goals
        WHERE member_id = ${userId}
    `

    res.status(200).json({
      goals: userGoals
    })
  } catch (err) {
    console.log("[Goals] Failed to retrieve goals, ", err);
  }
}

export const getGoal = async (req: Request, res: Response) => {
  try {
    if (!req.query.goalId) {
      throw "Missing goalId";
    }
    const goalId = String(req.query.goalId);

    console.log("[Goals] Getting goal ", goalId);

    const goal = await sql`
      SELECT goal_id, description, weight, duration, achieve_by FROM goals
        WHERE goal_id = ${goalId}
    `

    res.status(200).json({
      goalId: goal[0].goal_id,
      description: goal[0].description,
      weight: goal[0].weight,
      duration: goal[0].duration,
      achieveBy: goal[0].achieveBy
    })
  } catch (err) {
    console.log("[Goals] Failed to retrieve goal, ", err);
  }
}

export const deleteGoal = async (req: Request, res: Response) => {
  try {
    if (!req.query.goalId) {
      throw "Missing goalId";
    }
    const goalId = String(req.query.goalId);

    console.log("[Goals] Deleting goal | ", goalId);

    await sql`
      DELETE FROM goals
        WHERE goal_id = ${goalId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

export const updateGoal = async (req: Request, res: Response) => {
  try {
    const {goalId, description, weight, duration, achieveBy} = req.body;

    console.log("[Goals] Updating goal...", req.body);

    await sql`
      UPDATE goals
        SET description = ${description}, weight = ${weight}, duration = ${duration}, achieve_by = ${achieveBy}
        WHERE goal_id = ${goalId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
}

/* Achievement Related */
export const createAchievement = async (req: Request, res: Response) => {
  try {
    const {userId, goalId, achievedDate} = req.body;

    console.log("getting goal", req.body);
    const goal = await sql`
      SELECT description, weight, duration FROM goals
        WHERE goal_id = ${goalId} AND member_id = ${userId}
    `

    const desc = `${goal[0].description} ${goal[0].weight ? `| ${goal[0].weight} lbs` : ""} ${goal[0].duration ? `| ${goal[0].duration} mins` : ""} `;

    console.log("creating achievement")
    const newAchievement = await sql`
      INSERT INTO achievements (member_id, description, achieved_date)
        VALUES (${userId}, ${desc}, ${achievedDate})
    `

    // Deleting the goal now
    await sql`
      DELETE FROM goals
        WHERE goal_id = ${goalId}
    `

    res.status(201).json({
      message: "Achievement created",
      achievementData: newAchievement,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getAchievements = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId"
    }

    const userId = String(req.query.userId);

    const userAchievements = await sql`
      SELECT * FROM achievements
        WHERE member_id = ${userId}
    `

    res.status(200).json({
      achievements: userAchievements
    })
  } catch (err) {
    console.log(err);
  }
}

export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    if (!req.query.achievementId) {
      throw "Missing achievementId";
    }
    const achievementId = String(req.query.achievementId);

    console.log("[Achievement] Deleting achievement | ", achievementId);

    await sql`
      DELETE FROM achievements
        WHERE achievement_id = ${achievementId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

/* Exercise & Routine Related */
export const createExercise = async (req: Request, res: Response) => {
  try {
    const {memberId, areaOfFocus, name, reps, sets, weight} = req.body;

    const newExercise = await sql`
      INSERT INTO exercises (member_id, area_of_focus, name, reps, sets, weight)
        VALUES (${memberId}, ${areaOfFocus}, ${name}, ${reps}, ${sets}, ${weight})
    `

    res.status(201).json({
      message: "Exercise created",
      exerciseData: newExercise,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getExercises = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);
    
    const userExercises = await sql`
      SELECT exercise_id, area_of_focus, name, reps, sets, weight FROM exercises
        WHERE member_id = ${userId}
    `

    res.status(200).json({
      exercises: userExercises
    })
  } catch (err) {
    console.log(err);
  }
}

export const getExercise = async (req: Request, res: Response) => {
  try {
    if (!req.query.exerciseId) {
      throw "Missing exerciseId";
    }
    const exerciseId = String(req.query.exerciseId);

    console.log("[Exercise] Getting exercise ", exerciseId);

    const exercise = await sql`
      SELECT exercise_id, area_of_focus, name, reps, sets, weight FROM exercises
        WHERE exercise_id = ${exerciseId}
    `

    res.status(200).json({
      exerciseId: exercise[0].exercise_id,
      areaOfFocus: exercise[0].area_of_focus,
      name: exercise[0].name,
      reps: exercise[0].reps,
      sets: exercise[0].sets,
      weight: exercise[0].weight
    })
  } catch (err) {
    console.log("[Goals] Failed to retrieve goal, ", err);
  }
}

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    if (!req.query.exerciseId) {
      throw "Missing exerciseId";
    }
    const exerciseId = String(req.query.exerciseId);

    console.log("[Exercise] Deleting exercise | ", exerciseId);

    await sql`
      DELETE FROM exercises
        WHERE exercise_id = ${exerciseId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const {exerciseId, areaOfFocus, name, reps, sets, weight} = req.body;

    console.log("[Exercise] Updating exercise...", req.body);

    await sql`
      UPDATE exercises
        SET area_of_focus = ${areaOfFocus}, name = ${name}, reps = ${reps}, sets = ${sets}, weight = ${weight}
        WHERE exercise_id = ${exerciseId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
}

export const createRoutine = async (req: Request, res: Response) => {
  try {
    const {memberId, name, exerciseIds} = req.body;


    const newRoutine = await sql`
      INSERT INTO routines (member_id, name)
        VALUES (${memberId}, ${name})
      
      RETURNING routine_id
    `

    for (const exerciseId of exerciseIds) {
      await sql`
        INSERT INTO exerciseroutines (routine_id, exercise_id)
          VALUES (${newRoutine[0].routine_id}, ${exerciseId})
      `
    }

    res.status(201).json({
      message: "Routine created",
    })
  } catch (err) {
    console.log(err);
  }
}

export const getRoutines = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);

    const userRoutines = await sql`
      SELECT routines.routine_id, routines.name as routine_name, exercises.area_of_focus, exercises.name, exercises.reps, exercises.sets, exercises.weight FROM routines
        LEFT JOIN exerciseroutines ON routines.routine_id = exerciseroutines.routine_id
        LEFT JOIN exercises ON exerciseroutines.exercise_id = exercises.exercise_id
        WHERE routines.member_id = ${userId}
    `

    const addedRoutineIds: string[] = [];
    // Building Routines for frontend
    let routines = userRoutines.map(routineRow => {
      if (addedRoutineIds.some(value => value === routineRow.routine_id) === false) {
        // Loop through the routine rows to find all exercises tied to this routine
        addedRoutineIds.push(routineRow.routine_id);
        const exercises = userRoutines.filter(row => {
          if (row.routine_id === routineRow.routine_id) {
            return true;
          }
          return false;
        }).map(row => {
          return {
            areaOfFocus: row.area_of_focus,
            name: row.name,
            reps: row.reps,
            sets: row.sets,
            weight: row.weight
          }
        })
        return {
          routineId: routineRow.routine_id,
          routineName: routineRow.routine_name,
          exercises
        }
      }
      return null;
    })

    // Cleaning up the null values
    routines = routines.filter(routine => {
      if (routine === null) {
        return false;
      }
      return true;
    })

    res.status(200).json({
      routines
    })
  } catch (err) {
    console.log(err);
  }
}

export const getRoutine = async (req: Request, res: Response) => {
  try {
    if (!req.query.routineId) {
      throw "Missing routineId";
    }
    const routineId = String(req.query.routineId);

    console.log("[Exercise] Getting routineId ", routineId);

    // Grabbing the routine
    const returnedRoutines = await sql`
      SELECT routines.routine_id, routines.name AS routine_name, exercises.exercise_id, exercises.area_of_focus, exercises.name, exercises.reps, exercises.sets, exercises.weight FROM routines
        LEFT JOIN exerciseroutines ON routines.routine_id = exerciseroutines.routine_id
        LEFT JOIN exercises ON exerciseroutines.exercise_id = exercises.exercise_id
        WHERE routines.routine_id = ${routineId}
    `

    // Grabbing the exercises that were not in the routine
    const unusedExercises = await sql`
      SELECT DISTINCT ON (exercises.exercise_id) exercises.exercise_id, exercises.area_of_focus, exercises.name, exercises.reps, exercises.sets, exercises.weight FROM exercises
          LEFT JOIN exerciseroutines ON exercises.exercise_id = exerciseroutines.exercise_id
          WHERE exerciseroutines.exercise_id NOT IN (SELECT exercise_id FROM exerciseroutines WHERE routine_id = ${routineId})
    `
    

    // Building Routines for frontend
    const usedExercises = returnedRoutines.map(row => {
      return {
        exerciseId: row.exercise_id,
        areaOfFocus: row.area_of_focus,
        name: row.name,
        reps: row.reps,
        sets: row.sets,
        weight: row.weight
      }
    })

    res.status(200).json({
      routineId,
      routineName: returnedRoutines[0].routine_name,
      exercises: usedExercises,
      unusedExercises
    })
  } catch (err) {
    console.log("[Routine] Failed to retrieve routine, ", err);
  }
}

export const deleteRoutine = async (req: Request, res: Response) => {
  try {
    if (!req.query.routineId) {
      throw "Missing routineId";
    }
    const routineId = String(req.query.routineId);

    console.log("[Routine] Deleting routine | ", routineId);

    await sql`
      DELETE FROM routines
        WHERE routine_id = ${routineId};
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

export const updateRoutine = async (req: Request, res: Response) => {
  try {
    const {routineId, name, exerciseIds} = req.body;

    await sql`
      UPDATE routines 
        SET name = ${name}
        WHERE routine_id = ${routineId}
    `

    // TODO: Make more efficient
    await sql`
      DELETE FROM exerciseroutines
        WHERE routine_id = ${routineId}
    `

    for (const exerciseId of exerciseIds) {
      await sql`
        INSERT INTO exerciseroutines (routine_id, exercise_id)
          VALUES (${routineId}, ${exerciseId})
      `
    }

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
}

/* Session Related */
export const getRegisteredSessions = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);

    const sessions = await sql`
    SELECT DISTINCT(sessions.session_id), trainers.first_name, trainers.last_name, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM sessions
      LEFT JOIN participants ON participants.session_id = sessions.session_id
      LEFT JOIN trainers on trainers.trainer_id = sessions.trainer_id
      WHERE participants.member_id = ${userId}
      ORDER BY sessions.session_date
    `

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
    console.log(err);
  }
}

export const getRegisteredSession = async (req: Request, res: Response) => {
  try {
    if (!req.query.sessionId) {
      throw "Missing userId";
    }
    const sessionId = String(req.query.sessionId);

    const session = await sql`
    SELECT DISTINCT(sessions.session_id), trainers.trainer_id, trainers.first_name, trainers.last_name, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM sessions
      LEFT JOIN participants ON participants.session_id = sessions.session_id
      LEFT JOIN trainers on trainers.trainer_id = sessions.trainer_id
      WHERE sessions.session_id = ${sessionId} AND sessions.session_type = 'personal'
    `


    res.status(200).json({
      session: {
        sessionId: session[0].session_id,
        trainerId: session[0].trainer_id,
        trainerName: `${session[0].first_name} ${session[0].last_name}`,
        date: session[0].session_date,
        startTime: session[0].start_time,
        endTime: session[0].end_time,
        type: session[0].session_type,
      }
    })
  } catch (err) {
    console.log(err);
  }
}

export const getTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await sql`
      SELECT trainer_id, first_name, last_name FROM trainers
    `

    const responseData = trainers.map(trainer => {
      return {
        trainerId: trainer.trainer_id,
        trainerName: `${trainer.first_name} ${trainer.last_name}`,
      }
    })

    res.status(200).json({
      trainers: responseData,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getGroupSessions = async (req: Request, res: Response) => {
  try {
    if (!req.query.userId) {
      throw "Missing userId";
    }
    const userId = String(req.query.userId);

    const groupSessions = await sql`
      SELECT DISTINCT (sessions.session_id), trainers.first_name, trainers.last_name, sessions.session_date, sessions.start_time, sessions.end_time, sessions.session_type FROM sessions
        LEFT JOIN trainers ON trainers.trainer_id = sessions.session_id
        LEFT JOIN participants ON participants.session_id = sessions.session_id
        WHERE session_type = 'group' AND session_date >= ${sql`now()`} AND sessions.session_id NOT IN (
          SELECT DISTINCT(s.session_id) FROM sessions AS s
            LEFT JOIN participants AS p ON p.session_id = s.session_id
            WHERE p.member_id = ${userId}
        )
        ORDER BY session_date
    `

    const responseData = groupSessions.map(session => {
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
    console.log(err);
  }
}

export const joinSession = async (req: Request, res: Response) => {
  try {
    const {userId, sessionId} = req.body;

    const newParticipant = await sql`
      INSERT INTO participants (session_id, member_id)
        VALUES (${sessionId}, ${userId})
    `

    res.status(201).json({
      message: "Participant created",
      participantData: newParticipant,
    })
  } catch (err) {
    console.log(err);
  }
}

export const createPersonalSession = async (req: Request, res: Response) => {
  try {
    const {trainerId, memberId, date, startTime, endTime, type} = req.body;

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

    // Inserting member as personal session participant
    await sql`
      INSERT INTO participants (session_id, member_id)
        VALUES (${sessionId}, ${memberId})
    `

    res.status(201).json({
      message: "Session created",
      sessionData: newSession,
      // booking: newRoomBooking,
    })
  } catch (err) {
    console.log(err);
  }
}

export const unregisterSession = async (req: Request, res: Response) => {
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

    // Check if the session was personal if so delete on the sessions table
    const session = await sql`
      SELECT session_type FROM sessions
        WHERE session_id = ${sessionId}
    `

    if (session[0].session_type == "personal") {
      await sql`
        DELETE FROM sessions
          WHERE session_id = ${sessionId}
      `
    }

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

/* Billing Related */
export const getBills = async (req: Request, res: Response) => {
  try {
    if (!req.query.memberId) {
      throw "Missing memberId";
    }
    const memberId = String(req.query.memberId);

    const billData = await sql`
      SELECT bills.bill_id, bills.charged_amount, bills.created_date, bills.paid, bills.paid_date FROM bills
        LEFT JOIN members ON members.member_id = bills.member_id
        WHERE bills.member_id = ${memberId}
        ORDER BY bills.created_date
    `

    // Building the response data
    const responseData = billData.map(row => {
      return {
        billId: row.bill_id,
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

export const getBill = async (req: Request, res: Response) => {
  try {
    if (!req.query.billId) {
      throw "Missing billId";
    }
    const billId = String(req.query.billId);

    const billData = await sql`
      SELECT bill_id, charged_amount, created_date FROM bills
        WHERE bill_id = ${billId}
    `

    res.status(200).json({
      billId: billData[0].bill_id,
      charged: billData[0].charged_amount,
      created: billData[0].created_date
    })
  } catch (err) {
    console.log(err);
  }
}

export const payBill = async (req: Request, res: Response) => {
  try {
    const {billId, paidOn} = req.body;

    await sql`
      UPDATE bills 
        SET paid = true, paid_date = ${paidOn}
        WHERE bill_id = ${billId}
    `

    res.status(204).json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
}