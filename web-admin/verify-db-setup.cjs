
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_f6DYdtxMKPA9@ep-lucky-hat-ai94fjeh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({ connectionString });

async function verifySetup() {
    try {
        const client = await pool.connect();
        console.log('Connected to database.');

        // 1. Check for employeeCode in neon_auth.user
        const userCols = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'neon_auth' AND table_name = 'user' AND column_name = 'employeeCode';
    `);

        if (userCols.rows.length > 0) {
            console.log('SUCCESS: neon_auth.user has "employeeCode" column.');
        } else {
            console.error('FAILURE: neon_auth.user MISSING "employeeCode" column.');
        }

        // 2. Check for public.Order table (Prisma creates "Order" capitalised usually? No, it respects casing but PG lowercases unquoted. Prisma quotes it if model name is casing sensitive? Let's check "Order" or "order")
        // Prisma maps `Order` to `Order` if no map. But allows standard PG naming.
        // Let's check strict match first or ignore case.
        const orderTable = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'Order';
    `);
        if (orderTable.rows.length > 0) {
            console.log('SUCCESS: public."Order" table exists.');
        } else {
            // Try lowercase
            const orderTableLower = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'order';
        `);
            if (orderTableLower.rows.length > 0) console.log('SUCCESS: public."order" table exists.');
            else console.error('FAILURE: public.Order table MISSING.');
        }

        // 3. Check for DeviceInstallation
        const deviceTable = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'DeviceInstallation';
    `);
        if (deviceTable.rows.length > 0) {
            console.log('SUCCESS: public."DeviceInstallation" table exists.');
        } else {
            const deviceTableLower = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'deviceinstallation';
        `);
            if (deviceTableLower.rows.length > 0) console.log('SUCCESS: public."deviceinstallation" table exists.');
            else console.error('FAILURE: public.DeviceInstallation table MISSING.');
        }

        client.release();
    } catch (err) {
        console.error('Verification error:', err);
    } finally {
        await pool.end();
    }
}

verifySetup();
