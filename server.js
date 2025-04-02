const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON data handling
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true }));
// 🔵 MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Iamadnan@1",
    database: "united_hope",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
});
//test test bbos idak zbat
app.get("/test", (req, res) => {
    res.send("✅ API is Running...");
});

// 🔵 Serve Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));

// 🔵 Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // Save uploads in 'public/uploads/'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const SECRET_KEY = "aCVN6dhO03yzhYf7fWZCPG4whKTEAuyV";
//signup route
app.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });

            if (results.length > 0) {
                return res.status(400).json({ error: "User already exists!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
            db.query(insertQuery, [name, email, hashedPassword, role], (err) => {
                if (err) return res.status(500).json({ error: "Database error" });

                res.status(201).json({ message: "User registered successfully!" });
            });
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ LOGIN Route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role.toLowerCase() }, SECRET_KEY, { expiresIn: "7d" });

        res.json({ token, role: user.role });
    });
});

// 🔵 Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "Access denied. No token provided!" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// ✅ POST Donation Request
app.post("/post-request", upload.single("request-image"), (req, res) => {
    const { description, location, category, urgency, pickup } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!description || !location || !category || !urgency || !pickup) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    db.query(
        "INSERT INTO donation_requests (description, location, category, urgency, pickup, image) VALUES (?, ?, ?, ?, ?, ?)",
        [description, location, JSON.stringify(category), urgency, pickup, image],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(201).json({ message: "Donation request posted successfully!" });
        }
    );
});

// ✅ GET Available Requests for Donors
app.get("/available-requests", verifyToken, (req, res) => {
    if (req.user.role !== "donor") return res.status(403).json({ error: "Only donors can view requests!" });

    db.query("SELECT id, description, location, category, urgency, pickup, image FROM donation_requests WHERE status = 'pending'", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        results.forEach((req) => (req.category = JSON.parse(req.category))); // Convert JSON to array
        res.status(200).json(results);
    });
});

// ✅ ACCEPT a Donation Request (For Donors)
app.post("/accept-request", verifyToken, (req, res) => {
    if (req.user.role !== "donor") return res.status(403).json({ error: "Only donors can accept requests!" });

    const { request_id } = req.body;
    if (!request_id) return res.status(400).json({ error: "Request ID is required!" });

    db.query("UPDATE donation_requests SET status = 'accepted', donor_id = ? WHERE id = ?", [req.user.id, request_id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(200).json({ message: "Request accepted!" });
    });
});

// 🔵 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
