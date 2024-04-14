--- Creating the base User table
CREATE TABLE IF NOT EXISTS Users  (
  user_id               SERIAL          PRIMARY KEY,
  username              VARCHAR(255)    UNIQUE NOT NULL,
  password              VARCHAR(255)    NOT NULL,
  registration_date     DATE,
  type                  VARCHAR(50)     NOT NULL -- Could add CHECK (type IN (...)) 
);

--- Creating the Member Table
CREATE TABLE IF NOT EXISTS Members (
  member_id             SERIAL          PRIMARY KEY,
  user_id               SERIAL          REFERENCES Users(user_id),
  first_name            VARCHAR(255)    NOT NULL,
  last_name             VARCHAR(255)    NOT NULL,
  current_weight        INT,
  avg_sleep             INT,
  body_fat_percentage   REAL
);

--- Creating the Trainer Table
CREATE TABLE IF NOT EXISTS Trainers (
  trainer_id            SERIAL          PRIMARY KEY,
  user_id               SERIAL          REFERENCES Users(user_id),
  first_name            VARCHAR(255)    NOT NULL,
  last_name             VARCHAR(255)    NOT NULL
);

--- Creating the Admin Table
CREATE TABLE IF NOT EXISTS Admins (
  admin_id              SERIAL          PRIMARY KEY,
  user_id               SERIAL          REFERENCES Users(user_id)
);

-- Creating the Fitness Goals Table for Members
CREATE TABLE IF NOT EXISTS Goals (
  goal_id               SERIAL          PRIMARY KEY,
  member_id             SERIAL          REFERENCES Members(member_id),
  description           TEXT          NOT NULL,
  weight                INT,
  duration              INT,
  achieve_by            DATE
);

--- Creating the Fitness Achievements Table for Members
---- Maybe we want to reference hte GOALS table for this?
CREATE TABLE IF NOT EXISTS Achievements (
  achievement_id        SERIAL          PRIMARY KEY,
  member_id             SERIAL          REFERENCES Members(member_id),
  description           TEXT            NOT NULL,
  achieved_date         DATE            NOT NULL
);

--- Creating the Exercises Table for Members
CREATE TABLE IF NOT EXISTS Exercises (
  exercise_id           SERIAL          PRIMARY KEY,
  member_id             SERIAL          REFERENCES Members(member_id),
  area_of_focus         VARCHAR(50)     NOT NULL,
  name                  TEXT            NOT NULL,
  reps                  INT,
  sets                  INT,
  weight                INT
);

--- Creating the Routines Table for Member (uses Exercises)
--- May want to add a primary key to this
CREATE TABLE IF NOT EXISTS Routines (
  routine_id            SERIAL          PRIMARY KEY,
  name                  VARCHAR(255)    NOT NULL,
  member_id             SERIAL          REFERENCES Members(member_id)
);

--- Creating intermediate table for Exercises inside Routines
CREATE TABLE IF NOT EXISTS ExerciseRoutines (
  routine_id            SERIAL          REFERENCES Routines(routine_id) ON DELETE CASCADE,
  exercise_id           SERIAL          REFERENCES Exercises(exercise_id) ON DELETE CASCADE
);

--- Creating the Available Schedule Table for Trainers
CREATE TABLE IF NOT EXISTS Schedules (
  schedule_id           SERIAL          PRIMARY KEY,
  trainer_id            SERIAL          REFERENCES Trainers(trainer_id),
  day                   TEXT            NOT NULL,
  start_time            TIME            NOT NULL,
  end_time              TIME            NOT NULL
);

--- Creating the Session Table
CREATE TABLE IF NOT EXISTS Sessions (
  session_id            SERIAL          PRIMARY KEY,
  trainer_id            SERIAL          REFERENCES Trainers(trainer_id),
  session_date          DATE            NOT NULL,
  start_time            TIME            NOT NULL,
  end_time              TIME            NOT NULL,
  session_type          VARCHAR(20)     NOT NULL
);

--- Creating the intermediate table for Members to join sessions
CREATE TABLE IF NOT EXISTS Participants (
  session_id            SERIAL          REFERENCES Sessions(session_id),
  member_id             SERIAL          REFERENCES Members(member_id)
);

--- Creating table for Rooms
CREATE TABLE IF NOT EXISTS Rooms (
  room_id               SERIAL          PRIMARY KEY,
  floor                 INT             NOT NULL,
  room_number           INT             NOT NULL
);

--- Creating intermediate table for Sessions booked in specific Rooms
CREATE TABLE IF NOT EXISTS Bookings (
  session_id            SERIAL          REFERENCES Sessions(session_id),
  room_id               SERIAL          REFERENCES Rooms(room_id)
);

--- Creating table for Equipment
CREATE TABLE IF NOT EXISTS Equipment (
  equipment_id          SERIAL          PRIMARY KEY,
  room_id               SERIAL          REFERENCES Rooms(room_id),
  name                  VARCHAR(255)    NOT NULL,
  serial_num            VARCHAR(12)     NOT NULL,
  last_maintenance      DATE            NOT NULL
);

--- Creating table for Billing
CREATE TABLE IF NOT EXISTS Bills (
  bill_id               SERIAL          PRIMARY KEY,
  member_id             SERIAL          REFERENCES Members(member_id),
  charged_amount        REAL            NOT NULL,
  created_date			    DATE			      NOT NULL,
  paid                  BOOLEAN         NOT NULL,
  paid_date             DATE
);