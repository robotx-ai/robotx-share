import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { getWritesBlockedResponse } from "@/lib/writeGuard";
import { NextResponse } from "next/server";

interface IPrisma {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IPrisma }) {
  const writesBlocked = getWritesBlockedResponse();
  if (writesBlocked) return writesBlocked;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  const favorite = await prisma.userFavorite.upsert({
    where: {
      userId_listingId: {
        userId: currentUser.id,
        listingId,
      },
    },
    create: {
      userId: currentUser.id,
      listingId,
    },
    update: {},
  });

  return NextResponse.json(favorite);
}

export async function DELETE(
  request: Request,
  { params }: { params: IPrisma }
) {
  const writesBlocked = getWritesBlockedResponse();
  if (writesBlocked) return writesBlocked;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  const favorite = await prisma.userFavorite.deleteMany({
    where: {
      userId: currentUser.id,
      listingId,
    },
  });

  return NextResponse.json(favorite);
}
