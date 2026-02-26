import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { hasRobotxAdminConfig, isRobotxAdminEmail } from "@/lib/robotxAdmin";
import { getWritesBlockedResponse } from "@/lib/writeGuard";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const writesBlocked = getWritesBlockedResponse();
  if (writesBlocked) return writesBlocked;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasRobotxAdminConfig()) {
    return NextResponse.json(
      { error: "ROBOTX_ADMIN_EMAILS is not configured." },
      { status: 500 }
    );
  }

  if (!isRobotxAdminEmail(currentUser.email)) {
    return NextResponse.json(
      { error: "Forbidden: admin access required." },
      { status: 403 }
    );
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid service id." }, { status: 400 });
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
    },
  });

  return NextResponse.json(listing);
}
