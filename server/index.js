const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const serverEnvPath = path.join(__dirname, ".env");
if (fs.existsSync(serverEnvPath)) {
  const envLines = fs.readFileSync(serverEnvPath, "utf-8").split(/\r?\n/);
  envLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

const { isSupabaseConfigured, supabaseAdmin, supabaseStorageBucket } = require("./supabase");

const app = express();

const PORT = Number(process.env.PORT || 9005);
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "change-this-refresh-secret";
const CLIENT_URL_RAW = process.env.CLIENT_URL || "http://localhost:5173";
const CLIENT_URLS = CLIENT_URL_RAW.split(",").map((u) => u.trim());
const CLIENT_URL = CLIENT_URLS[0];
const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "458524892192-vpmp2cnrtgogj0dveimdhp4mm124c0cu.apps.googleusercontent.com";
const TOKEN_EXPIRED_MESSAGE = "Token expired.";
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const dataDir = path.join(__dirname, "data");
const uploadsDir = path.join(__dirname, "uploads");
const dbPath = path.join(dataDir, "db.json");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

const defaultCategories = [
  {
    _id: uuidv4(),
    title: "Electric stove",
    slug: "/category/electric-stove",
    description:
      "Dependable countertop electric models with steady heating, simple knobs, and family-friendly durability.",
    accent: "For home kitchens",
    productCount: 7,
    highlights: ["Easy heat control", "Budget friendly", "Long-lasting body"],
    image: null,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: uuidv4(),
    title: "Induction stove",
    slug: "/category/induction-stove",
    description:
      "High-efficiency induction cookers with touch panels, faster boiling, and cleaner cooking surfaces.",
    accent: "Fast and efficient",
    productCount: 5,
    highlights: ["Quick response", "Less heat loss", "Safer for families"],
    image: null,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: uuidv4(),
    title: "Premium cooktops",
    slug: "/category/premium-cooktops",
    description:
      "Stylish premium stoves designed for modern interiors, showroom kitchens, and gift-worthy upgrades.",
    accent: "Premium finish",
    productCount: 4,
    highlights: ["Elegant design", "Modern control panel", "Top-tier finishing"],
    image: null,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: uuidv4(),
    title: "Commercial burners",
    slug: "/category/commercial-burners",
    description:
      "Heavy-duty cooking units for cafes, hostels, and small food businesses that need consistent output.",
    accent: "Business ready",
    productCount: 3,
    highlights: ["High output", "Stable frame", "Built for daily demand"],
    image: null,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CLIENT_URLS.includes(origin)) return cb(null, true);
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

function buildFileUrl(req, filename) {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

function seedDatabase() {
  if (fs.existsSync(dbPath)) {
    return;
  }

  const now = new Date().toISOString();
  const db = {
    users: [
      {
        _id: uuidv4(),
        name: "Admin User",
        email: "admin@demo.com",
        phone: "9800000000",
        address: "Kathmandu",
        passwordHash: bcrypt.hashSync("Admin@123", 10),
        role: "admin",
        image: null,
        status: "active",
        isActive: true,
        activationToken: null,
        activationTokenExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: uuidv4(),
        name: "Seller User",
        email: "seller@demo.com",
        phone: "9811111111",
        address: "Pokhara",
        passwordHash: bcrypt.hashSync("Seller@123", 10),
        role: "seller",
        image: null,
        status: "active",
        isActive: true,
        activationToken: null,
        activationTokenExpiresAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ],
    banners: [],
    brands: [],
    categories: defaultCategories,
    products: [],
    chats: [],
  };

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function readDb() {
  seedDatabase();
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  db.users = db.users || [];
  db.banners = db.banners || [];
  db.brands = db.brands || [];
  db.categories = db.categories || defaultCategories;
  db.products = db.products || [];
  db.chats = db.chats || [];
  if (!Array.isArray(db.categories) || db.categories.length === 0) {
    db.categories = defaultCategories;
    writeDb(db);
  }
  return db;
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function success(res, result, message = "Success", meta) {
  return res.status(200).json({
    message,
    result,
    ...(meta ? { meta } : {}),
  });
}

function failure(res, status, message, result) {
  return res.status(status).json({
    message,
    ...(result ? { result } : {}),
  });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    image: user.image,
    status: user.status,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function mapSupabaseProfile(profile) {
  return {
    _id: profile.id,
    authUserId: profile.auth_user_id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    role: profile.role,
    image: profile.image,
    status: profile.status,
    isActive: profile.is_active,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

function mapSupabaseBanner(row) {
  return {
    _id: row.id,
    title: row.title,
    link: row.link,
    image: row.image,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSupabaseBrand(row) {
  return {
    _id: row.id,
    title: row.title,
    image: row.image,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSupabaseProduct(row) {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    stock: row.stock,
    image: row.image,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

function generateTokens(user) {
  return {
    token: jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" }),
    refreshToken: jwt.sign({ sub: user._id }, REFRESH_SECRET, { expiresIn: "7d" }),
  };
}

function createActivationToken() {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

function normalizeStatus(value) {
  return value === "inactive" ? "inactive" : "active";
}

function filterSearch(items, search) {
  const query = String(search || "").trim().toLowerCase();
  if (!query) {
    return items;
  }

  return items.filter((item) =>
    Object.values(item).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(query)
    )
  );
}

function paginate(items, page, limit) {
  const currentPage = Math.max(Number(page) || 1, 1);
  const perPage = Math.max(Number(limit) || 10, 1);
  const start = (currentPage - 1) * perPage;

  return {
    rows: items.slice(start, start + perPage),
    meta: {
      currentPage,
      limit: perPage,
      total: items.length,
    },
  };
}

function mapBanner(req, existing) {
  const body = req.body || {};
  return {
    _id: existing?._id || uuidv4(),
    title: body.title || existing?.title || "",
    link: body.link || null,
    image: req.file ? buildFileUrl(req, req.file.filename) : existing?.image || null,
    status: normalizeStatus(body.status || existing?.status),
    startDate: body.startDate || existing?.startDate || new Date().toISOString().slice(0, 10),
    endDate: body.endDate || existing?.endDate || new Date().toISOString().slice(0, 10),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapBrand(req, existing) {
  const body = req.body || {};
  return {
    _id: existing?._id || uuidv4(),
    title: body.title || existing?.title || "",
    image: req.file ? buildFileUrl(req, req.file.filename) : existing?.image || null,
    status: normalizeStatus(body.status || existing?.status),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapProduct(req, existing) {
  const body = req.body || {};
  return {
    _id: existing?._id || uuidv4(),
    title: body.title || existing?.title || "",
    description: body.description || existing?.description || "",
    price: Number(body.price ?? existing?.price ?? 0),
    stock: Number(body.stock ?? existing?.stock ?? 0),
    image: req.file ? buildFileUrl(req, req.file.filename) : existing?.image || null,
    status: normalizeStatus(body.status || existing?.status),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function slugifyCategoryTitle(title = "") {
  return `/category/${String(title)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function mapCategory(req, existing) {
  const body = req.body || {};
  const title = body.title || existing?.title || "";
  const highlightsRaw = body.highlights || existing?.highlights || [];
  const highlights = Array.isArray(highlightsRaw)
    ? highlightsRaw
    : String(highlightsRaw)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    _id: existing?._id || uuidv4(),
    title,
    slug: body.slug || existing?.slug || slugifyCategoryTitle(title),
    description: body.description || existing?.description || "",
    accent: body.accent || existing?.accent || "",
    productCount: Number(body.productCount ?? existing?.productCount ?? 0),
    highlights,
    image: req.file ? buildFileUrl(req, req.file.filename) : existing?.image || null,
    status: normalizeStatus(body.status || existing?.status),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function ensureSupabaseProfile(authUser, roleHint) {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return null;
  }

  const now = new Date().toISOString();
  const userMetadata = authUser.user_metadata || {};
  const appMetadata = authUser.app_metadata || {};
  const email = authUser.email || userMetadata.email || "";

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const payload = {
    auth_user_id: authUser.id,
    email,
    name: userMetadata.name || userMetadata.full_name || existing?.name || email.split("@")[0],
    phone: userMetadata.phone || existing?.phone || null,
    address: userMetadata.address || existing?.address || null,
    role: existing?.role || roleHint || userMetadata.role || appMetadata.role || "customer",
    image:
      userMetadata.avatar_url ||
      userMetadata.picture ||
      userMetadata.image ||
      existing?.image ||
      null,
    status: "active",
    is_active: true,
    updated_at: now,
    created_at: existing?.created_at || now,
  };

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(existing ? { ...existing, ...payload } : payload, {
      onConflict: "auth_user_id",
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseProfile(data);
}

async function uploadToSupabaseStorage(file, folder) {
  if (!isSupabaseConfigured || !supabaseAdmin || !file) {
    return null;
  }

  const ext = path.extname(file.originalname || "");
  const objectPath = `${folder}/${Date.now()}-${uuidv4()}${ext}`;

  try {
    const fileBuffer = fs.readFileSync(file.path);
    const { error } = await supabaseAdmin.storage
      .from(supabaseStorageBucket)
      .upload(objectPath, fileBuffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabaseAdmin.storage
      .from(supabaseStorageBucket)
      .getPublicUrl(objectPath);

    return data.publicUrl;
  } finally {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
}

async function authRequired(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return failure(res, 401, "Authorization token missing");
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !data.user) {
        return failure(res, 401, "Invalid or expired token");
      }

      req.authUser = data.user;
      req.user = await ensureSupabaseProfile(data.user);
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find((item) => item._id === decoded.sub);

    if (!user) {
      return failure(res, 401, "User not found");
    }

    req.user = user;
    return next();
  } catch (_error) {
    return failure(res, 401, "Invalid or expired token");
  }
}

function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return failure(res, 403, "Admin access required");
  }
  next();
}

app.get("/", (_req, res) => {
  return success(res, { ok: true, supabase: isSupabaseConfigured }, "Backend is running");
});

app.post("/auth/register", upload.single("image"), async (req, res) => {
  if (isSupabaseConfigured) {
    return failure(
      res,
      400,
      "Supabase auth is enabled. Use the frontend Supabase sign-up flow."
    );
  }

  const db = readDb();
  const body = req.body || {};
  const errors = {};

  if (!body.name || String(body.name).trim().length < 2) {
    errors.name = "Name is required";
  }
  if (!body.email) {
    errors.email = "Email is required";
  }
  if (!body.password) {
    errors.password = "Password is required";
  }
  if (!body.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  }
  if (body.password && body.confirmPassword && body.password !== body.confirmPassword) {
    errors.confirmPassword = "Password and confirm password must match";
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (db.users.some((user) => user.email === email)) {
    errors.email = "Email already exists";
  }

  if (Object.keys(errors).length > 0) {
    return failure(res, 400, "Validation failed", errors);
  }

  const user = {
    _id: uuidv4(),
    name: String(body.name).trim(),
    email,
    phone: body.phone || null,
    address: body.address || null,
    passwordHash: await bcrypt.hash(String(body.password), 10),
    role: body.role === "seller" ? "seller" : "customer",
    image: req.file ? buildFileUrl(req, req.file.filename) : null,
    status: "active",
    isActive: true,
    activationToken: null,
    activationTokenExpiresAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);

  return res.status(201).json({
    message: "Registration completed successfully",
    result: {
      user: sanitizeUser(user),
    },
  });
});

app.post("/auth/login", async (req, res) => {
  if (isSupabaseConfigured) {
    return failure(
      res,
      400,
      "Supabase auth is enabled. Use the frontend Supabase sign-in flow."
    );
  }

  const db = readDb();
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return failure(res, 401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!isValid) {
    return failure(res, 401, "Invalid email or password");
  }

  if (!user.isActive) {
    return failure(res, 403, "Please activate your account first");
  }

  return success(
    res,
    {
      token: generateTokens(user),
      userDetail: sanitizeUser(user),
    },
    "Login successful"
  );
});

app.post("/auth/google", async (req, res) => {
  if (isSupabaseConfigured) {
    return failure(
      res,
      400,
      "Supabase auth is enabled. Use the frontend Supabase OAuth flow."
    );
  }

  if (!googleClient || !GOOGLE_CLIENT_ID) {
    return failure(res, 400, "Google auth is not configured in local mode");
  }

  try {
    const { credential, role } = req.body || {};
    if (!credential) {
      return failure(res, 400, "Google credential is required");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return failure(res, 400, "Unable to read Google account");
    }

    const db = readDb();
    const email = String(payload.email).trim().toLowerCase();
    let user = db.users.find((item) => item.email === email);

    if (user) {
      user.name = payload.name || user.name;
      user.image = payload.picture || user.image || null;
      user.isActive = true;
      user.status = "active";
      user.googleId = payload.sub;
      user.updatedAt = new Date().toISOString();
    } else {
      user = {
        _id: uuidv4(),
        name: payload.name || email.split("@")[0],
        email,
        phone: null,
        address: null,
        passwordHash: null,
        role: role === "seller" ? "seller" : "customer",
        image: payload.picture || null,
        status: "active",
        isActive: true,
        activationToken: null,
        activationTokenExpiresAt: null,
        googleId: payload.sub,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.users.push(user);
    }

    writeDb(db);

    return success(
      res,
      {
        token: generateTokens(user),
        userDetail: sanitizeUser(user),
      },
      "Google login successful"
    );
  } catch (error) {
    console.error(error);
    return failure(res, 401, "Google authentication failed");
  }
});

app.post("/auth/profile/sync", authRequired, async (req, res) => {
  if (isSupabaseConfigured && req.authUser) {
    try {
      const profile = await ensureSupabaseProfile(req.authUser, req.body?.role);
      return success(res, profile, "Profile synced");
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to sync profile");
    }
  }

  return success(res, sanitizeUser(req.user), "Profile synced");
});

app.get("/auth/me", authRequired, (req, res) => {
  return success(res, isSupabaseConfigured ? req.user : sanitizeUser(req.user), "Logged in user fetched");
});

app.get("/auth/activate/:token", (req, res) => {
  if (isSupabaseConfigured) {
    return success(res, { redirected: true }, "Supabase email confirmation handles activation");
  }

  const db = readDb();
  const user = db.users.find((item) => item.activationToken === req.params.token);

  if (!user) {
    return failure(res, 404, "Activation token not found");
  }

  if (
    user.activationTokenExpiresAt &&
    new Date(user.activationTokenExpiresAt).getTime() < Date.now()
  ) {
    return failure(res, 422, TOKEN_EXPIRED_MESSAGE);
  }

  user.isActive = true;
  user.status = "active";
  user.activationToken = null;
  user.activationTokenExpiresAt = null;
  user.updatedAt = new Date().toISOString();
  writeDb(db);

  return success(res, sanitizeUser(user), "Account activated successfully");
});

app.get("/auth/resend-activationtoken/:token", (req, res) => {
  if (isSupabaseConfigured) {
    return failure(res, 400, "Supabase email confirmation handles activation");
  }

  const db = readDb();
  const user = db.users.find((item) => item.activationToken === req.params.token);

  if (!user) {
    return failure(res, 404, "Activation token not found");
  }

  const activation = createActivationToken();
  user.activationToken = activation.token;
  user.activationTokenExpiresAt = activation.expiresAt;
  user.updatedAt = new Date().toISOString();
  writeDb(db);

  return success(
    res,
    {
      activationToken: activation.token,
      activationUrl: `${CLIENT_URL}/auth/activate/${activation.token}`,
    },
    "New activation token generated"
  );
});

app.get("/banner/list-home", async (_req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("banners")
      .select("*")
      .eq("status", "active")
      .order("updated_at", { ascending: false });

    if (error) {
      return failure(res, 500, "Failed to fetch home banners");
    }

    const today = new Date().toISOString().slice(0, 10);
    const filtered = (data || []).filter((banner) => {
      return (
        (!banner.start_date || banner.start_date <= today) &&
        (!banner.end_date || banner.end_date >= today)
      );
    });

    return success(res, { data: filtered.map(mapSupabaseBanner) }, "Home banners fetched");
  }

  const db = readDb();
  const today = new Date().toISOString().slice(0, 10);
  const data = db.banners.filter((banner) => {
    return (
      banner.status === "active" &&
      (!banner.startDate || banner.startDate <= today) &&
      (!banner.endDate || banner.endDate >= today)
    );
  });

  return success(res, { data }, "Home banners fetched");
});

app.get("/category/list-home", async (_req, res) => {
  const db = readDb();
  const data = db.categories.filter((category) => category.status === "active");
  return success(res, { data }, "Home categories fetched");
});

app.get("/banner", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = String(req.query.search || "").trim();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("banners")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return failure(res, 500, "Failed to fetch banners");
    }

    return success(res, (data || []).map(mapSupabaseBanner), "Banners fetched", {
      currentPage: page,
      limit,
      total: count || 0,
    });
  }

  const db = readDb();
  const filtered = filterSearch(db.banners, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Banners fetched", meta);
});

app.get("/banner/:id", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("banners")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return failure(res, 404, "Banner not found");
    }

    return success(res, mapSupabaseBanner(data), "Banner detail fetched");
  }

  const db = readDb();
  const banner = db.banners.find((item) => item._id === req.params.id);
  if (!banner) {
    return failure(res, 404, "Banner not found");
  }
  return success(res, banner, "Banner detail fetched");
});

app.post("/banner", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return failure(res, 400, "Banner image is required");
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const image = await uploadToSupabaseStorage(req.file, "banners");
      const { data, error } = await supabaseAdmin
        .from("banners")
        .insert({
          title: req.body.title,
          link: req.body.link || null,
          image,
          status: normalizeStatus(req.body.status),
          start_date: req.body.startDate || null,
          end_date: req.body.endDate || null,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        message: "Banner created successfully",
        result: mapSupabaseBanner(data),
      });
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to create banner");
    }
  }

  const db = readDb();
  const banner = mapBanner(req);
  db.banners.push(banner);
  writeDb(db);

  return res.status(201).json({
    message: "Banner created successfully",
    result: banner,
  });
});

app.patch("/banner/:id", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from("banners")
        .select("*")
        .eq("id", req.params.id)
        .single();

      if (existingError || !existing) {
        return failure(res, 404, "Banner not found");
      }

      const image = req.file
        ? await uploadToSupabaseStorage(req.file, "banners")
        : existing.image;

      const { data, error } = await supabaseAdmin
        .from("banners")
        .update({
          title: req.body.title || existing.title,
          link: req.body.link || null,
          image,
          status: normalizeStatus(req.body.status || existing.status),
          start_date: req.body.startDate || existing.start_date,
          end_date: req.body.endDate || existing.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", req.params.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return success(res, mapSupabaseBanner(data), "Banner updated successfully");
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to update banner");
    }
  }

  const db = readDb();
  const index = db.banners.findIndex((item) => item._id === req.params.id);
  if (index === -1) {
    return failure(res, 404, "Banner not found");
  }

  const banner = mapBanner(req, db.banners[index]);
  db.banners[index] = banner;
  writeDb(db);

  return success(res, banner, "Banner updated successfully");
});

app.delete("/banner/:id", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("banners").delete().eq("id", req.params.id);
    if (error) {
      return failure(res, 404, "Banner not found");
    }
    return success(res, { _id: req.params.id }, "Banner deleted successfully");
  }

  const db = readDb();
  const exists = db.banners.some((item) => item._id === req.params.id);
  if (!exists) {
    return failure(res, 404, "Banner not found");
  }

  db.banners = db.banners.filter((item) => item._id !== req.params.id);
  writeDb(db);
  return success(res, { _id: req.params.id }, "Banner deleted successfully");
});

app.get("/brand", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = String(req.query.search || "").trim();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("brands")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
      return failure(res, 500, "Failed to fetch brands");
    }

    return success(res, (data || []).map(mapSupabaseBrand), "Brands fetched", {
      currentPage: page,
      limit,
      total: count || 0,
    });
  }

  const db = readDb();
  const filtered = filterSearch(db.brands, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Brands fetched", meta);
});

app.get("/brand/:id", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("brands")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return failure(res, 404, "Brand not found");
    }

    return success(res, mapSupabaseBrand(data), "Brand detail fetched");
  }

  const db = readDb();
  const brand = db.brands.find((item) => item._id === req.params.id);
  if (!brand) {
    return failure(res, 404, "Brand not found");
  }
  return success(res, brand, "Brand detail fetched");
});

app.get("/product", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = String(req.query.search || "").trim();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("products")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);
    if (error) {
      return failure(res, 500, "Failed to fetch products");
    }

    return success(res, (data || []).map(mapSupabaseProduct), "Products fetched", {
      currentPage: page,
      limit,
      total: count || 0,
    });
  }

  const db = readDb();
  const filtered = filterSearch(db.products, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Products fetched", meta);
});

app.get("/category", authRequired, adminRequired, async (req, res) => {
  const db = readDb();
  const filtered = filterSearch(db.categories, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Categories fetched", meta);
});

app.get("/category/:id", authRequired, adminRequired, async (req, res) => {
  const db = readDb();
  const category = db.categories.find((item) => item._id === req.params.id);
  if (!category) {
    return failure(res, 404, "Category not found");
  }
  return success(res, category, "Category detail fetched");
});

app.post("/category", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  const db = readDb();
  const category = mapCategory(req);
  db.categories.push(category);
  writeDb(db);

  return res.status(201).json({
    message: "Category created successfully",
    result: category,
  });
});

app.patch("/category/:id", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  const db = readDb();
  const index = db.categories.findIndex((item) => item._id === req.params.id);
  if (index === -1) {
    return failure(res, 404, "Category not found");
  }

  const category = mapCategory(req, db.categories[index]);
  db.categories[index] = category;
  writeDb(db);

  return success(res, category, "Category updated successfully");
});

app.delete("/category/:id", authRequired, adminRequired, async (req, res) => {
  const db = readDb();
  const exists = db.categories.some((item) => item._id === req.params.id);
  if (!exists) {
    return failure(res, 404, "Category not found");
  }

  db.categories = db.categories.filter((item) => item._id !== req.params.id);
  writeDb(db);
  return success(res, { _id: req.params.id }, "Category deleted successfully");
});

app.post("/product", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return failure(res, 400, "Product image is required");
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const image = await uploadToSupabaseStorage(req.file, "products");
      const { data, error } = await supabaseAdmin
        .from("products")
        .insert({
          title: req.body.title,
          description: req.body.description,
          price: Number(req.body.price || 0),
          stock: Number(req.body.stock || 0),
          image,
          status: normalizeStatus(req.body.status),
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        message: "Product created successfully",
        result: mapSupabaseProduct(data),
      });
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to create product");
    }
  }

  const db = readDb();
  const product = mapProduct(req);
  db.products.push(product);
  writeDb(db);

  return res.status(201).json({
    message: "Product created successfully",
    result: product,
  });
});

app.post("/brand", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return failure(res, 400, "Brand image is required");
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const image = await uploadToSupabaseStorage(req.file, "brands");
      const { data, error } = await supabaseAdmin
        .from("brands")
        .insert({
          title: req.body.title,
          image,
          status: normalizeStatus(req.body.status),
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        message: "Brand created successfully",
        result: mapSupabaseBrand(data),
      });
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to create brand");
    }
  }

  const db = readDb();
  const brand = mapBrand(req);
  db.brands.push(brand);
  writeDb(db);

  return res.status(201).json({
    message: "Brand created successfully",
    result: brand,
  });
});

app.patch("/brand/:id", authRequired, adminRequired, upload.single("image"), async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from("brands")
        .select("*")
        .eq("id", req.params.id)
        .single();

      if (existingError || !existing) {
        return failure(res, 404, "Brand not found");
      }

      const image = req.file
        ? await uploadToSupabaseStorage(req.file, "brands")
        : existing.image;

      const { data, error } = await supabaseAdmin
        .from("brands")
        .update({
          title: req.body.title || existing.title,
          image,
          status: normalizeStatus(req.body.status || existing.status),
          updated_at: new Date().toISOString(),
        })
        .eq("id", req.params.id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return success(res, mapSupabaseBrand(data), "Brand updated successfully");
    } catch (error) {
      console.error(error);
      return failure(res, 500, "Failed to update brand");
    }
  }

  const db = readDb();
  const index = db.brands.findIndex((item) => item._id === req.params.id);
  if (index === -1) {
    return failure(res, 404, "Brand not found");
  }

  const brand = mapBrand(req, db.brands[index]);
  db.brands[index] = brand;
  writeDb(db);

  return success(res, brand, "Brand updated successfully");
});

app.delete("/brand/:id", authRequired, adminRequired, async (req, res) => {
  if (isSupabaseConfigured && supabaseAdmin) {
    const { error } = await supabaseAdmin.from("brands").delete().eq("id", req.params.id);
    if (error) {
      return failure(res, 404, "Brand not found");
    }
    return success(res, { _id: req.params.id }, "Brand deleted successfully");
  }

  const db = readDb();
  const exists = db.brands.some((item) => item._id === req.params.id);
  if (!exists) {
    return failure(res, 404, "Brand not found");
  }

  db.brands = db.brands.filter((item) => item._id !== req.params.id);
  writeDb(db);
  return success(res, { _id: req.params.id }, "Brand deleted successfully");
});

app.get("/chat/list", authRequired, (_req, res) => {
  return success(res, [], "Chat list fetched");
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return failure(res, 500, "Internal server error");
});

seedDatabase();

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
