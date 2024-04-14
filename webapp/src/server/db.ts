import 'dotenv/config';
/* Using Postgres.js library from https://github.com/porsager/postgres */
import postgres from 'postgres';

// console.log(process.env.POSTGRES_HOST)

/* Change these contents to reroute the postgres connection*/
const postgresUrl = {
  host                 : process.env.POSTGRES_HOST,     // Postgres ip address[es] or domain name[s]
  port                 : process.env.POSTGRES_PORT,     // Postgres server port[s]
  database             : process.env.DATABASE_NAME,     // Name of database to connect to
  username             : process.env.DATABASE_USERNAME, // Username of database user
  password             : process.env.DATABASE_PASSWORD, // Password of database user 
}


export const sql = postgres(`postgres://${postgresUrl.username}:${postgresUrl.password}@${postgresUrl.host}:${postgresUrl.port}/${postgresUrl.database}`);

// export const sql = "Hello";