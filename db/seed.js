const client = require('./client.js');
const { createFlavors } = require('./flavors.js');

const dropTable = async () => {
  try {
    console.log('DROPPING TABLE');
    await client.query(`DROP TABLE IF EXISTS flavors`);
    console.log('TABLE DROPPED');
  } catch (err) {
    console.log('ERROR DROPPING TABLE: ', err);
  }
};

const createTable = async () => {
  try {
    console.log('CREATING TABLE!!');
    await client.query(`
        CREATE TABLE flavors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) NOT NULL,
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
    console.log('TABLE CREATED');
  } catch (err) {
    console.log('ERROR CREATING TABLE: ', err);
  }
};

const syncAndSeed = async () => {
  try {
    // await client.connect();
    console.log('DATABASE CONNECTED!!!');

    await dropTable();
    await createTable();
    await createFlavors();

    console.log('DATABASE SEEDED');
  } catch (err) {
    console.error('ERROR IN SYNC AND SEED: ', err);
  } finally {
    await client.end();
    console.log('DATABASE CONNECTION CLOSED');
  }
};

syncAndSeed();
