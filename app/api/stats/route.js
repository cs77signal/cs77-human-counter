
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

const KEYS = {
  uniqueHumans: "cs77:human-counter:unique-humans",
  verificationRequests: "cs77:human-counter:verification-requests",
  successfulVerifications:
    "cs77:human-counter:successful-verifications",
  failedAttempts: "cs77:human-counter:failed-attempts",
};

export async function GET() {
  try {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_READ_ONLY_TOKEN,
    });

    const [
      uniqueHumans,
      verificationRequests,
      successfulVerifications,
      failedAttempts,
    ] = await redis.mget(
      KEYS.uniqueHumans,
      KEYS.verificationRequests,
      KEYS.successfulVerifications,
      KEYS.failedAttempts
    );

    const stats = {
      uniqueHumans: Number(uniqueHumans ?? 0),
      verificationRequests: Number(verificationRequests ?? 0),
      successfulVerifications: Number(
        successfulVerifications ?? 0
      ),
      failedAttempts: Number(failedAttempts ?? 0),
    };

    if (
      Object.values(stats).some(
        (value) => !Number.isSafeInteger(value) || value < 0
      )
    ) {
      throw new Error("Invalid statistics data");
    }

    return NextResponse.json(
      {
        success: true,
        stats,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Statistics temporarily unavailable",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
