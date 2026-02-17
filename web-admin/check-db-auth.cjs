
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
});

async function checkAuthSchema() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        // Check for auth schema
        const res = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'auth';
    `);

        if (res.rows.length > 0) {
            console.log('Schema "auth" EXISTS.');

            // List tables in auth schema
            const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'auth';
      `);
            console.log('Tables in auth schema:', tables.rows.map(r => r.table_name));

        } else {
            console.log('Schema "auth" does NOT exist.');
        }

        // Check for neondb_owner permissions or roles if relevant? 
        // Just schema existence is a good proxy for "Is Auth Enabled".

        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await pool.end();
    }
}

checkAuthSchema();
