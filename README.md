<div align="center">

# 🌐 MOSTAKIM DOMAINS

**Free Subdomains for Everyone — Powered by GitHub & Cloudflare**

[![GitHub PRs](https://img.shields.io/github/issues-pr/mostakim-labs/domains-register?label=Open%20PRs)](https://github.com/mostakim-labs/domains-register/pulls)
[![GitHub Issues](https://img.shields.io/github/issues/mostakim-labs/domains-register)](https://github.com/mostakim-labs/domains-register/issues)
[![License](https://img.shields.io/github/license/mostakim-labs/domains-register)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmostakim.nav.bd)](https://mostakim.nav.bd/)

Get a free subdomain under `mostakim.xyz` — no sign-up, no fees, just a GitHub Pull Request.

[**→ Register Your Subdomain**](https://mostakim.nav.bd/) · [Browse Open PRs](https://github.com/mostakim-labs/domains-register/pulls) · [Terms](terms.md)

</div>

---

## 🗂️ Available Domains

| Domain | Example | Status |
|--------|---------|--------|
| `mostakim.xyz` | `yourname.mostakim.xyz` | ✅ Active |

---

## ⚡ Quick Start

### 1. Use the Web Form *(Easiest)*

Visit **[mostakim.nav.bd](https://mostakim.nav.bd/)**, fill in the form, download your JSON file, then follow steps 3–5 below.

### 2. Or create the JSON manually

Inside the `domains/` folder, create a file named `your-subdomain.mostakim.xyz.json`:

```json
{
    "description": "My personal website",
    "domain": "mostakim.xyz",
    "subdomain": "yourname",
    "owner": {
        "repo": "https://github.com/your-username/your-repo",
        "email": "your@email.com"
    },
    "record": {
        "CNAME": "your-username.github.io"
    },
    "proxied": false
}
```

### 3. Fork this repository

👉 [https://github.com/mostakim-labs/domains-register/fork](https://github.com/mostakim-labs/domains-register/fork)

### 4. Add your JSON file

Place your file in the `domains/` folder of your fork.

### 5. Open a Pull Request

Go back to [mostakim-labs/domains-register](https://github.com/mostakim-labs/domains-register) → **Contribute → Open Pull Request**.

Title format: `Add yourname.mostakim.xyz`

Once merged, your subdomain goes **live within minutes**. ✅

---

## 📋 All Record Types

| Type | Use Case | Example Value |
|------|----------|---------------|
| `CNAME` | GitHub Pages, Vercel, Netlify | `username.github.io` |
| `A` | Own server (IPv4) | `["1.2.3.4"]` |
| `AAAA` | Own server (IPv6) | `["2001:db8::1"]` |
| `TXT` | Domain verification, SPF | `["v=spf1 include:..."]` |
| `MX` | Email routing | `["mail.example.com"]` |
| `NS` | Custom nameserver | `["ns1.example.com"]` |

> See [CONTRIBUTING.md](CONTRIBUTING.md) for full examples of every record type.

---

## ✅ Validation Rules

| Rule | Detail |
|------|--------|
| Lowercase only | Filename, subdomain, and domain must all be lowercase |
| Filename match | `subdomain.domain.json` must match the JSON `subdomain` + `domain` fields |
| CNAME is exclusive | Cannot combine `CNAME` with any other record type |
| No private IPs | `192.168.x.x`, `10.x.x.x`, `127.x.x.x` are not allowed |
| TXT must be array | `"TXT": ["value"]` ✅ — not `"TXT": "value"` ❌ |

---

## 🛠️ Maintainer Commands

```bash
npm install        # Install dependencies
npm run lt         # Run local validation tool
npm test           # Run full AVA test suite
npm run format     # Auto-format all JSON files
npm run lowercase  # Ensure all filenames are lowercase
npm start          # Start the registration website (port 5000)
```

---

## 🚀 Want to Run Your Own Instance?

This project is a **public template**. You can fork it and run your own free subdomain service on your own domain.

See **[CONTRIBUTING.md → Running Your Own Instance](CONTRIBUTING.md#-running-your-own-instance)** for the full setup guide.

---

## 📞 Contact

| Topic | Contact |
|-------|---------|
| General questions | [GitHub Issues](https://github.com/mostakim-labs/domains-register/issues) |
| Abuse reports | [mostakim.com.mx@gmail.com](mailto:mostakim.com.mx@gmail.com) |
| Website | [mostakim.nav.bd](https://mostakim.nav.bd/) |

---

## 📜 License

[MIT License](LICENSE) — Free to use, fork, and build upon.

---

<div align="center">
<b>MOSTAKIM DOMAINS</b> — Free subdomains, powered by the community.<br/>
<a href="https://mostakim.nav.bd/">mostakim.nav.bd</a> ·
<a href="https://github.com/mostakim-labs/domains-register">GitHub</a> ·
<a href="mailto:mostakim.com.mx@gmail.com">Contact</a>
</div>
