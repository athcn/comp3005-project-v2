## Final Project - Version 2
**Student Name:** Young-hoon Kim

**Student ID:** 101286836

Youtube Link to [Video](https://youtu.be/J8lQTiFMlXg)

### Setup
---
1. Download [NodeJS](https://nodejs.org/en/download/current) as this is required to run the application (It should also install `npm` with it)
2. `cd webapp` and run `npm install` to download the required packages
3. You will want to create a `.env` file in the root `webapp` directory with the following content
```
# Database Setup
POSTGRES_HOST='localhost'    # Postgres ip address[es] or domain name[s]
POSTGRES_PORT='5432'         # Postgres server port[s]
DATABASE_NAME='health-and-fitness'     # Name of database to connect to
DATABASE_USERNAME='postgres' # Username of database user
DATABASE_PASSWORD='' # Password of database user 

# Server & Client Setup
SERVER_PORT='3000' # Port that the server will be listening on
CLIENT_PORT='3001' # Port that the client will be listening on
```
> Note: If you change the `SERVER_PORT` from `3000` make sure to also change it in `useRestApi.ts` located in the `webapp/src/sharedHooks` directory

4. Create the neccessary database (default is `health-and-fitness` but can be changed above)
5. Using **pgAdmin 4** run the `ddl.sql` file to create the required tables and then run `dml.sql` to create the example data
6. To run the app simply run `npm run dev` in the `webapp` directory and on your web browser navigate to [http://localhost:3001/](http://localhost:3001/)

All accounts are using `123` as their "password" (very secure) so here is the list of all the usernames
>Note: for the sake of simplicity the users with the labels `1` have the more data to try out
```
- MEMBER ACCOUNTS -
member1
member2
member3
member4
member5
- TRAINER ACCOUNTS -
trainer1
trainer2
trainer3
trainer4
- ADMIN ACCOUNTS -
admin1
```
---
### Information about Project
This is a health and fitness web application that can run locally on your computer! Designed to track people's health but also as a management tool for organizing sessions and billing.

This was implemented using NodeJS with a [React/Vite](https://vitejs.dev/guide/) frontend and an [ExpressJS](https://expressjs.com/) server running as the backend using [`postgresjs`](https://github.com/porsager/postgres) as the library for the backend to talk to the relational database.

The UI is using [`React Bootstrap`](https://react-bootstrap.netlify.app/) as a framework to build it quicker, it is the same as Bootstrap but built into the component style that React tends to use.

**File Structure**
- `documentation` holds the diagrams
- `SQL` holds the `.sql` files
- `webapp` holds the implementation of the project as a Web application 

>Note: There may appear to be many errors in the project from VS code's perspective. This is due to this project being built in **TypeScript** and it does not like using **any** or implicit **any**

#### Assumptions
- **Members** are able to create 1:1 personal sessions with the Trainer using their available time
- **Trainers** and **Admins** are able to create group sessions based on availability time
- **Routine** can consist of **Exercises** 
    - **Exercises** have five focuses on the body, Upper, Lower, Core, Cardio, and Flexibility
- **Trainer** can view the **Member**s goals & health stats
- **Equipment** is already in place and does not need to be moved or added but simply watched
- **Billing/Payment** is just sending a required amount to pay to the members that they can pay using fake credit card info (no 3rd party payment implemented)
- **Admin**s are able to cancel any type of session (ie group or personal)
- **Admin**s are the ones that can assign rooms to different sessions (room booking)

#### Bonus Features
- Billing Timeline for Members (can view previously paid bills)
- Billing Overview for Admin (can generate bills but can also see the status of each bill
previously sent)
- Timetable visual for Trainers (can view a table on their overview of what they have allotted for
their available times)
- All creation/update actions are done through Modal views rather than another page
- Added passwords for login/authentication (using just normal non-hashed passwords though)
