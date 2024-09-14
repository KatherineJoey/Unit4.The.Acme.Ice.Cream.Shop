const client = require('./client');

const createFlavors = async () => {
  try {
    console.log('CREATING FLAVORS');

    await client.query(`
        INSERT INTO flavors (name, is_favorite)
        VALUES 
            ('Strawberry', TRUE),
            ('Ube', TRUE),
            ('Chocolate', TRUE),
            ('Mint', FALSE),
            ('Cookies_and_Cream', TRUE),
            ('Vanilla', TRUE),
            ('Mango', FALSE)
        `);

    console.log('FLAVORS CREATED');
  } catch (err) {
    console.log('ERROR CREATING FLAVORS', err);
  }
};

module.exports = {
  createFlavors: createFlavors,
};
