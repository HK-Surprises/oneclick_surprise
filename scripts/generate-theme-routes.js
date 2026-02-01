const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const themesDir = path.join(repoRoot, 'themes');
const targetDir = path.join(repoRoot, 'src', 'app', 'theme');

if (!fs.existsSync(themesDir)) {
  console.error('No themes directory found.');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const themes = fs.readdirSync(themesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

themes.forEach((theme) => {
  const themeAppLayout = path.join(themesDir, theme, 'src', 'app', 'layout.js');
  if (!fs.existsSync(themeAppLayout)) {
    console.log(`Skipping ${theme}, no app layout found.`);
    return;
  }

  const outDir = path.join(targetDir, theme);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const layoutPath = path.join(outDir, 'layout.js');
  const pageDir = path.join(outDir, '[qr_id]');
  const pagePath = path.join(pageDir, 'page.jsx');

  if (!fs.existsSync(layoutPath)) {
    fs.writeFileSync(layoutPath, `import "../../../../themes/${theme}/src/app/globals.css";

export default function ${camelize(theme)}Layout({ children }) {
  return <>{children}</>;
}
`);
    console.log(`Created layout for ${theme}`);
  } else {
    console.log(`Layout exists for ${theme}`);
  }

  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `import { db } from "@/lib/db";

export default async function Page({ params }) {
  const { qr_id } = await params;
  const res = await db.query("SELECT payload, theme_id FROM qr_data WHERE qr_id = $1", [qr_id]);

  if (res.rows.length === 0 || res.rows[0].theme_id !== '${theme}') {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>❌ Invalid or inactive Theme</h2>
        <p>Please make sure the QR has been activated.</p>
      </div>
    );
  }

  const payload = res.rows[0].payload;
  const ThemeApp = (await import("../../../../../themes/${theme}/src/app/page.jsx")).default;
  return <ThemeApp {...payload} />;
}
`);
    console.log(`Created dynamic page for ${theme}`);
  } else {
    console.log(`Dynamic page exists for ${theme}`);
  }
});

console.log('Done.');

function camelize(str) {
  return str
    .split(/[-_]/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}
