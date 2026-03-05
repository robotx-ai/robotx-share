import prisma from "@/lib/prismadb";
import { getWritesBlockedResponse } from "@/lib/writeGuard";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const writesBlocked = getWritesBlockedResponse();
  if (writesBlocked) return writesBlocked;

  const body = await request.json();
  const { email, name, password, userType, phone, businessName } = body;

  if (userType !== "CUSTOMER" && userType !== "PROVIDER") {
    return NextResponse.json({ error: "Invalid user type." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      userType,
      ...(phone ? { phone } : {}),
      ...(businessName ? { businessName } : {}),
    },
  });

  return NextResponse.json(user);
}
