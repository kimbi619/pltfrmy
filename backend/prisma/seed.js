const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10

async function main() {
    const hashedPassword = await bcrypt.hash("securepassword", SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            first_name: "hohn", 
            last_name: "doe", 
            email: "kimbi@gmail.com",
            password: hashedPassword
        }
    });
    console.log(user);
    
    const task = await prisma.task.create({
        data: {
            title: "Test Task",
            description: "This is a test task",
            status: "TODO",
            priority: "Medium",
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            start_date: new Date(),
            user_id: user.id 
        }
    });
    console.log(task);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });