--- Creating Users
INSERT INTO users (username, password, registration_date, type)
  VALUES 
    ('member1', '123', '2024-04-10', 'member'),
    ('trainer1', '123', '2024-04-09', 'trainer'),
    ('admin1', '123', '2024-01-01', 'admin'),
    ('member2', '123', '2024-03-10', 'member'),
    ('member3', '123', '2024-03-13', 'member'),
    ('member4', '123', '2024-03-21', 'member'),
    ('member5', '123', '2024-03-30', 'member'),
    ('trainer2', '123', '2024-04-11', 'trainer'),
    ('trainer3', '123', '2024-04-21', 'trainer'),
    ('trainer4', '123', '2024-04-29', 'trainer');

--- Adding members
INSERT INTO members (user_id, first_name, last_name, current_weight, avg_sleep, body_fat_percentage)
  VALUES
    (1, 'John', 'Doe', 60, 7, 25.3),
    (4, 'Jeff', 'Name', 65, 8, 30),
    (5, 'Jane', 'Doe', 60, 7, 25.3),
    (6, 'Ran', 'Dom', 77, 8, 29.2),
    (7, 'Us', 'er', 67, 8, 30.1);

--- Adding Trainers
INSERT INTO trainers (user_id, first_name, last_name)
  VALUES
    (2, 'Trainer', 'Joe'),
    (8, 'Trainer', 'Jenny'),
    (9, 'Trainer', 'Gen'),
    (10, 'Trainer', 'Kry');

--- Adding Admins
INSERT INTO admins (user_id)
  VALUES
    (3);

--- Adding Goals for Users
INSERT INTO goals (member_id, description, weight, duration, achieve_by)
  VALUES
    (1, 'Run', NULL, 30, NULL),
    (1, 'Bench Press', 150, NULL, '2024-05-15'),
    (1, 'Do 30 push ups in a row', NULL, NULL, '2024-05-01'),
    (2, 'Do 10 situps', NULL, NULL, '2024-04-25'),
    (2, 'Do 25 situps', NULL, NULL, '2024-04-30'),
    (3, 'Bench Press', 120, NULL, '2024-05-17'),
    (4, 'Do 12 chin ups', NULL, NULL, NULL),
    (5, 'Do 10 pull ups', NULL, NULL, '2024-06-17');

--- Creating Achievements
INSERT INTO achievements (member_id, description, achieved_date)
  VALUES
    (1, 'Run | 30 mins', '2024-04-11'),
    (1, 'Bench Press | 120 lbs', '2024-05-15'),
    (1, 'Do 15 push ups in a row', '2024-04-11'),
    (2, 'Do 5 situps', '2024-04-25'),
    (3, 'Bench Press | 100 lbs', '2024-05-17'),
    (4, 'Do 12 chin ups', '2024-05-17'),
    (5, 'Do 10 pull ups', '2024-06-17');

--- Creating Exercises
INSERT INTO exercises (member_id, area_of_focus, name, reps, sets, weight)
  VALUES
    (1, 'Upper Body', 'Pull up', 30, 3, NULL),
    (1, 'Upper Body', 'Bench Press', 5, 10, 150),
    (1, 'Core', 'Plank for 60 seconds', NULL, NULL, NULL),
    (1, 'Cardio', 'Jumping Jacks for 30 seconds', NULL, 3, NULL),
    (2, 'Lower Body', 'Squats', 12, 4, 50),
    (3, 'Upper Body', 'Dumbbell Shoulder Press', 10, 3, 20),
    (4, 'Core', 'Plank for 60 seconds', NULL, 3, NULL),
    (5, 'Flexibility', 'Shoulder stretch for 30 seconds each arm', NULL, 3, NULL);

--- Creating Routines
INSERT INTO routines (name, member_id)
  VALUES
    ('General', 1),
    ('Upper & Core', 1),
    ('Lower', 2),
    ('Upper', 3),
    ('Core', 4),
    ('Flexibility', 5);

--- Assigning exercises to routines
INSERT INTO exerciseroutines (routine_id, exercise_id)
  VALUES
  (1, 4),
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 2),
  (2, 3),
  (3, 5),
  (4, 6),
  (5, 7),
  (6, 8);

--- Creating the Available Schedule Table for Trainers
INSERT INTO schedules (trainer_id, day, start_time, end_time)
  VALUES 
    (1, 'Sunday', '10:00', '16:00'),
    (1, 'Monday', '09:00', '15:00'),
    (1, 'Tuesday', '12:00', '17:00'),
    (1, 'Wednesday', '09:00', '20:00'),
    (1, 'Thursday', '11:00', '16:00'),
    (1, 'Friday', '09:00', '13:00'),
    (1, 'Saturday', '10:00', '16:00'),
    (2, 'Sunday', '11:00', '14:00'),
    (2, 'Tuesday', '12:30', '17:00'),
    (2, 'Friday', '13:00', '17:00'),
    (3, 'Sunday', '09:30', '14:30'),
    (4, 'Monday', '09:00', '14:00'),
    (4, 'Sunday', '11:00', '13:00');

--- Creating the Session Table
INSERT INTO sessions (trainer_id, session_date, start_time, end_time, session_type)
  VALUES
    (1, '2024-04-15', '09:00', '10:00', 'group'),
    (1, '2024-04-18', '12:00', '14:00', 'personal'),
    (1, '2024-04-19', '10:00', '11:30', 'group'),
    (2, '2024-04-15', '12:30', '13:30', 'personal'),
    (2, '2024-04-23', '12:30', '14:30', 'group'),
    (3, '2024-04-21', '11:00', '13:00', 'personal'),
    (4, '2024-04-15', '11:00', '13:00', 'group');

--- Creating the intermediate table for Members to join sessions
INSERT INTO participants (session_id, member_id)
  VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 2),
    (3, 4),
    (3, 1),
    (4, 1),
    (5, 3),
    (5, 2);

--- Creating rooms in centre
INSERT INTO rooms (floor, room_number)
  VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 3);

--- Creating bookings for sessions
INSERT INTO bookings (session_id, room_id)
  VALUES 
    (1, 2),
    (2, 1),
    (3, 1),
    (4, 3),
    (5, 5),
    (6, 1);

--- Creating equipment
INSERT INTO equipment (room_id, name, serial_num, last_maintenance)
  VALUES
    (1, 'Treadmill', 'ABX-9843-RPQ', '2024-02-29'),
    (1, 'Stationary Bike', 'ZKJ-7652-MNX', '2024-03-18'),
    (1, 'Rowing Machine', 'FGH-1029-LQR', '2024-03-20'),
    (2, 'Smith Machine', 'WOP-5436-THB', '2024-03-22'),
    (2, 'Chest Press Machine', 'YUR-8791-QWE', '2024-03-24'),
    (2, 'Should Press Machine', 'PLM-4268-VTZ', '2024-03-26'),
    (3, 'Leg Press Machine', 'CXS-3095-KDI', '2024-03-28'),
    (3, 'Lat Pulldown Machine', 'JHN-6541-OSA', '2024-03-30'),
    (4, 'Treadmill', 'LQW-7823-NMF', '2024-04-01'),
    (4, 'Stationary Bike', 'VBD-1674-ULK', '2024-04-03'),
    (4, 'Rowing Machine', 'RST-5482-POM', '2024-04-05'),
    (5, 'Smith Machine', 'OPQ-2369-XZC', '2024-04-07'),
    (5, 'Chest Press Machine', 'MNB-4193-WER', '2024-04-09'),
    (5, 'Should Press Machine', 'DFI-7852-HJK', '2024-04-11'),
    (6, 'Leg Press Machine', 'TYU-3021-GVA', '2024-04-13'),
    (6, 'Lat Pulldown Machine', 'ERT-6487-SCN', '2024-04-15');

--- Creating bills
INSERT INTO bills (member_id, charged_amount, created_date, paid, paid_date)
  VALUES
    (1, 100.5, '2024-04-10', false, NULL),
    (1, 63, '2024-03-10', true, '2024-03-15'),
    (1, 70, '2024-02-10', true, '2024-03-01'),
    (2, 67, '2024-03-13', false, NULL),
    (3, 35, '2024-02-10', true, '2024-03-01'),
    (4, 78, '2024-02-12', true, '2024-02-16'),
    (5, 65, '2024-02-11', true, '2024-02-19');