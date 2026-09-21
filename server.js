const express = require("express");
const crypto = require("crypto");
const path = require("path");
const { Client } = require("@replit/object-storage");

const app = express();
const port = Number(process.env.PORT || 5000);
let storage;
const CONTACT_PATH = "data/contactReceived.json";
const sessions = new Map();

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, { extensions: ["html"] }));

function resultValue(result) {
  if (result && typeof result === "object" && "value" in result) return result.value;
  if (result && typeof result === "object" && "data" in result) return result.data;
  return result;
}

function getStorage() {
  if (!storage) storage = new Client();
  return storage;
}

async function readContacts() {
  const result = await getStorage().downloadAsText(CONTACT_PATH);
  if (result && result.ok === false) {
    const initial = "[]";
    const created = await getStorage().uploadFromText(CONTACT_PATH, initial);
    if (created && created.ok === false) throw new Error("Unable to initialize App Storage");
    return [];
  }

  const text = resultValue(result);
  if (!text || !String(text).trim()) return [];
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("Contact storage must contain a JSON array");
  return parsed;
}

async function writeContacts(contacts) {
  const result = await getStorage().uploadFromText(
    CONTACT_PATH,
    JSON.stringify(contacts, null, 2)
  );
  if (result && result.ok === false) throw new Error("Unable to write App Storage");
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContact(body) {
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email);
  const reason = clean(body.reason);
  const message = clean(body.message);
  const reasons = ["Comment", "Question", "Partnership", "Opportunity", "Other"];
  if (!firstName || !lastName || !validEmail(email) || !reasons.includes(reason) || !message) {
    return "Please provide a first name, last name, valid email, reason, and message.";
  }
  return null;
}

function cookieValue(req, name) {
  const header = req.headers.cookie || "";
  const part = header.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : "";
}

function requireAdmin(req, res, next) {
  const token = cookieValue(req, "admin_session");
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ error: "Admin authentication required." });
  }
  req.admin = true;
  next();
}

app.post("/api/contact", async (req, res) => {
  const validationError = validateContact(req.body || {});
  if (validationError) return res.status(400).json({ error: validationError });

  const now = new Date().toISOString();
  const record = {
    id: crypto.randomUUID(),
    firstName: clean(req.body.firstName),
    lastName: clean(req.body.lastName),
    email: clean(req.body.email),
    reason: clean(req.body.reason),
    message: clean(req.body.message),
    submittedAt: now,
    replied: false,
    repliedAt: null
  };

  try {
    const contacts = await readContacts();
    contacts.push(record);
    await writeContacts(contacts);
    return res.status(201).json({ record });
  } catch (error) {
    console.error("Contact storage failure:", error.message);
    return res.status(500).json({ error: "Your message could not be saved right now. Please try again." });
  }
});

app.post("/api/admin/login", (req, res) => {
  const password = clean(req.body && req.body.password);
  const configuredPassword = process.env.ADMIN_PASSWORD || process.env.SESSION_SECRET;
  if (!configuredPassword || !password) return res.status(401).json({ error: "Incorrect password." });

  const supplied = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  const matches = supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  if (!matches) return res.status(401).json({ error: "Incorrect password." });

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now());
  res.setHeader("Set-Cookie", `admin_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`);
  return res.json({ authenticated: true });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const token = cookieValue(req, "admin_session");
  sessions.delete(token);
  res.setHeader("Set-Cookie", "admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  res.json({ authenticated: false });
});

app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  try {
    const contacts = await readContacts();
    contacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json({ messages: contacts });
  } catch (error) {
    console.error("Admin read failure:", error.message);
    res.status(500).json({ error: "Messages could not be loaded." });
  }
});

app.patch("/api/admin/messages/:id/replied", requireAdmin, async (req, res) => {
  try {
    const contacts = await readContacts();
    const index = contacts.findIndex((message) => message.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Message not found." });
    contacts[index].replied = true;
    contacts[index].repliedAt = new Date().toISOString();
    await writeContacts(contacts);
    res.json({ record: contacts[index] });
  } catch (error) {
    console.error("Admin update failure:", error.message);
    res.status(500).json({ error: "Message status could not be updated." });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Jordan Ellis portfolio running on port ${port}`);
});