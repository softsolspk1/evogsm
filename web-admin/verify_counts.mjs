import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })

async function main() {
    const cityCount = await prisma.city.count();
    const areaCount = await prisma.area.count();
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    console.log('--- Database Counts ---');
    console.log(`Cities: ${cityCount}`);
    console.log(`Areas: ${areaCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Orders: ${orderCount}`);
}

main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(() => {
    prisma.$disconnect()
})
