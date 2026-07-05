import { pool } from "./database.js";
import "./dotenv.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";

const currentPath = fileURLToPath(import.meta.url);

const tripsFile = fs.readFileSync(path.join(dirname(currentPath), "data/data.json"));

const tripsData = JSON.parse(tripsFile); //parses tripsfile data

const destinationsFile = fs.readFileSync(path.join(dirname(currentPath), "data/destinations.json"));

const destinationsData = JSON.parse(destinationsFile); //parses destinations data

const createTripsTable = async () => {
  const createTripsTableQuery = `
        DROP TABLE IF EXISTS trips CASCADE;

        CREATE TABLE IF NOT EXISTS trips (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            img_url text NOT NULL,
            num_days integer NOT NULL,
            start_date date NOT NULL,
            end_date date NOT NULL,
            total_cost money NOT NULL
        )
    `;
  try {
    const res = await pool.query(createTripsTableQuery);
    console.log("🎉 trips table created successfully");
  } catch (err) {
    console.error("⚠️ error creating trips table", err);
  }
};

const seedTripsTable = async () => {
  await createTripsTable();
  for (const trip of tripsData) {
    const insertQuery = `INSERT INTO trips(title, description, img_url, num_days, start_date, end_date, total_cost) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    const values = [
      trip.title,
      trip.description,
      trip.img_url,
      trip.num_days,
      trip.start_date,
      trip.end_date,
      trip.total_cost,
    ];
    try {
      await pool.query(insertQuery, values);
      console.log(`✅ ${trip.title} added successfully`);
    } catch (err) {
      console.error("⚠️ error inserting trip", err);
    }
  }
};

//create destination table

const createDestinationsTable = async () => {
    const createDestinationsTableQuery = `
        DROP TABLE IF EXISTS destinations CASCADE;

        CREATE TABLE IF NOT EXISTS destinations (
            id serial PRIMARY KEY,
            destination varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            city varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            flag_img_url text NOT NULL
        )
    `
    try {
        const res = await pool.query(createDestinationsTableQuery)
        console.log(`✅ destinations table created successfully`)
    }catch(err){
        console.error(`⚠️ error creating destinations table`, err)
    }

}

const seedDestinationsTable = async () => {
    await createDestinationsTable()
    for (const destination of destinationsData) {
        const insertQuery = `INSERT INTO destinations(destination, description, city, country, img_url, flag_img_url) VALUES($1, $2, $3, $4, $5, $6)`
        const values = [
            destination.destination,
            destination.description,
            destination.city,
            destination.country,
            destination.img_url,
            destination.flag_img_url,
        ]
        try {
            await pool.query(insertQuery, values)
            console.log(`✅ ${destination.destination} added successfully`)
        } catch (err) {
            console.error("⚠️ error inserting destination", err)
        }
    }
}

//create activities table
const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        DROP TABLE IF EXISTS activities CASCADE;

        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY,
            trip_id int NOT NULL,
            activity varchar(100) NOT NULL,
            num_votes integer DEFAULT 0,
            FOREIGN KEY(trip_id) REFERENCES trips(id)
        )
    `
    try{
        const res = await pool.query(createActivitiesTableQuery)
        console.log('🎉 activiies table created successfully ')
    }catch(err){
        console.error('⚠️ error creating activities table', err)
    }
}

//create trips_destinations join table
const createTripsDestinationsTable = async () => {
  const createTripsDestinationsTableQuery = `
      DROP TABLE IF EXISTS trips_destinations CASCADE;

      CREATE TABLE IF NOT EXISTS trips_destinations (
          trip_id int NOT NULL,
          destination_id int NOT NULL,
          PRIMARY KEY (trip_id, destination_id),
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
          FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
      );
  `
  try {
    const res = await pool.query(createTripsDestinationsTableQuery)
    console.log('🎉 trips_destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_destinations table', err)
  }
}

//create users table
const createUsersTable = async () => {
  const createUsersTableQuery = `
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE IF NOT EXISTS users (
          id serial PRIMARY KEY,
          githubid integer NOT NULL,
          username varchar(100) NOT NULL,
          avatarurl varchar(500) NOT NULL,
          accesstoken varchar(500) NOT NULL
      );
  `
  try {
    const res = await pool.query(createUsersTableQuery)
    console.log('🎉 users table created successfully')
  } catch (error) {
    console.error('⚠️ error creating users table', error)
  }
}

//create trips_users join table
const createTripsUsersTable = async () => {
  const createTripsUsersTableQuery = `
      DROP TABLE IF EXISTS trips_users CASCADE;

      CREATE TABLE IF NOT EXISTS trips_users (
          trip_id int NOT NULL,
          user_id int NOT NULL,
          PRIMARY KEY (trip_id, user_id),
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
      );
  `
  try {
    const res = await pool.query(createTripsUsersTableQuery)
    console.log('🎉 trips_users table created successfully')
  } catch (error) {
    console.error('⚠️ error creating trips_users table', error)
  }
}

// Run sequentially so parent tables exist before dependent (foreign key) tables
const seedDatabase = async () => {
  await seedTripsTable()
  await seedDestinationsTable()
  await createActivitiesTable()
  await createUsersTable()
  await createTripsDestinationsTable()
  await createTripsUsersTable()
  await pool.end()
}

seedDatabase()
