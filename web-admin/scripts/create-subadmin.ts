import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating Sub-Admin test user...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create the Sub-Admin user
    const subAdmin = await prisma.user.upsert({
        where: { email: 'subadmin@test.com' },
        update: {
            role: 'SUB_ADMIN',
            name: 'Sub Admin Test',
            isVerified: true,
            emailVerified: true,
        },
        create: {
            email: 'subadmin@test.com',
            name: 'Sub Admin Test',
            role: 'SUB_ADMIN',
            isVerified: true,
            emailVerified: true,
            account: {
                create: {
                    providerId: 'credential',
                    accountId: 'subadmin@test.com',
                    password: hashedPassword,
                },
            },
        },
    });

    console.log('✅ Sub-Admin user created successfully!');
    console.log('Email: subadmin@test.com');
    console.log('Password: password123');
    console.log('Role: SUB_ADMIN');
    console.log('User ID:', subAdmin.id);
}

main()
    .catch((e) => {
        console.error('Error creating Sub-Admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
