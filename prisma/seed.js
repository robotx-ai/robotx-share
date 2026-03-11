// @ts-check
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CLD =
  "https://res.cloudinary.com/dmrhtzqyx/image/upload/q_auto,f_auto";
const VID =
  "https://res.cloudinary.com/dmrhtzqyx/video/upload/q_auto,f_auto";

const SERVICES = [
  // ── Showcase & Performance ──
  {
    title: "Unitree H1 — Humanoid Performer",
    description:
      "Full-size humanoid robot standing 1.8m tall with 43 degrees of freedom. Built for synchronized group choreography, grand openings, and live stage performances. Proven at large-scale cultural events with multi-unit coordination.",
    imageSrc: `${CLD}/listing-unitree-h1`,
    videoSrc: `${VID}/hero-showcase.mp4`,
    category: "Showcase & Performance",
    price: 650,
    locationValue: "Los Angeles, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 500,
  },
  {
    title: "Unitree Go2 — Quadruped Showcase",
    description:
      "Next-generation quadruped robot with embodied AI and autonomous terrain navigation. Draws crowds at tech showcases and exhibitions with fluid, lifelike movement. Suitable for indoor and outdoor event environments.",
    imageSrc: `${CLD}/listing-unitree-go2`,
    videoSrc: `${VID}/exhibition-bg.mp4`,
    category: "Showcase & Performance",
    price: 420,
    locationValue: "San Diego, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 300,
  },
  {
    title: "AgiBot A2 — Humanoid Brand Ambassador",
    description:
      "1.75m humanoid robot with 40+ degrees of freedom and L4-level autonomous navigation. Delivers guided tours, product demos, and interactive brand experiences in multiple languages. Ideal for exhibitions, product launches, and retail activations.",
    imageSrc: `${CLD}/listing-agibot-a2`,
    videoSrc: `${VID}/party-bg.mp4`,
    category: "Showcase & Performance",
    price: 580,
    locationValue: "Irvine, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 400,
  },

  // ── Warehouse ──
  {
    title: "Unitree B2 — Industrial Inspection Unit",
    description:
      "Industrial-grade quadruped robot built for demanding facility environments. Performs autonomous security patrols, equipment inspections, and hazard detection in warehouses, power facilities, and manufacturing plants. Operates 24/7 in challenging conditions.",
    imageSrc: `${CLD}/listing-unitree-b2`,
    videoSrc: `${VID}/hero-warehouse.mp4`,
    category: "Warehouse",
    price: 420,
    locationValue: "Commerce, CA",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 20,
  },
  {
    title: "AgiBot G2 — Precision Assembly Robot",
    description:
      "1.8m dual-arm humanoid with 7-DOF force-controlled arms and submillimeter positioning accuracy. Automotive-grade components and hot-swappable batteries for continuous 24/7 operation. Handles precision assembly, quality inspection, and high-value logistics tasks.",
    imageSrc: `${CLD}/listing-agibot-g2`,
    videoSrc: null,
    category: "Warehouse",
    price: 450,
    locationValue: "Torrance, CA",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 15,
  },
  {
    title: "PUDU FlashBot — Multi-Floor Courier",
    description:
      "Autonomous delivery robot engineered for multi-floor logistics in commercial buildings. Integrates with elevators and access control systems for seamless inter-department parcel and document transport. Reduces manual courier load in large facilities.",
    imageSrc: `${CLD}/listing-pudu-flashbot`,
    videoSrc: null,
    category: "Warehouse",
    price: 260,
    locationValue: "Carson, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 50,
  },

  // ── Restaurant ──
  {
    title: "PUDU BellaBot — Dining Service Robot",
    description:
      "Premium food and beverage delivery robot for restaurants, hotels, and hospitality venues. Navigates dining rooms autonomously, delivers to tables, and handles plate retrieval. Deployed in 60+ countries with proven commercial reliability.",
    imageSrc: `${CLD}/listing-pudu-bellabot`,
    videoSrc: `${VID}/hero-restaurant.mp4`,
    category: "Restaurant",
    price: 240,
    locationValue: "Los Angeles, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 80,
  },
  {
    title: "PUDU KettyBot — Host & Receptionist",
    description:
      "Multi-purpose service robot combining front-desk reception, queue management, and promotional display. Features an integrated screen for menus, wayfinding, and brand content. Reduces manual reception workload in restaurants, hotels, and corporate lobbies.",
    imageSrc: `${CLD}/listing-pudu-kettybot`,
    videoSrc: null,
    category: "Restaurant",
    price: 190,
    locationValue: "Pasadena, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 100,
  },
  {
    title: "PUDU CC1 Pro — Commercial Cleaning Unit",
    description:
      "4-in-1 autonomous cleaning robot handling sweeping, mopping, scrubbing, and drying in a single pass. Covers large commercial floor areas efficiently with 20,000+ units deployed across 80+ countries. Ideal for restaurant kitchens, dining halls, and hospitality venues.",
    imageSrc: `${CLD}/listing-pudu-cc1`,
    videoSrc: null,
    category: "Restaurant",
    price: 175,
    locationValue: "Burbank, CA",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 30,
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

  // Clear existing listings owned by the seed admin so we always get a clean slate
  const deleted = await prisma.listing.deleteMany({
    where: { userId: seedUser.id },
  });
  if (deleted.count > 0) {
    console.log(`Removed ${deleted.count} existing listing(s) for ${adminEmail}`);
  }

  console.log(`Creating ${SERVICES.length} service(s)...`);
  await prisma.listing.createMany({
    data: SERVICES.map((s) => ({ ...s, userId: seedUser.id })),
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
