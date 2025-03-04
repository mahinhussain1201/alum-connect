const { PrismaClient } = require("@prisma/client");

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
  console.log("🔗 Connecting to the database...");

  global.__prisma
    .$connect()
    .then(() => {
      console.log("✅ Successfully connected to the database!");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to the database:", error);
    });
}

prisma = global.__prisma;

module.exports = prisma;
