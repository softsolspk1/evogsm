
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_zhT2D8UQorRL@ep-holy-sun-ai8b1d7v-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
});

async function setupAuthSchema() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        // Create 'auth' extension which should create the schema and tables
        console.log('Attempting to create "auth" extension...');
        await client.query(`CREATE EXTENSION IF NOT EXISTS "auth" CASCADE;`);
        console.log('Extension "auth" created (or already exists).');

        // Verify schema existence
        const res = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'auth';
    `);

        if (res.rows.length > 0) {
            console.log('SUCCESS: Schema "auth" now EXISTS.');
        } else {
            console.log('FAILURE: Schema "auth" STILL MISSING after CREATE EXTENSION.');
        }

        client.release();
    } catch (err) {
        console.error('Database setup error:', err);
    } finally {
        await pool.end();
    }
}

setupAuthSchema();
