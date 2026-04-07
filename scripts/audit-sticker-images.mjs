import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const root = process.cwd();

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const idx = line.indexOf("=");
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      })
  );
}

function stripChannelBinding(url) {
  return url
    .replace(/[?&]channel_binding=require/g, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

const env = {
  ...readEnvFile(path.join(root, ".env")),
  ...process.env,
};

const databaseUrl = stripChannelBinding(env.DIRECT_URL || env.DATABASE_URL || "");
const db = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src", "data", "sticker-image-catalog.json"), "utf8")
);

const catalogMap = new Map(catalog.map((entry) => [entry.key, entry]));

function normalizeEntityName(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function buildCatalogKey(category, name) {
  return `${String(category).toLowerCase()}:${normalizeEntityName(name)}`;
}

function isLocalAsset(url) {
  return typeof url === "string" && url.startsWith("/images/");
}

function assetExists(imagePath) {
  return fs.existsSync(path.join(root, "public", imagePath.replace(/^\//, "")));
}

async function main() {
  let stickers = [];
  let databaseError = null;

  try {
    stickers = await db.sticker.findMany({
      select: {
        id: true,
        number: true,
        name: true,
        team: true,
        category: true,
        imageUrl: true,
      },
      orderBy: { number: "asc" },
    });
  } catch (error) {
    databaseError = error instanceof Error ? error.message : String(error);
  }

  const byCategory = new Map();
  const readyLocal = [];
  const remoteOnly = [];
  const missing = [];

  for (const sticker of stickers) {
    byCategory.set(sticker.category, (byCategory.get(sticker.category) ?? 0) + 1);

    const key = buildCatalogKey(sticker.category, sticker.name);
    const entry = catalogMap.get(key);

    if (entry && assetExists(entry.imagePath)) {
      readyLocal.push(sticker);
      continue;
    }

    if (isLocalAsset(sticker.imageUrl) && assetExists(sticker.imageUrl)) {
      readyLocal.push(sticker);
      continue;
    }

    if (sticker.imageUrl && sticker.imageUrl.trim()) {
      remoteOnly.push({ ...sticker, catalogKey: key });
      continue;
    }

    missing.push({ ...sticker, catalogKey: key });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    database: {
      connected: !databaseError,
      error: databaseError,
    },
    totals: {
      stickers: stickers.length,
      catalogEntries: catalog.length,
      readyLocal: readyLocal.length,
      remoteOnly: remoteOnly.length,
      missing: missing.length,
      localFiles: catalog.filter((entry) => assetExists(entry.imagePath)).length,
    },
    categories: Object.fromEntries([...byCategory.entries()].sort()),
    samples: {
      remoteOnly: remoteOnly.slice(0, 25),
      missing: missing.slice(0, 25),
    },
  };

  const outDir = path.join(root, "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "sticker-image-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log("Sticker image audit complete");
  if (databaseError) {
    console.log("Database audit skipped due to connection error");
    console.log(databaseError);
  } else {
    console.log(`Total stickers: ${report.totals.stickers}`);
    console.log(`Local ready: ${report.totals.readyLocal}`);
    console.log(`Remote only: ${report.totals.remoteOnly}`);
    console.log(`Missing: ${report.totals.missing}`);
  }
  console.log(`Catalog entries: ${report.totals.catalogEntries}`);
  console.log(`Existing local files in catalog: ${report.totals.localFiles}`);
  console.log(`Report: ${outPath}`);
}

main()
  .catch((error) => {
    console.error("Sticker image audit failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
