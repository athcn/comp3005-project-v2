import { Request, Response } from "express";
import { sql } from "../db";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const {floorId, roomNum} = req.body;

    const newRoom = await sql`
      INSERT INTO rooms (floor_id, room_num)
        VALUES (${floorId}, ${roomNum})
    `

    res.status(201).json({
      message: "Created room",
      roomData: newRoom,
    })
  } catch (err) {
    console.log(err);
  }
}

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await sql`
      SELECT * FROM rooms
    `

    res.status(200).json({
      rooms,
    })
  } catch (err) {
    console.log(err);
  }
}