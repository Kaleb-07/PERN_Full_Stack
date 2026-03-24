import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"]
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB Connected to via prisma");
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("DB Disconnected");
    } catch (error) {
        console.error(`Database disconnection error: ${error.message}`);
    }
};

export { prisma, connectDB, disconnectDB };