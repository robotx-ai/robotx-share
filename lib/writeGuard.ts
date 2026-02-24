import { NextResponse } from "next/server";

export function getWritesBlockedResponse() {
  if (process.env.DB_MIGRATION_READ_ONLY !== "true") {
    return null;
  }

  return NextResponse.json(
    { error: "Writes are temporarily disabled for database migration." },
    { status: 503 }
  );
}
