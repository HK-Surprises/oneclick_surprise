import { db } from "@/lib/db";

export default async function Page({ params }) {
  const { qr_id } = await params;
  const res = await db.query("SELECT payload, theme_id FROM qr_data WHERE qr_id = $1", [qr_id]);

  if (res.rows.length === 0 || res.rows[0].theme_id != 'birthday_1') {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>❌ Invalid or inactive Theme</h2>
        <p>Please make sure the QR has been activated.</p>
      </div>
    );
  }

  const payload = res.rows[0].payload;
  const ThemeApp = (await import("../../../../../themes/birthday_1/src/app/page.jsx")).default;
  return <ThemeApp {...payload} />;
}
