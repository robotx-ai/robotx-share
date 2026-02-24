/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function parseDate(value, fallback = null) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date;
}

function parseIntOrDefault(value, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

async function pickCollection(db, candidates) {
  const existing = await db.listCollections({}, { nameOnly: true }).toArray();
  const names = new Set(existing.map((item) => item.name));
  const found = candidates.find((candidate) => names.has(candidate));
  return db.collection(found || candidates[0]);
}

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

async function upsertUsers(users) {
  let migrated = 0;

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        hashedPassword: user.hashedPassword,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      create: user,
    });

    migrated += 1;
  }

  return migrated;
}

async function upsertAccounts(accounts, validUserIds, skipped) {
  let migrated = 0;

  for (const account of accounts) {
    if (!validUserIds.has(account.userId)) {
      skipped.accounts.push({
        id: account.id,
        reason: "missing-user",
        userId: account.userId,
      });
      continue;
    }

    await prisma.account.upsert({
      where: { id: account.id },
      update: {
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      },
      create: account,
    });

    migrated += 1;
  }

  return migrated;
}

async function upsertListings(listings, validUserIds, skipped) {
  let migrated = 0;

  for (const listing of listings) {
    if (!validUserIds.has(listing.userId)) {
      skipped.listings.push({
        id: listing.id,
        reason: "missing-user",
        userId: listing.userId,
      });
      continue;
    }

    await prisma.listing.upsert({
      where: { id: listing.id },
      update: {
        title: listing.title,
        description: listing.description,
        imageSrc: listing.imageSrc,
        createdAt: listing.createdAt,
        category: listing.category,
        roomCount: listing.roomCount,
        bathroomCount: listing.bathroomCount,
        guestCount: listing.guestCount,
        locationValue: listing.locationValue,
        userId: listing.userId,
        price: listing.price,
      },
      create: listing,
    });

    migrated += 1;
  }

  return migrated;
}

async function upsertReservations(reservations, validUserIds, validListingIds, skipped) {
  let migrated = 0;

  for (const reservation of reservations) {
    if (!validUserIds.has(reservation.userId)) {
      skipped.reservations.push({
        id: reservation.id,
        reason: "missing-user",
        userId: reservation.userId,
      });
      continue;
    }

    if (!validListingIds.has(reservation.listingId)) {
      skipped.reservations.push({
        id: reservation.id,
        reason: "missing-listing",
        listingId: reservation.listingId,
      });
      continue;
    }

    await prisma.reservation.upsert({
      where: { id: reservation.id },
      update: {
        userId: reservation.userId,
        listingId: reservation.listingId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalPrice: reservation.totalPrice,
        createdAt: reservation.createdAt,
      },
      create: reservation,
    });

    migrated += 1;
  }

  return migrated;
}

async function upsertFavorites(users, validUserIds, validListingIds, skipped) {
  let migrated = 0;
  const seen = new Set();

  for (const user of users) {
    if (!Array.isArray(user.favoriteIds) || user.favoriteIds.length === 0) {
      continue;
    }

    for (const listingId of user.favoriteIds) {
      const normalizedListingId = String(listingId);
      const dedupeKey = `${user.id}:${normalizedListingId}`;

      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);

      if (!validUserIds.has(user.id)) {
        skipped.favorites.push({
          userId: user.id,
          listingId: normalizedListingId,
          reason: "missing-user",
        });
        continue;
      }

      if (!validListingIds.has(normalizedListingId)) {
        skipped.favorites.push({
          userId: user.id,
          listingId: normalizedListingId,
          reason: "missing-listing",
        });
        continue;
      }

      await prisma.userFavorite.upsert({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId: normalizedListingId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          listingId: normalizedListingId,
        },
      });

      migrated += 1;
    }
  }

  return migrated;
}

async function main() {
  const mongoUri = ensureEnv("MONGODB_MIGRATION_URI");
  ensureEnv("DATABASE_URL");
  const mongoDbName = resolveMongoDbName(mongoUri);

  const mongoClient = new MongoClient(mongoUri);
  const startedAt = new Date();

  const skipped = {
    accounts: [],
    listings: [],
    reservations: [],
    favorites: [],
  };

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

    const [rawUsers, rawAccounts, rawListings, rawReservations] = await Promise.all([
      userCollection.find({}).toArray(),
      accountCollection.find({}).toArray(),
      listingCollection.find({}).toArray(),
      reservationCollection.find({}).toArray(),
    ]);

    const users = rawUsers.map((doc) => ({
      id: String(doc._id),
      name: doc.name || null,
      email: doc.email || null,
      emailVerified: parseDate(doc.emailVerified),
      image: doc.image || null,
      hashedPassword: doc.hashedPassword || null,
      createdAt: parseDate(doc.createdAt, new Date()),
      updatedAt: parseDate(doc.updatedAt, new Date()),
      favoriteIds: Array.isArray(doc.favoriteIds)
        ? doc.favoriteIds.map((id) => String(id))
        : [],
    }));

    const accounts = rawAccounts.map((doc) => ({
      id: String(doc._id),
      userId: String(doc.userId),
      type: String(doc.type || "oauth"),
      provider: String(doc.provider || ""),
      providerAccountId: String(doc.providerAccountId || ""),
      refresh_token: doc.refresh_token || null,
      access_token: doc.access_token || null,
      expires_at: parseIntOrDefault(doc.expires_at, null),
      token_type: doc.token_type || null,
      scope: doc.scope || null,
      id_token: doc.id_token || null,
      session_state: doc.session_state || null,
    }));

    const listings = rawListings.map((doc) => ({
      id: String(doc._id),
      title: String(doc.title || ""),
      description: String(doc.description || ""),
      imageSrc: String(doc.imageSrc || ""),
      createdAt: parseDate(doc.createdAt, new Date()),
      category: String(doc.category || ""),
      roomCount: parseIntOrDefault(doc.roomCount, 0),
      bathroomCount: parseIntOrDefault(doc.bathroomCount, 0),
      guestCount: parseIntOrDefault(doc.guestCount, 0),
      locationValue: String(doc.locationValue || ""),
      userId: String(doc.userId),
      price: parseIntOrDefault(doc.price, 0),
    }));

    const reservations = rawReservations.map((doc) => ({
      id: String(doc._id),
      userId: String(doc.userId),
      listingId: String(doc.listingId),
      startDate: parseDate(doc.startDate, new Date()),
      endDate: parseDate(doc.endDate, new Date()),
      totalPrice: parseIntOrDefault(doc.totalPrice, 0),
      createdAt: parseDate(doc.createdAt, new Date()),
    }));

    const baseUsers = users.map(({ favoriteIds, ...user }) => user);

    const userCount = await upsertUsers(baseUsers);
    const validUserIds = new Set(baseUsers.map((user) => user.id));

    const accountCount = await upsertAccounts(accounts, validUserIds, skipped);
    const listingCount = await upsertListings(listings, validUserIds, skipped);

    const validListingIds = new Set(listings.map((listing) => listing.id));
    const reservationCount = await upsertReservations(
      reservations,
      validUserIds,
      validListingIds,
      skipped
    );
    const favoriteCount = await upsertFavorites(
      users,
      validUserIds,
      validListingIds,
      skipped
    );

    const [pgUsers, pgAccounts, pgListings, pgReservations, pgFavorites] =
      await Promise.all([
        prisma.user.count(),
        prisma.account.count(),
        prisma.listing.count(),
        prisma.reservation.count(),
        prisma.userFavorite.count(),
      ]);

    const report = {
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      mongoDbName,
      sourceCounts: {
        users: rawUsers.length,
        accounts: rawAccounts.length,
        listings: rawListings.length,
        reservations: rawReservations.length,
      },
      migratedCounts: {
        users: userCount,
        accounts: accountCount,
        listings: listingCount,
        reservations: reservationCount,
        favorites: favoriteCount,
      },
      destinationCounts: {
        users: pgUsers,
        accounts: pgAccounts,
        listings: pgListings,
        reservations: pgReservations,
        favorites: pgFavorites,
      },
      skipped,
    };

    const reportDir = path.join(process.cwd(), "migration-reports");
    fs.mkdirSync(reportDir, { recursive: true });

    const reportPath = path.join(
      reportDir,
      `mongo-to-postgres-${Date.now()}.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log("Migration complete.");
    console.log(`Report written to: ${reportPath}`);
    console.log(JSON.stringify(report.destinationCounts, null, 2));
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Migration failed:");
  console.error(error);
  process.exit(1);
});
