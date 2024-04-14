import { Request, Response } from 'express';
import { sql } from '../db.ts';

export const register = async (req: Request, res: Response) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const password = req.body.password;
    const userType = req.body.type;

    console.log("[User] New user creation requested | ", username, password);
    const newUser = await sql`
      INSERT INTO users (username, password, registration_date, type)
        VALUES (${username}, ${ password}, now(), ${userType})

      RETURNING *
    `

    console.log(newUser);

    await addUserToCorrespondingTable(userType, newUser[0].user_id, firstName, lastName);

    console.log("[User] Creation request completed");
    // Adding the new user created to the correct table
    res.status(201).json({
      message: "User created!",
      userData: newUser,
    });

  } catch (err) {
    // if (err.code === "23505" && err.constraint_name === "students_email_key") {
      // res.status(409).send();
      console.log("ERROR OCCURED");
      console.log(err);
      res.json({
        info: err,
      })
    // }
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Checking for instances of this username
    const existingUser = await sql`
      SELECT user_id, password, type FROM users
        WHERE username = ${username}
    `

    // Checking if there was an instance
    if (existingUser.length == 0) {
      res.status(404).json({
        status: "Invalid"
      })

      throw "User does not exist";
    }

    // Checking if the entered password and the password stored in the database are equal
    if (password != existingUser[0].password) {
      res.status(401).json({
        status: "Failure"
      })
    }
    
    console.log("[User] Trying to log into user | ", existingUser[0]);

    // Finding the corresponding type id for the valid user (eg. member_id if they are a member type)
    const typeId = await getTypeId(existingUser[0].type, existingUser[0].user_id);

    res.status(201).json({
      status: "Success",
      id: typeId,
      type: existingUser[0].type
    })

    console.log("[User] Logged in as ", existingUser[0].username);
  } catch (err) {
    console.log("[User] Log in failed");
  }
}

/* Helper Functions */
const getTypeId = async (type: string, userId: string) => {
  switch (type) {
    case ("member"): {
      const data = await sql`
        SELECT member_id FROM members
          WHERE user_id = ${userId}
      `

      return data[0].member_id;
    }
    case ("trainer"): {
      const data = await sql`
        SELECT trainer_id FROM trainers
          WHERE user_id = ${userId}
      `

      return data[0].trainer_id;
    }
    case ("admin"): {
      return await sql`
        SELECT admin_id FROM admins
          WHERE user_id = ${userId}
      `
    }
  }
}

const addUserToCorrespondingTable = async (type: string, userId: string, firstName?: string , lastName?: string) => {
  switch (type) {
    case ("member"): {
      return await sql`
        INSERT INTO members (user_id, first_name, last_name)
          VALUES (${userId}, ${firstName || ''}, ${lastName || ''})

        RETURNING *
      `
    }
    case ("trainer"): {
      return await sql`
        INSERT INTO trainers (user_id, first_name, last_name)
          VALUES (${userId}, ${firstName || ''}, ${lastName || ''})

        RETURNING *
      `
    }
    case ("admin"): {
      return await sql`
        INSERT INTO admins (user_id)
          VALUES (${userId})

        RETURNING *
      `
    }
  }
}