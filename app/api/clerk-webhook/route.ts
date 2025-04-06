import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    console.log("Webhook request received");

    // Log headers to check for auth headers
    const headers = Object.fromEntries(req.headers.entries());
    console.log("Request headers:", JSON.stringify(headers, null, 2));

    const body = await req.json();
    console.log("Received webhook body:", JSON.stringify(body, null, 2));

    // Log the event type
    console.log("Event type:", body?.type);

    const { id, email_addresses, first_name, image_url } = body?.data;
    console.log("Extracted data:", {
      id,
      email_addresses,
      first_name,
      image_url,
    });

    if (!id || !email_addresses || !email_addresses[0]?.email_address) {
      console.error("Missing required fields:", { id, email_addresses });
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const email = email_addresses[0]?.email_address;
    console.log("Processing user data:", { id, email, first_name, image_url });

    try {
      const user = await db.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: first_name,
          profileImage: image_url,
        },
        create: {
          clerkId: id,
          email,
          name: first_name || "",
          profileImage: image_url || "",
        },
      });

      console.log("User successfully upserted:", user);
      return new NextResponse("User updated in database successfully", {
        status: 200,
      });
    } catch (dbError) {
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Database operation failed:", dbError);
        console.error("Error details:", {
          code: dbError.code,
          meta: dbError.meta,
          message: dbError.message,
          stack: dbError.stack,
        });
      } else {
        console.error("Unknown database error:", dbError);
      }

      return new NextResponse(
        `Database error: ${
          dbError instanceof Error ? dbError.message : "Unknown database error"
        }`,
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Detailed error in webhook:", error);

    if (error instanceof Error) {
      console.error("Error type:", typeof error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Log additional properties that might be in the error object
    try {
      console.error(
        "Additional error details:",
        JSON.stringify(error, null, 2)
      );
    } catch (jsonError) {
      console.error(
        "Error could not be stringified:",
        jsonError instanceof Error ? jsonError.message : String(jsonError)
      );
    }

    return new NextResponse(
      `Error processing webhook: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
