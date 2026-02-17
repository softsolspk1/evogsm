
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({ connectionString });

async function verifyAdmin() {
    const email = 'admin1@example.com';
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        const res = await client.query(`
      UPDATE neon_auth.user 
      SET "emailVerified" = true, "isVerified" = true
      WHERE email = $1
      RETURNING id, email, "emailVerified", "isVerified";
    `, [email]);

        if (res.rowCount > 0) {
            console.log('SUCCESS: Verified admin user:', res.rows[0]);
        } else {
            console.log('FAILURE: User not found or not updated.');
        }

        client.release();
    } catch (err) {
        console.error('Error verifying admin:', err);
    } finally {
        await pool.end();
    }
}

verifyAdmin();
