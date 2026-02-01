import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SetupForm from "@/components/SetupForm";

export default async function QRPage({ params }) {
    const { qr_id } = await params;
    console.log("DB connected");
    // 1️⃣ check QR exists
    const masterRes = await db.query(
      "SELECT is_used FROM qr_master WHERE qr_id = $1",
      [qr_id]
    );

    if (masterRes.rows.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: 40 }}>
          <h2>❌ Invalid QR Code</h2>
          <p>Please scan the QR provided with your gift.</p>
        </div>
      );
    }

    // 2️⃣ check QR data
    const dataRes = await db.query(
      "SELECT theme_id, payload FROM qr_data WHERE qr_id = $1",
      [qr_id]
    );


    // already activated
  if (dataRes.rows.length > 0) {
    const row = dataRes.rows[0];
    const { theme_id } = row;
    console.log("Redirecting to theme page");
    redirect(`/theme/${theme_id}/${qr_id}`);
  }



    // valid but not activated
  return <SetupForm qrId={qr_id} />;
}
