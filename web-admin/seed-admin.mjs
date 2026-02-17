
import fetch from 'node-fetch';

async function registerAdmin() {
    const url = 'http://localhost:3000/api/auth/sign-up/email';
    const userData = {
        name: 'Admin User',
        email: 'admin1@example.com',
        password: 'password123',
        // role: 'ADMIN',
        image: '',
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Admin user seeded successfully:', data);
        } else {
            const errorText = await response.text();
            console.error('Failed to seed admin user:', response.status, errorText);
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

registerAdmin();
