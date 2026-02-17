import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;
import pkg from 'xlsx';
const { readFile, utils } = pkg;
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const excelFile = path.resolve(__dirname, '../data.xlsx')

async function main() {
    console.log(`Reading data from ${excelFile}...`);
    // Critical optimization: limit sheetRows to 5000 to avoid hanging on 1M+ blank rows
    const workbook = readFile(excelFile, { cellDates: true, sheetRows: 5000 })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const ref = sheet['!ref'];
    if (!ref) {
        console.error("No data found in sheet.");
        return;
    }

    const range = utils.decode_range(ref);
    console.log(`Sheet range (limited): ${ref} (Rows to scan: ${range.e.r + 1})`);

    let count = 0;
    let emptyRowCount = 0;

    for (let r = 2; r <= range.e.r; r++) {
        const row = [];
        let hasData = false;

        for (let c = 0; c <= 25; c++) {
            const cell = sheet[utils.encode_cell({ r, c })];
            const val = cell ? cell.v : null;
            row.push(val);
            if (val !== null && c > 0) hasData = true;
        }

        if (!row[1] || !row[2]) {
            emptyRowCount++;
            if (emptyRowCount > 50) {
                console.log("Reached 50 consecutive empty rows. Stopping early.");
                break;
            }
            continue;
        }
        emptyRowCount = 0;

        const kamName = String(row[1] || "").trim();
        const kamCode = String(row[2] || "").trim();
        const regionName = String(row[3] || "General").trim();
        const distName = String(row[9] || "Direct").trim();
        const patientName = String(row[10] || "Unknown").trim();
        const patientArea = String(row[11] || "Default").trim();
        const patientEmail = row[16] ? String(row[16]).trim() : `p_${Math.random().toString(36).substr(2, 5)}@cg-portal.com`;
        const patientPhone = String(row[17] || "").trim();

        try {
            // 1. Create City
            const city = await prisma.city.upsert({
                where: { name: regionName },
                update: {},
                create: { name: regionName }
            });

            // 2. Create Area
            const area = await prisma.area.upsert({
                where: { name_cityId: { name: patientArea, cityId: city.id } },
                update: {},
                create: { name: patientArea, cityId: city.id }
            });

            // 3. Create Distributor User
            const distEmail = `${distName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}@cg-portal.com`;
            const distributor = await prisma.user.upsert({
                where: { email: distEmail },
                update: {},
                create: {
                    name: distName,
                    email: distEmail,
                    role: "DISTRIBUTOR",
                    emailVerified: true,
                    isVerified: true,
                    cityId: city.id,
                    areaId: area.id
                }
            });

            // 4. Create KAM User
            const kamEmail = `${kamCode.toLowerCase()}@cg-portal.com`;
            const kam = await prisma.user.upsert({
                where: { email: kamEmail },
                update: {
                    distributorId: distributor.id
                },
                create: {
                    name: kamName,
                    email: kamEmail,
                    employeeCode: kamCode,
                    role: "KAM",
                    emailVerified: true,
                    isVerified: true,
                    cityId: city.id,
                    areaId: area.id,
                    distributorId: distributor.id
                }
            });

            // 5. Create Order & Installation record
            await prisma.order.create({
                data: {
                    patientName,
                    patientPhone,
                    patientCity: regionName,
                    homeAddress: patientArea,
                    status: "COMPLETED",
                    kamId: kam.id,
                    distributorId: distributor.id,
                    installation: {
                        create: {
                            timestamp: row[0] instanceof Date ? row[0] : new Date(),
                            kamName: kamName,
                            kamEmployeeCode: kamCode,
                            region: regionName,
                            city: regionName,
                            area: patientArea,
                            referredBy: String(row[4] || ""),
                            referralEmployeeCode: String(row[5] || ""),
                            referralTeam: String(row[6] || ""),
                            doctorName: String(row[7] || ""),
                            doctorCode: String(row[8] || ""),
                            distributorName: distName,
                            patientName: patientName,
                            patientArea: patientArea,
                            sensorInstalledBy: String(row[12] || ""),
                            visitDate: String(row[13] || ""),
                            visitTime: String(row[14] || ""),
                            numDevices: parseInt(row[15]) || 1,
                            patientEmail: patientEmail,
                            patientWhatsApp: patientPhone,
                            activationDate: String(row[18] || ""),
                            comments: String(row[19] || ""),
                            serialNumber: String(row[20] || ""),
                        }
                    }
                }
            });
            count++;
            if (count % 50 === 0) {
                console.log(`Processed ${count} orders...`);
            }
        } catch (err) {
            console.error(`Error processing row ${r} (${patientName}):`, err.message);
        }
    }

    console.log(`Successfully completed import: ${count} records processed.`);
}

main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(() => {
    prisma.$disconnect()
})
