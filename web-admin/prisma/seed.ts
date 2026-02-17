import { prisma } from "../lib/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const legacyData = [
    {
        timestamp: "2024-06-11T16:34:39Z",
        kamName: "Furqan Mehmood",
        kamEmployeeCode: "11135",
        region: "Central 3",
        city: "Bahawalpur",
        area: "Civil Hospital",
        referredBy: "Mohsin Nawaz",
        referralEmployeeCode: "10452",
        referralTeam: "OBS-3",
        doctorName: "Dr. Muzammil",
        doctorCode: "073/00637",
        distributorName: "Al-Fateh",
        patientName: "Arshad Mehmood",
        patientArea: "Model Town",
        sensorInstalledBy: "Furqan Mehmood",
        visitDate: "2024-06-11",
        visitTime: "12:00 PM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0300-6812345",
        activationDate: "2024-06-11",
        comments: "Legacy Import",
        serialNumber: "28D01-00001",
        kamReminder: true
    },
    {
        timestamp: "2024-06-12T10:15:22Z",
        kamName: "Zeeshan Ali",
        kamEmployeeCode: "11220",
        region: "South 1",
        city: "Karachi",
        area: "Clifton",
        referredBy: "Salman Khan",
        referralEmployeeCode: "10550",
        referralTeam: "AGP-1",
        doctorName: "Dr. Ayesha",
        doctorCode: "021/00889",
        distributorName: "Popular",
        patientName: "Mrs. Khan",
        patientArea: "Defence",
        sensorInstalledBy: "Zeeshan Ali",
        visitDate: "2024-06-12",
        visitTime: "09:30 AM",
        numDevices: 2,
        patientEmail: "khan@gmail.com",
        patientWhatsApp: "0321-8889990",
        activationDate: "2024-06-12",
        comments: "High priority",
        serialNumber: "28D01-00002",
        kamReminder: true
    },
    {
        timestamp: "2024-06-15T14:20:00Z",
        kamName: "Naveed Khan",
        kamEmployeeCode: "11300",
        region: "North 2",
        city: "Lahore",
        area: "Gulberg",
        referredBy: "Bilal Ahmed",
        referralEmployeeCode: "10600",
        referralTeam: "OBS-1",
        doctorName: "Dr. Saleem",
        doctorCode: "042/00112",
        distributorName: "Apex",
        patientName: "Muhammad Ahmed",
        patientArea: "Model Town",
        sensorInstalledBy: "Naveed Khan",
        visitDate: "2024-06-15",
        visitTime: "11:00 AM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0333-1234567",
        activationDate: "2024-06-15",
        comments: "Legacy",
        serialNumber: "28D01-00003",
        kamReminder: false
    },
    {
        timestamp: "2024-06-18T09:00:00Z",
        kamName: "Rizwan Ahmed",
        kamEmployeeCode: "11450",
        region: "North 1",
        city: "Islamabad",
        area: "F-10",
        referredBy: "Tahir Shah",
        referralEmployeeCode: "10700",
        referralTeam: "AGP-3",
        doctorName: "Dr. Farooq",
        doctorCode: "051/00445",
        distributorName: "Prime",
        patientName: "Fatima Bibi",
        patientArea: "E-7",
        sensorInstalledBy: "Rizwan Ahmed",
        visitDate: "2024-06-18",
        visitTime: "02:00 PM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0345-9988776",
        activationDate: "2024-06-18",
        comments: "-",
        serialNumber: "28D01-00004",
        kamReminder: true
    },
    {
        timestamp: "2024-06-20T11:45:00Z",
        kamName: "Sajid Mahmood",
        kamEmployeeCode: "11500",
        region: "Central 1",
        city: "Multan",
        area: "Cantonment",
        referredBy: "Asif Ali",
        referralEmployeeCode: "10800",
        referralTeam: "OBS-2",
        doctorName: "Dr. Javed",
        doctorCode: "061/00223",
        distributorName: "Unity",
        patientName: "Ghulam Abbas",
        patientArea: "Gulgasht",
        sensorInstalledBy: "Sajid Mahmood",
        visitDate: "2024-06-20",
        visitTime: "04:30 PM",
        numDevices: 1,
        patientEmail: "abbas@yahoo.com",
        patientWhatsApp: "0301-1122334",
        activationDate: "2024-06-20",
        comments: "Imported",
        serialNumber: "28D01-00005",
        kamReminder: false
    },
    {
        timestamp: "2024-06-22T15:10:00Z",
        kamName: "Faisal Shah",
        kamEmployeeCode: "11600",
        region: "North 3",
        city: "Sialkot",
        area: "Sambrial",
        referredBy: "Usman Ghani",
        referralEmployeeCode: "10900",
        referralTeam: "AGP-2",
        doctorName: "Dr. Nasreen",
        doctorCode: "052/00667",
        distributorName: "Globe",
        patientName: "Khadija Begum",
        patientArea: "City Centre",
        sensorInstalledBy: "Faisal Shah",
        visitDate: "2024-06-22",
        visitTime: "10:00 AM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0322-5554433",
        activationDate: "2024-06-22",
        comments: "-",
        serialNumber: "28D01-00006",
        kamReminder: true
    },
    {
        timestamp: "2024-06-25T13:00:00Z",
        kamName: "Imran Khan",
        kamEmployeeCode: "11700",
        region: "North 4",
        city: "Peshawar",
        area: "Hayatabad",
        referredBy: "Waqas Raja",
        referralEmployeeCode: "11000",
        referralTeam: "OBS-4",
        doctorName: "Dr. Khalid",
        doctorCode: "091/00334",
        distributorName: "Frontier",
        patientName: "Abdul Rashid",
        patientArea: "University Road",
        sensorInstalledBy: "Imran Khan",
        visitDate: "2024-06-25",
        visitTime: "01:30 PM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0312-7776655",
        activationDate: "2024-06-25",
        comments: "Urgent",
        serialNumber: "28D01-00007",
        kamReminder: true
    },
    {
        timestamp: "2024-06-28T10:30:00Z",
        kamName: "Zahid Ali",
        kamEmployeeCode: "11800",
        region: "South 2",
        city: "Quetta",
        area: "Jinnah Road",
        referredBy: "Haris Jameel",
        referralEmployeeCode: "11100",
        referralTeam: "AGP-4",
        doctorName: "Dr. Bashir",
        doctorCode: "081/00556",
        distributorName: "Bolan",
        patientName: "Maryam Nawaz",
        patientArea: "Satellite Town",
        sensorInstalledBy: "Zahid Ali",
        visitDate: "2024-06-28",
        visitTime: "03:00 PM",
        numDevices: 1,
        patientEmail: "nawaz@hotmail.com",
        patientWhatsApp: "0336-4443322",
        activationDate: "2024-06-28",
        comments: "-",
        serialNumber: "28D01-00008",
        kamReminder: false
    },
    {
        timestamp: "2024-07-01T16:00:00Z",
        kamName: "Amjad Malik",
        kamEmployeeCode: "11900",
        region: "Central 2",
        city: "Faisalabad",
        area: "D-Ground",
        referredBy: "Kamran Akmal",
        referralEmployeeCode: "11200",
        referralTeam: "OBS-5",
        doctorName: "Dr. Arshad",
        doctorCode: "041/00778",
        distributorName: "Chenab",
        patientName: "Hassan Raza",
        patientArea: "Madina Town",
        sensorInstalledBy: "Amjad Malik",
        visitDate: "2024-07-01",
        visitTime: "05:30 PM",
        numDevices: 1,
        patientEmail: "-",
        patientWhatsApp: "0302-6667788",
        activationDate: "2024-07-01",
        comments: "New installation",
        serialNumber: "28D01-00009",
        kamReminder: true
    },
    {
        timestamp: "2024-07-03T12:00:00Z",
        kamName: "Tariq Aziz",
        kamEmployeeCode: "12000",
        region: "Central 4",
        city: "Gujranwala",
        area: "GT Road",
        referredBy: "Saqlain Mushtaq",
        referralEmployeeCode: "11300",
        referralTeam: "AGP-5",
        doctorName: "Dr. Munir",
        doctorCode: "055/00990",
        distributorName: "Gift",
        patientName: "Zainab Ali",
        patientArea: "Wapda Town",
        sensorInstalledBy: "Tariq Aziz",
        visitDate: "2024-07-03",
        visitTime: "11:30 AM",
        numDevices: 1,
        patientEmail: "zainab@gmail.com",
        patientWhatsApp: "0323-9998877",
        activationDate: "2024-07-03",
        comments: "-",
        serialNumber: "28D01-00010",
        kamReminder: true
    }
];

async function main() {
    console.log("Starting bulk import of legacy data...");

    for (const data of legacyData) {
        try {
            // 1. Find or create KAM user
            let kam = await prisma.user.findUnique({
                where: { email: `${data.kamName.toLowerCase().replace(/\s/g, ".")}@pharmevo.biz` }
            });

            if (!kam) {
                kam = await prisma.user.create({
                    data: {
                        email: `${data.kamName.toLowerCase().replace(/\s/g, ".")}@pharmevo.biz`,
                        name: data.kamName,
                        role: "KAM",
                        employeeCode: data.kamEmployeeCode,
                        isVerified: true,
                        emailVerified: true
                    }
                });
            }

            // 2. Create Order
            const order = await prisma.order.create({
                data: {
                    patientName: data.patientName,
                    patientPhone: data.patientWhatsApp,
                    patientCity: data.city,
                    homeAddress: data.patientArea,
                    status: "COMPLETED",
                    kamId: kam.id,
                    createdAt: new Date(data.timestamp)
                }
            });

            // 3. Create Installation
            await prisma.deviceInstallation.create({
                data: {
                    orderId: order.id,
                    timestamp: new Date(data.timestamp),
                    kamName: data.kamName,
                    kamEmployeeCode: data.kamEmployeeCode,
                    region: data.region,
                    city: data.city,
                    area: data.area,
                    referredBy: data.referredBy,
                    referralEmployeeCode: data.referralEmployeeCode,
                    referralTeam: data.referralTeam,
                    doctorName: data.doctorName,
                    doctorCode: data.doctorCode,
                    distributorName: data.distributorName,
                    patientName: data.patientName,
                    patientArea: data.patientArea,
                    sensorInstalledBy: data.sensorInstalledBy,
                    visitDate: data.visitDate,
                    visitTime: data.visitTime,
                    numDevices: data.numDevices,
                    patientEmail: data.patientEmail,
                    patientWhatsApp: data.patientWhatsApp,
                    activationDate: data.activationDate,
                    comments: data.comments,
                    serialNumber: data.serialNumber,
                    kamReminder: data.kamReminder,
                    createdAt: new Date(data.timestamp)
                }
            });

            console.log(`Successfully imported order for ${data.patientName}`);
        } catch (error) {
            console.error(`Error importing ${data.patientName}:`, error);
        }
    }

    console.log("Import complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
