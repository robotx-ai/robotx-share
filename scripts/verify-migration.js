/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveMongoDbName(uri) {
  if (process.env.MONGODB_MIGRATION_DB) return process.env.MONGODB_MIGRATION_DB;

  const pathname = new URL(uri).pathname.replace(/^\//, "");
  if (pathname && pathname !== "admin") return pathname;

  throw new Error(
    "Unable to determine MongoDB database name. Set MONGODB_MIGRATION_DB explicitly."
  );
}

async function pickCollection(db, candidates) {
  const existing = await db.listCollections({}, { nameOnly: true }).toArray();
  const names = new Set(existing.map((item) => item.name));
  const found = candidates.find((candidate) => names.has(candidate));
  return db.collection(found || candidates[0]);
}

async function main() {
  const mongoUri = ensureEnv("MONGODB_MIGRATION_URI");
  ensureEnv("DATABASE_URL");
  const mongoDbName = resolveMongoDbName(mongoUri);

  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    const db = mongoClient.db(mongoDbName);

    const userCollection = await pickCollection(db, ["User", "user", "users"]);
    const accountCollection = await pickCollection(db, ["Account", "account", "accounts"]);
    const listingCollection = await pickCollection(db, ["Listing", "listing", "listings"]);
    const reservationCollection = await pickCollection(db, [
      "Reservation",
      "reservation",
      "reservations",
    ]);

    const [mongoUsers, mongoAccounts, mongoListings, mongoReservations] =
      await Promise.all([
        userCollection.countDocuments(),
        accountCollection.countDocuments(),
        listingCollection.countDocuments(),
        reservationCollection.countDocuments(),
      ]);

    const [pgUsers, pgAccounts, pgListings, pgReservations, pgFavorites] =
      await Promise.all([
        prisma.user.count(),
        prisma.account.count(),
        prisma.listing.count(),
        prisma.reservation.count(),
        prisma.userFavorite.count(),
      ]);

    const [orphanAccounts, orphanListings, orphanReservationsByUser, orphanReservationsByListing, orphanFavoritesByUser, orphanFavoritesByListing] =
      await Promise.all([
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Account" a LEFT JOIN "User" u ON u.id = a."userId" WHERE u.id IS NULL`,
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Listing" l LEFT JOIN "User" u ON u.id = l."userId" WHERE u.id IS NULL`,
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Reservation" r LEFT JOIN "User" u ON u.id = r."userId" WHERE u.id IS NULL`,
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "Reservation" r LEFT JOIN "Listing" l ON l.id = r."listingId" WHERE l.id IS NULL`,
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "UserFavorite" f LEFT JOIN "User" u ON u.id = f."userId" WHERE u.id IS NULL`,
        prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "UserFavorite" f LEFT JOIN "Listing" l ON l.id = f."listingId" WHERE l.id IS NULL`,
      ]);

    const duplicateFavorites = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM (
        SELECT "userId", "listingId", COUNT(*)
        FROM "UserFavorite"
        GROUP BY "userId", "listingId"
        HAVING COUNT(*) > 1
      ) duplicates
    `;

    const report = {
      generatedAt: new Date().toISOString(),
      mongoDbName,
      counts: {
        mongo: {
          users: mongoUsers,
          accounts: mongoAccounts,
          listings: mongoListings,
          reservations: mongoReservations,
        },
        postgres: {
          users: pgUsers,
          accounts: pgAccounts,
          listings: pgListings,
          reservations: pgReservations,
          favorites: pgFavorites,
        },
      },
      fkIntegrity: {
        orphanAccounts: orphanAccounts[0].count,
        orphanListings: orphanListings[0].count,
        orphanReservationsByUser: orphanReservationsByUser[0].count,
        orphanReservationsByListing: orphanReservationsByListing[0].count,
        orphanFavoritesByUser: orphanFavoritesByUser[0].count,
        orphanFavoritesByListing: orphanFavoritesByListing[0].count,
      },
      duplicateFavorites: duplicateFavorites[0].count,
    };

    const reportDir = path.join(process.cwd(), "migration-reports");
    fs.mkdirSync(reportDir, { recursive: true });

    const reportPath = path.join(
      reportDir,
      `verification-${Date.now()}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("Verification complete.");
    console.log(`Report written to: ${reportPath}`);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Verification failed:");
  console.error(error);
  process.exit(1);
});
