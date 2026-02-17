import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
    try {
        const count = await prisma.order.count();
        console.log('Total orders in database:', count);

        if (count > 0) {
            const orders = await prisma.order.findMany({
                take: 5,
                include: {
                    kam: { select: { name: true, email: true } },
                    distributor: { select: { name: true, email: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            console.log('\nSample orders:');
            console.log(JSON.stringify(orders, null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkOrders();
