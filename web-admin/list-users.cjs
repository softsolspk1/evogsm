
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({ connectionString });

async function checkUsers() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        const res = await client.query('SELECT * FROM neon_auth.user');
        console.log('Users found:', res.rowCount);
        console.table(res.rows);

        client.release();
    } catch (err) {
        console.error('Error querying users:', err);
    } finally {
        await pool.end();
    }
}

checkUsers();
