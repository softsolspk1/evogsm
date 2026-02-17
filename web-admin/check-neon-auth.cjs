
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
});

async function checkNeonAuth() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        // Check for 'neon_auth' schema
        const schemaRes = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'neon_auth';
    `);

        if (schemaRes.rows.length > 0) {
            console.log('Schema "neon_auth" EXISTS.');

            // Check for users table in neon_auth
            const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'neon_auth';
      `);
            console.log('Tables in neon_auth schema:', tables.rows.map(r => r.table_name));

            // Check columns of user table
            const columns = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'neon_auth' AND table_name = 'user';
            `);
            console.log('Columns in neon_auth.user:', columns.rows.map(c => `${c.column_name} (${c.data_type})`));
        } else {
            console.log('Schema "neon_auth" does NOT exist.');

            // Try creating it?
            console.log('Attempting to create extension "neon_auth"...');
            try {
                await client.query(`CREATE EXTENSION IF NOT EXISTS "neon_auth" CASCADE;`);
                console.log('Extension "neon_auth" created successfully (or already exists).');
            } catch (extErr) {
                console.error('Failed to create extension "neon_auth":', extErr.message);
            }
        }

        // Also check for 'users' table in ANY schema just in case
        const allUsers = await client.query(`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_name = 'users';
    `);
        if (allUsers.rows.length > 0) {
            console.log('Found "users" table in schemas:', allUsers.rows.map(r => r.table_schema).join(', '));
        } else {
            console.log('No "users" table found in any schema.');
        }

        client.release();
    } catch (err) {
        console.error('Database error:', err);
    } finally {
        await pool.end();
    }
}

checkNeonAuth();
