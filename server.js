const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;
const DOMAINS_DIR = path.join(__dirname, "domains");

app.use(express.static(path.join(__dirname, "public")));

// Availability check API
app.get("/api/check/:subdomain", (req, res) => {
  const raw = req.params.subdomain.toLowerCase().trim();

  // Validate format: only lowercase letters, numbers, hyphens, dots
  if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(raw) || raw.length < 1) {
    return res.json({ available: false, reason: "invalid" });
  }

  const filename = `${raw}.mostakim.xyz.json`;
  const filepath = path.join(DOMAINS_DIR, filename);
  const taken = fs.existsSync(filepath);

  res.json({ available: !taken, subdomain: raw, filename });
});

// List all registered subdomains
app.get("/api/domains", (req, res) => {
  try {
    const files = fs.readdirSync(DOMAINS_DIR).filter(f =>
      f.endsWith(".mostakim.xyz.json") && fs.lstatSync(path.join(DOMAINS_DIR, f)).isFile()
    );
    const domains = files.map(f => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(DOMAINS_DIR, f), "utf8"));
        return {
          subdomain: data.subdomain,
          description: data.description || "",
          record: Object.keys(data.record || {})[0] || "",
        };
      } catch { return null; }
    }).filter(Boolean);
    res.json({ count: domains.length, domains });
  } catch {
    res.json({ count: 0, domains: [] });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MOSTAKIM DOMAINS running at http://0.0.0.0:${PORT}`);
});
