// @ts-check
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SERVICES = [
  // Showcase & Performance
  {
    title: "Aurora X-1 Grand Opening Robot",
    description:
      "Full-size humanoid performance robot for grand openings, product launches, and corporate events. Draws crowds with dynamic motion sequences and real-time audience interaction.",
    imageSrc: "/Showcase.png",
    category: "Showcase & Performance",
    price: 450,
    locationValue: "Los Angeles, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 200,
  },
  {
    title: "SparkBot Trade Show Interactive Unit",
    description:
      "Compact interactive robot purpose-built for trade shows and expos. Engages visitors with custom scripts, product demos, and photo opportunities that boost booth dwell time.",
    imageSrc: "/Showcase.png",
    category: "Showcase & Performance",
    price: 280,
    locationValue: "San Diego, CA",
    roomCount: 1,
    bathroomCount: 2,
    guestCount: 100,
  },
  {
    title: "FlexArm Choreographed Stage Set",
    description:
      "Three synchronized robotic arm units delivering precision-choreographed light and motion shows. Ideal for concerts, brand activations, and large-scale stage productions.",
    imageSrc: "/Showcase.png",
    category: "Showcase & Performance",
    price: 620,
    locationValue: "Irvine, CA",
    roomCount: 3,
    bathroomCount: 1,
    guestCount: 500,
  },

  // Cleaning
  {
    title: "AutoSweep Pro Floor Scrubber",
    description:
      "Autonomous floor scrubbing robot covering up to 10,000 sq ft per shift. LIDAR-guided navigation with real-time obstacle avoidance for retail, office, and hospitality environments.",
    imageSrc: "/Warehouse.png",
    category: "Cleaning",
    price: 180,
    locationValue: "Los Angeles, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 50,
  },
  {
    title: "DustBot UV Sanitization Unit",
    description:
      "UV-C disinfection robot validated for hospital, clinic, and high-traffic commercial use. Follows programmable room schedules and logs sanitization compliance reports.",
    imageSrc: "/Warehouse.png",
    category: "Cleaning",
    price: 250,
    locationValue: "Long Beach, CA",
    roomCount: 1,
    bathroomCount: 2,
    guestCount: 30,
  },
  {
    title: "SprayTech Industrial Pressure Washer",
    description:
      "Heavy-duty robotic pressure washing system for industrial floors, parking structures, and loading docks. Handles chemical-resistant surfaces and grease-heavy environments.",
    imageSrc: "/Warehouse.png",
    category: "Cleaning",
    price: 320,
    locationValue: "Anaheim, CA",
    roomCount: 2,
    bathroomCount: 1,
    guestCount: 20,
  },

  // Warehouse
  {
    title: "CarryBot Heavy Pallet Mover",
    description:
      "Autonomous pallet transporter rated for loads up to 1,000 kg. Integrates with WMS systems and operates safely alongside human workers in shared warehouse zones.",
    imageSrc: "/Warehouse.png",
    category: "Warehouse",
    price: 350,
    locationValue: "Commerce, CA",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 25,
  },
  {
    title: "ScanBot Inventory Auditor",
    description:
      "Mobile barcode and RFID scanning robot that completes full inventory audits overnight. Generates SKU-level accuracy reports and flags discrepancies automatically.",
    imageSrc: "/Warehouse_Delivery.png",
    category: "Warehouse",
    price: 220,
    locationValue: "Torrance, CA",
    roomCount: 1,
    bathroomCount: 3,
    guestCount: 10,
  },
  {
    title: "DeliverBot Internal Courier",
    description:
      "Multi-floor autonomous delivery robot for inter-department document and package transport. Uses elevator integration and Bluetooth door access for seamless building navigation.",
    imageSrc: "/Warehouse_Delivery.png",
    category: "Warehouse",
    price: 280,
    locationValue: "Carson, CA",
    roomCount: 2,
    bathroomCount: 1,
    guestCount: 50,
  },

  // Restaurant
  {
    title: "ServeBot Dining Assistant",
    description:
      "Front-of-house service robot that delivers food and beverages directly to guest tables. Reduces wait times and frees staff for higher-value hospitality tasks.",
    imageSrc: "/Restaurant.png",
    category: "Restaurant",
    price: 240,
    locationValue: "Los Angeles, CA",
    roomCount: 1,
    bathroomCount: 2,
    guestCount: 80,
  },
  {
    title: "BrewBot Automated Beverage Station",
    description:
      "Robotic beverage preparation and dispensing unit for cafes, hotel lobbies, and airport lounges. Supports hot and cold drinks with a fully customizable menu.",
    imageSrc: "/Restaurant.png",
    category: "Restaurant",
    price: 190,
    locationValue: "Pasadena, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 60,
  },
  {
    title: "GreetBot Host & Queue Manager",
    description:
      "AI-powered lobby greeter that welcomes customers, manages waitlists, and provides directional assistance. Reduces perceived wait time and captures real-time foot traffic data.",
    imageSrc: "/Restaurant.png",
    category: "Restaurant",
    price: 160,
    locationValue: "Burbank, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 100,
  },
];

async function main() {
  const adminEmail =
    (process.env.ROBOTX_ADMIN_EMAILS ?? "").split(",")[0].trim() ||
    "seed@robotxshare.com";

  console.log(`Upserting seed admin user: ${adminEmail}`);
  const seedUser = await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: "RobotX Admin" },
    update: {},
  });

  const existingTitles = new Set(
    (await prisma.listing.findMany({ select: { title: true } })).map(
      (l) => l.title
    )
  );
  const toInsert = SERVICES.filter((s) => !existingTitles.has(s.title));

  if (toInsert.length === 0) {
    console.log("All services already exist. Nothing to insert.");
    return;
  }

  console.log(`Creating ${toInsert.length} new service(s)...`);
  await prisma.listing.createMany({
    data: toInsert.map((s) => ({ ...s, userId: seedUser.id })),
  });

  const counts = await prisma.listing.groupBy({
    by: ["category"],
    _count: { id: true },
  });
  console.log("\nSeeded services by category:");
  counts.forEach((c) => console.log(`  ${c.category}: ${c._count.id}`));
  console.log(`\nTotal: ${SERVICES.length} services seeded successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
