import prisma from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        favoriteListings: {
          select: {
            listingId: true,
          },
        },
      },
    });

    if (!currentUser) {
      return null;
    }

    const { favoriteListings, ...safeCurrentUser } = currentUser;

    return {
      ...safeCurrentUser,
      createdAt: safeCurrentUser.createdAt.toISOString(),
      updatedAt: safeCurrentUser.updatedAt.toISOString(),
      emailVerified: safeCurrentUser.emailVerified?.toISOString() || null,
      favoriteListingIds: favoriteListings.map((favorite) => favorite.listingId),
    };
  } catch (error: any) {
    console.log(
      "🚀 ~ file: getCurrentUser.ts:13 ~ getCurrentUser ~ error:",
      error
    );
  }
}
