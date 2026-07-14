# Contributing to MOSTAKIM DOMAINS

Thank you for wanting to register a subdomain or contribute to this project! This guide covers everything you need — from registering a single subdomain, to running your own instance of this service on a completely different domain.

---

## Table of Contents

- [Registering a Subdomain](#-registering-a-subdomain)
- [JSON File Structure](#-json-file-structure)
- [All Record Type Examples](#-all-record-type-examples)
- [Adding Multiple Subdomains](#-adding-multiple-subdomains)
- [PR Rules & Guidelines](#-pr-rules--guidelines)
- [Running Your Own Instance](#-running-your-own-instance)
  - [Step 1 — Fork & rename](#step-1--fork--rename-the-repo)
  - [Step 2 — Change the domain](#step-2--change-the-domain-name)
  - [Step 3 — Cloudflare setup](#step-3--cloudflare-setup)
  - [Step 4 — GitHub Secrets](#step-4--add-github-secrets)
  - [Step 5 — Deploy the website](#step-5--deploy-the-registration-website)
  - [Step 6 — Test everything](#step-6--test-everything)
- [Prohibited Uses](#-prohibited-uses)

---

## 📝 Registering a Subdomain

### Option A — Use the web form *(recommended)*

1. Visit **[mostakim.nav.bd](https://mostakim.nav.bd/)**
2. Fill in your subdomain name and DNS record details
3. Click **Download JSON File**
4. Continue with Step 2 below

### Option B — Create the file manually

Create a `.json` file inside the `domains/` folder. The filename format is:

```
domains/your-subdomain.mostakim.xyz.json
```

---

### Full registration flow

```
1. Fork this repo  →  2. Add your JSON file  →  3. Open a PR  →  4. Merge  →  5. Live ✅
```

**Step 1 — Fork the repository**

Click **Fork** on GitHub:
```
https://github.com/mostakim-labs/domains-register/fork
```

**Step 2 — Create your JSON file**

In the `domains/` folder of your fork, create:
```
domains/yourname.mostakim.xyz.json
```

**Step 3 — Open a Pull Request**

- Go to [github.com/mostakim-labs/domains-register](https://github.com/mostakim-labs/domains-register)
- Click **Contribute → Open Pull Request**
- Use a clear title: `Add yourname.mostakim.xyz`

**Step 4 — Wait for checks**

GitHub Actions will automatically validate your file. If all checks pass, a maintainer will review and merge your PR. Your subdomain goes live **within minutes** of merging.

---

## 📄 JSON File Structure

```json
{
    "description": "A short description of your site",
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

### Field reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Short description of your project |
| `domain` | string | **Yes** | Root domain — must be `mostakim.xyz` |
| `subdomain` | string | **Yes** | Your chosen subdomain (e.g. `yourname`) |
| `owner.repo` | string | **Yes** | Full URL of your GitHub repository |
| `owner.email` | string | No | Your contact email |
| `record` | object | **Yes** | DNS record — see examples below |
| `proxied` | boolean | No | Enable Cloudflare proxy (default: `false`) |

---

## 🔧 All Record Type Examples

### CNAME — GitHub Pages / Vercel / Netlify

```json
{
    "description": "My GitHub Pages site",
    "domain": "mostakim.xyz",
    "subdomain": "yourname",
    "owner": {
        "repo": "https://github.com/yourname/yourname.github.io",
        "email": "your@email.com"
    },
    "record": {
        "CNAME": "yourname.github.io"
    },
    "proxied": false
}
```

> ⚠️ `CNAME` cannot be combined with any other record type.

---

### A — Own Server (IPv4)

```json
{
    "description": "My VPS",
    "domain": "mostakim.xyz",
    "subdomain": "yourname",
    "owner": {
        "repo": "https://github.com/yourname/my-server",
        "email": "your@email.com"
    },
    "record": {
        "A": ["1.2.3.4"]
    },
    "proxied": false
}
```

> Multiple IPs are allowed: `"A": ["1.2.3.4", "5.6.7.8"]`

---

### AAAA — Own Server (IPv6)

```json
{
    "record": {
        "AAAA": ["2001:db8::1"]
    }
}
```

---

### TXT — Domain Verification / SPF

```json
{
    "record": {
        "TXT": ["google-site-verification=xxxxxxxxxxxx"]
    }
}
```

> ⚠️ `TXT` must always be an **array**: `["value"]` ✅ — `"value"` ❌

Multiple TXT values:
```json
{
    "record": {
        "TXT": ["v=spf1 include:sendgrid.net ~all", "google-site-verification=abc123"]
    }
}
```

---

### MX — Email Routing

```json
{
    "record": {
        "MX": ["mail.example.com"]
    }
}
```

---

### NS — Custom Nameserver

```json
{
    "record": {
        "NS": ["ns1.example.com", "ns2.example.com"]
    }
}
```

> ⚠️ NS record requests are subject to additional manual review.

---

### A + TXT — Server with verification

You can combine A (or AAAA) with TXT:

```json
{
    "record": {
        "A": ["1.2.3.4"],
        "TXT": ["google-site-verification=xxxxxxxxxxxx"]
    }
}
```

---

## ➕ Adding Multiple Subdomains

You can register as many subdomains as you need — just submit a **separate JSON file** for each one.

**Example — registering 3 subdomains:**

```
domains/
├── blog.mostakim.xyz.json
├── api.mostakim.xyz.json
└── docs.mostakim.xyz.json
```

Each file is independent. You can submit them in a single PR:

```
PR title: Add blog, api, docs subdomains
```

Or submit separate PRs — whichever is cleaner for your use case.

---

## ✅ PR Rules & Guidelines

| Rule | Detail |
|------|--------|
| **Lowercase** | Filename, `subdomain`, and `domain` must all be lowercase |
| **Filename match** | `yourname.mostakim.xyz.json` must match `"subdomain": "yourname"` and `"domain": "mostakim.xyz"` |
| **CNAME is exclusive** | If you use `CNAME`, no other record type is allowed in that file |
| **No private IPs** | `192.168.x.x`, `10.x.x.x`, `172.16.x.x`, `127.x.x.x` are rejected |
| **TXT is an array** | `"TXT": ["value"]` ✅ — not `"TXT": "value"` ❌ |
| **One subdomain per file** | Each JSON file registers exactly one subdomain |
| **Valid JSON** | File must be valid, properly formatted JSON |
| **Real project** | Subdomain must point to a real, working project or server |

---

## 🚀 Running Your Own Instance

This project is a **public template**. Anyone can fork it and offer free subdomains under their own domain (e.g. `yourname.yourdomain.com`).

### Step 1 — Fork & rename the repo

1. Fork this repo on GitHub
2. Rename it to something like `domains-register` or `free-subdomains`
3. Delete all files inside `domains/` except `example.yourdomain.json` (rename that too)

---

### Step 2 — Change the domain name

You need to replace every occurrence of `mostakim.xyz` with your own domain across the project.

**Files to update:**

#### `domains/example.yourdomain.json` (rename + edit)
```json
{
    "description": "Example subdomain",
    "domain": "yourdomain.com",
    "subdomain": "example",
    ...
}
```

#### `tests/json.test.js`
Find:
```js
const DOMAINS = ["mostakim.xyz"];
```
Change to:
```js
const DOMAINS = ["yourdomain.com"];
```

#### `localtests/test.js`
Same change — find `mostakim.xyz` and replace with your domain.

#### `server.js`
Find the availability check endpoint:
```js
const filename = `${raw}.mostakim.xyz.json`;
```
Change to:
```js
const filename = `${raw}.yourdomain.com.json`;
```
Also update the filter in the `/api/domains` route:
```js
f.endsWith(".mostakim.xyz.json")
```
→
```js
f.endsWith(".yourdomain.com.json")
```

#### `public/index.html` and `public/app.js`
Search for `mostakim.xyz` and replace with `yourdomain.com` throughout.

#### `README.md`, `CONTRIBUTING.md`, `terms.md`
Update all mentions of `mostakim.xyz`, `mostakim-labs/domains-register`, and contact info.

---

### Step 3 — Cloudflare Setup

Your domain **must be on Cloudflare** for the automated DNS publishing to work.

1. Buy your domain from any registrar (Porkbun, Namecheap, etc.)
2. Go to [cloudflare.com](https://cloudflare.com) → **Add a Site** → enter your domain
3. Cloudflare will give you two nameservers — set them at your registrar
4. Wait for DNS propagation (usually 5–30 minutes)
5. Create a Cloudflare API Token:
   - Go to **My Profile → API Tokens → Create Token**
   - Use template: **Edit zone DNS**
   - Set **Zone Resources** to your specific domain
   - Copy the generated token

---

### Step 4 — Add GitHub Secrets

In your forked GitHub repo:

Go to **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `CF_API_TOKEN` | Your Cloudflare API token from Step 3 |
| `APP_ID` | Your GitHub App ID (for auto-merging) |
| `PRIVATE_KEY` | Your GitHub App private key |

> **CF_API_TOKEN** is the most important one — without it, DNS records won't publish.

**To get APP_ID and PRIVATE_KEY:**
1. Go to **GitHub Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Give it **Read & Write** access to Pull Requests and Contents
3. Install it on your repo
4. Copy the **App ID** and generate + download a **Private Key**

---

### Step 5 — Deploy the Registration Website

The `server.js` Express app is the registration website. You can deploy it anywhere:

#### Vercel (recommended — free)
The repo already includes `vercel.json`. Just:
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your forked GitHub repo
3. Click **Deploy** — done!

Every time a new domain PR is merged and pushed to `main`, Vercel will auto-redeploy and the availability checker will stay up to date.

#### Replit
Already configured — just run `npm start` or use the **Start application** workflow.

#### Any Node.js host (Railway, Render, Fly.io)
```bash
npm install
npm start   # Starts on port 5000
```

---

### Step 6 — Test Everything

Run the local test suite to make sure all domain references are correct:

```bash
npm install
npm run lt      # Local validation — checks all files in domains/
npm test        # Full AVA test suite
```

If all tests pass, your instance is ready. Push to GitHub, let GitHub Actions validate, and start sharing your new free subdomain service!

---

## 🚫 Prohibited Uses

The following are **not allowed** and will result in immediate removal and a ban:

- Illegal or harmful content
- Spam, phishing, or malware distribution
- Impersonating other brands or trademarks
- Adult or NSFW content
- Cryptocurrency scams or pump-and-dump schemes
- Anything that violates [GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)

---

## ❓ Questions?

- Open a [GitHub Issue](https://github.com/mostakim-labs/domains-register/issues)
- Email: [mostakim.com.mx@gmail.com](mailto:mostakim.com.mx@gmail.com)
- Website: [mostakim.nav.bd](https://mostakim.nav.bd/)
