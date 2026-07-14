let currentRecord = "CNAME";
let generatedData = null;
let availTimer = null;
let lastChecked = "";
let isAvailable = false;

// ── HAMBURGER MENU ────────────────────────────
function toggleMenu() {
  const links = document.getElementById("navLinks");
  const burger = document.getElementById("navBurger");
  links.classList.toggle("open");
  burger.classList.toggle("open");
}
function closeMenu() {
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("navBurger").classList.remove("open");
}
document.addEventListener("click", (e) => {
  const nav = document.querySelector(".navbar");
  if (nav && !nav.contains(e.target)) closeMenu();
});
// ── END HAMBURGER ─────────────────────────────

const recordHints = {
  CNAME: "Points to another hostname — e.g. username.github.io or myapp.vercel.app",
  A:     "Points to an IPv4 address — e.g. 1.2.3.4",
  AAAA:  "Points to an IPv6 address — e.g. 2001:db8::1",
  TXT:   "Text record value — e.g. google-site-verification=xxxxx",
  MX:    "Mail server hostname — e.g. mail.example.com",
  NS:    "Nameserver hostname — e.g. ns1.example.com",
};

const recordPlaceholders = {
  CNAME: "username.github.io",
  A:     "1.2.3.4",
  AAAA:  "2001:db8::1",
  TXT:   "google-site-verification=xxxxxxxxxx",
  MX:    "mail.example.com",
  NS:    "ns1.example.com",
};

const recordLabels = {
  CNAME: "Points to (hostname)",
  A:     "IPv4 address",
  AAAA:  "IPv6 address",
  TXT:   "Text value",
  MX:    "Mail server hostname",
  NS:    "Nameserver hostname",
};

function setRecord(type) {
  currentRecord = type;
  document.querySelectorAll(".rtab").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  document.getElementById("recordHint").textContent = recordHints[type];
  document.getElementById("recordValueLabel").innerHTML = recordLabels[type] + ' <span class="req">*</span>';
  document.getElementById("recordValue").placeholder = recordPlaceholders[type];
  document.getElementById("recordValue").value = "";

  // Show/hide proxy toggle based on record type
  const proxiedGroup = document.getElementById("proxied").closest(".form-group");
  proxiedGroup.style.display = (type === "A" || type === "AAAA" || type === "CNAME") ? "block" : "none";

  generate();
}

// ─── AVAILABILITY CHECKER ─────────────────────────────────────────────────────

function onSubdomainInput() {
  const raw = document.getElementById("subdomain").value.trim().toLowerCase();
  const wrap = document.getElementById("subdomainWrap");
  const indicator = document.getElementById("availIndicator");
  const msg = document.getElementById("availMsg");

  // Reset state
  wrap.classList.remove("is-available", "is-taken");
  indicator.className = "avail-indicator";
  indicator.textContent = "";
  isAvailable = false;

  if (!raw) {
    msg.textContent = "Lowercase letters, numbers, and hyphens only";
    msg.className = "field-hint";
    generate();
    return;
  }

  // Validate format client-side first
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(raw)) {
    indicator.textContent = "✕ Invalid";
    indicator.className = "avail-indicator taken";
    wrap.classList.add("is-taken");
    msg.textContent = "Only lowercase letters, numbers, and hyphens allowed. No spaces.";
    msg.className = "field-hint taken";
    generate();
    return;
  }

  // Show checking state
  indicator.textContent = "···";
  indicator.className = "avail-indicator checking";
  msg.textContent = "Checking availability…";
  msg.className = "field-hint";

  clearTimeout(availTimer);
  availTimer = setTimeout(() => checkAvailability(raw), 500);

  generate();
}

async function checkAvailability(subdomain) {
  const wrap = document.getElementById("subdomainWrap");
  const indicator = document.getElementById("availIndicator");
  const msg = document.getElementById("availMsg");

  if (lastChecked === subdomain) return;
  lastChecked = subdomain;

  try {
    const res = await fetch(`/api/check/${encodeURIComponent(subdomain)}`);
    const data = await res.json();

    // Make sure subdomain hasn't changed while we were fetching
    const current = document.getElementById("subdomain").value.trim().toLowerCase();
    if (current !== subdomain) return;

    if (data.reason === "invalid") {
      indicator.textContent = "✕ Invalid";
      indicator.className = "avail-indicator taken";
      wrap.classList.add("is-taken");
      msg.textContent = "Invalid subdomain format.";
      msg.className = "field-hint taken";
      isAvailable = false;
    } else if (data.available) {
      indicator.textContent = "✓ Available";
      indicator.className = "avail-indicator available";
      wrap.classList.remove("is-taken");
      wrap.classList.add("is-available");
      msg.textContent = `✓ ${subdomain}.mostakim.xyz is available!`;
      msg.className = "field-hint available";
      isAvailable = true;
    } else {
      indicator.textContent = "✕ Taken";
      indicator.className = "avail-indicator taken";
      wrap.classList.remove("is-available");
      wrap.classList.add("is-taken");
      msg.textContent = `✕ ${subdomain}.mostakim.xyz is already registered.`;
      msg.className = "field-hint taken";
      isAvailable = false;
    }

    generate();
  } catch {
    indicator.textContent = "";
    indicator.className = "avail-indicator";
    msg.textContent = "Could not check availability.";
    msg.className = "field-hint";
  }
}

// ─── END AVAILABILITY CHECKER ─────────────────────────────────────────────────

function sanitize(str) {
  return str.replace(/[<>&"]/g, "");
}

function generate() {
  const subdomain = sanitize(document.getElementById("subdomain").value.trim().toLowerCase());
  const recordValue = sanitize(document.getElementById("recordValue").value.trim());
  const ownerRepo = sanitize(document.getElementById("ownerRepo").value.trim());
  const ownerEmail = sanitize(document.getElementById("ownerEmail").value.trim());
  const description = sanitize(document.getElementById("description").value.trim());
  const proxied = document.getElementById("proxied").checked;

  const pre = document.getElementById("jsonPreview");
  const codeEl = document.getElementById("jsonCode");
  const downloadBtn = document.getElementById("downloadBtn");
  const filenameBox = document.getElementById("filenameBox");
  const filenameOutput = document.getElementById("filenameOutput");
  const nextSteps = document.getElementById("nextSteps");

  if (!subdomain || !recordValue || !ownerRepo) {
    codeEl.innerHTML = '<span class="j-comment">// Fill in the required fields to generate your JSON file</span>';
    downloadBtn.disabled = true;
    filenameBox.style.display = "none";
    nextSteps.style.display = "none";
    generatedData = null;
    return;
  }

  // Build record object
  let recordObj = {};
  if (currentRecord === "CNAME") {
    recordObj = { CNAME: recordValue };
  } else if (currentRecord === "A") {
    recordObj = { A: [recordValue] };
  } else if (currentRecord === "AAAA") {
    recordObj = { AAAA: [recordValue] };
  } else if (currentRecord === "TXT") {
    recordObj = { TXT: [recordValue] };
  } else if (currentRecord === "MX") {
    recordObj = { MX: [recordValue] };
  } else if (currentRecord === "NS") {
    recordObj = { NS: [recordValue] };
  }

  // Build full JSON
  const data = {
    ...(description ? { description } : {}),
    domain: "mostakim.xyz",
    subdomain,
    owner: {
      repo: ownerRepo,
      ...(ownerEmail ? { email: ownerEmail } : {}),
    },
    record: recordObj,
    proxied: (currentRecord === "A" || currentRecord === "AAAA" || currentRecord === "CNAME") ? proxied : false,
  };

  generatedData = data;
  const jsonStr = JSON.stringify(data, null, 4);
  const filename = `${subdomain}.mostakim.xyz.json`;

  // Syntax-highlight the JSON
  codeEl.innerHTML = syntaxHighlight(jsonStr);

  // Filename
  filenameOutput.textContent = filename;
  filenameBox.style.display = "flex";

  downloadBtn.disabled = false;
  nextSteps.style.display = "block";
}

function syntaxHighlight(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "j-num";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "j-key";
        } else {
          cls = "j-str";
        }
      } else if (/true|false/.test(match)) {
        cls = "j-bool";
      } else if (/null/.test(match)) {
        cls = "j-null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

function copyJSON() {
  if (!generatedData) return;
  const jsonStr = JSON.stringify(generatedData, null, 4);
  navigator.clipboard.writeText(jsonStr).then(() => {
    const btn = document.getElementById("copyBtn");
    btn.textContent = "✓ Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "⎘ Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

function downloadJSON() {
  if (!generatedData) return;
  const subdomain = generatedData.subdomain;
  const filename = `${subdomain}.mostakim.xyz.json`;
  const jsonStr = JSON.stringify(generatedData, null, 4);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  setRecord("CNAME");
  document.querySelector(".rtab").classList.add("active");
  document.getElementById("recordHint").textContent = recordHints["CNAME"];
});

// Smooth scroll offset for sticky navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    }
  });
});
