const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgress://localhost/acme_icecream',
});
const express = require('express');

const app = express();
app.use(express.json());

client
  .connect()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// get api/flavors
app.get('/api/flavors', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM flavors');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get api/flavors/:id
app.get('/api/flavors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM flavors WHERE id = $1', [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flavor not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post api/flavors
app.post('/api/flavors', async (req, res) => {
  const { name, is_favorite } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *',
      [name, is_favorite]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete api/flavors/:id
app.delete('/api/flavors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM flavors WHERE id = $1', [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Flavor not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// put api/flavors/:id
app.put('/api/flavors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, is_favorite } = req.body;
  try {
    const result = await client.query(
      'UPDATE flavors SET name = $1, is_favorite = $2, updated_at = CURRENT TIMESTAMP WHERE id =  $3 RETURNING *',
      [name, is_favorite, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Flavor not found ' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

process.on('SIGINT', () => {
  client.end(() => {
    console.log('Database client disconnected');
    process.exit(0);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = client;
