import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    // accept either camelCase (`qrId`) or snake_case (`qr_id`) for forwards/backwards compatibility
    const qrId = formData.get("qrId") || formData.get("qr_id");
    const themeId = formData.get("theme_id") || formData.get("themeId");
    const payloadRaw = formData.get("payload"); // 👈 JSON string
    const photos = formData.getAll("photos");

    if (!qrId || !themeId || !payloadRaw) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(payloadRaw);

    // debug info for incoming activation requests
    console.debug("activate-qr payload:", { qrId, themeId, keys: Object.keys(payload) });

    /* ───────────────────── QR SAFETY CHECK ───────────────────── */
    const qrCheck = await db.query(
      "SELECT is_used FROM qr_master WHERE qr_id = $1 AND is_used = false",
      [qrId]
    );

    if (qrCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or already used QR" },
        { status: 400 }
      );
    }

    /* ───────────────────── IMAGE UPLOAD ───────────────────── */
    const photoUrls = [];

    for (const file of photos) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `qr/${qrId}` },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      photoUrls.push(upload.secure_url);
    }

    // attach images to payload
    payload.photos = photoUrls;

    /* ───────────────────── SAVE QR DATA ───────────────────── */
    const payloadJson = JSON.stringify(payload);

    await db.query(
      `
      INSERT INTO qr_data (qr_id, theme_id, payload)
      VALUES ($1, $2, $3)
      ON CONFLICT (qr_id)
      DO UPDATE SET
        theme_id = EXCLUDED.theme_id,
        payload = EXCLUDED.payload
      `,
      [qrId, themeId, payloadJson]
    );

    /* ───────────────────── MARK QR USED ───────────────────── */
    await db.query(
      "UPDATE qr_master SET is_used = true WHERE qr_id = $1",
      [qrId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activate QR Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
