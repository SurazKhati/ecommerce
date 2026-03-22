const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = Number(process.env.PORT || 9005);
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "change-this-refresh-secret";
const CLIENT_URL_RAW = process.env.CLIENT_URL || "http://localhost:5173";
const CLIENT_URLS = CLIENT_URL_RAW.split(",").map((u) => u.trim());
const CLIENT_URL = CLIENT_URLS[0];
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
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
  }
});

const upload = multer({ storage });

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
        updatedAt: now
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
        updatedAt: now
      }
    ],
    banners: [],
    brands: [],
    chats: []
  };

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function readDb() {
  seedDatabase();
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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
    updatedAt: user.updatedAt
  };
}

function success(res, result, message = "Success", meta) {
  return res.status(200).json({
    message,
    result,
    ...(meta ? { meta } : {})
  });
}

function failure(res, status, message, result) {
  return res.status(status).json({
    message,
    ...(result ? { result } : {})
  });
}

function getToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

function authRequired(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return failure(res, 401, "Authorization token missing");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    const user = db.users.find((item) => item._id === decoded.sub);

    if (!user) {
      return failure(res, 401, "User not found");
    }

    req.user = user;
    next();
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

function generateTokens(user) {
  return {
    token: jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" }),
    refreshToken: jwt.sign({ sub: user._id }, REFRESH_SECRET, { expiresIn: "7d" })
  };
}

function createActivationToken() {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
      total: items.length
    }
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
    updatedAt: new Date().toISOString()
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
    updatedAt: new Date().toISOString()
  };
}

app.get("/", (_req, res) => {
  return success(res, { ok: true }, "Backend is running");
});

app.post("/auth/register", upload.single("image"), async (req, res) => {
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

  const activation = createActivationToken();
  const user = {
    _id: uuidv4(),
    name: String(body.name).trim(),
    email,
    phone: body.phone || null,
    address: body.address || null,
    passwordHash: await bcrypt.hash(String(body.password), 10),
    role: body.role === "seller" ? "seller" : "customer",
    image: req.file ? buildFileUrl(req, req.file.filename) : null,
    status: "inactive",
    isActive: false,
    activationToken: activation.token,
    activationTokenExpiresAt: activation.expiresAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDb(db);

  return res.status(201).json({
    message: "Registration completed successfully",
    result: {
      user: sanitizeUser(user),
      activationToken: activation.token,
      activationUrl: `${CLIENT_URL}/auth/activate/${activation.token}`
    }
  });
});

app.post("/auth/login", async (req, res) => {
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
      userDetail: sanitizeUser(user)
    },
    "Login successful"
  );
});

app.post("/auth/google", async (req, res) => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return failure(res, 500, "Google login is not configured on the server");
    }

    const { credential, role } = req.body || {};
    if (!credential) {
      return failure(res, 400, "Google credential is required");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
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
        updatedAt: new Date().toISOString()
      };
      db.users.push(user);
    }

    writeDb(db);

    return success(
      res,
      {
        token: generateTokens(user),
        userDetail: sanitizeUser(user)
      },
      "Google login successful"
    );
  } catch (error) {
    console.error(error);
    return failure(res, 401, "Google authentication failed");
  }
});

app.get("/auth/me", authRequired, (req, res) => {
  return success(res, sanitizeUser(req.user), "Logged in user fetched");
});

app.get("/auth/activate/:token", (req, res) => {
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
      activationUrl: `${CLIENT_URL}/auth/activate/${activation.token}`
    },
    "New activation token generated"
  );
});

app.get("/banner/list-home", (_req, res) => {
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

app.get("/banner", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const filtered = filterSearch(db.banners, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Banners fetched", meta);
});

app.get("/banner/:id", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const banner = db.banners.find((item) => item._id === req.params.id);
  if (!banner) {
    return failure(res, 404, "Banner not found");
  }
  return success(res, banner, "Banner detail fetched");
});

app.post("/banner", authRequired, adminRequired, upload.single("image"), (req, res) => {
  if (!req.file) {
    return failure(res, 400, "Banner image is required");
  }

  const db = readDb();
  const banner = mapBanner(req);
  db.banners.push(banner);
  writeDb(db);

  return res.status(201).json({
    message: "Banner created successfully",
    result: banner
  });
});

app.patch("/banner/:id", authRequired, adminRequired, upload.single("image"), (req, res) => {
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

app.delete("/banner/:id", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const exists = db.banners.some((item) => item._id === req.params.id);
  if (!exists) {
    return failure(res, 404, "Banner not found");
  }

  db.banners = db.banners.filter((item) => item._id !== req.params.id);
  writeDb(db);
  return success(res, { _id: req.params.id }, "Banner deleted successfully");
});

app.get("/brand", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const filtered = filterSearch(db.brands, req.query.search).sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  const { rows, meta } = paginate(filtered, req.query.page, req.query.limit);
  return success(res, rows, "Brands fetched", meta);
});

app.get("/brand/:id", authRequired, adminRequired, (req, res) => {
  const db = readDb();
  const brand = db.brands.find((item) => item._id === req.params.id);
  if (!brand) {
    return failure(res, 404, "Brand not found");
  }
  return success(res, brand, "Brand detail fetched");
});

app.post("/brand", authRequired, adminRequired, upload.single("image"), (req, res) => {
  if (!req.file) {
    return failure(res, 400, "Brand image is required");
  }

  const db = readDb();
  const brand = mapBrand(req);
  db.brands.push(brand);
  writeDb(db);

  return res.status(201).json({
    message: "Brand created successfully",
    result: brand
  });
});

app.patch("/brand/:id", authRequired, adminRequired, upload.single("image"), (req, res) => {
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

app.delete("/brand/:id", authRequired, adminRequired, (req, res) => {
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
