require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const reckonerRoutes = require("./routes/reckonerRoutes");
const sheetRoutes = require("./routes/sheetRoutes");
const authRoutes = require("./routes/authRoute")
const materialRoutes = require("./routes/materialRoutes")
const expenseRoutes = require("./routes/expenseRoutes")
const SiteInchargeRoutes = require("./routes/SiteInchargeRoutes")
const adminRoutes = require("./routes/adminRoutes")
const supplyRoutes = require("./routes/supplyRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const projectionRoutes = require("./routes/projectionRoutes")

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://your-frontend-domain.com","http://192.168.253.187:5173","http://192.168.252.101:5173"], // Allowed frontend origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions));

// Check DB connection before starting server
const startServer = async () => {
    try {
        await db.query("SELECT 1");
        console.log("Database connected successfully");
        
        app.use("/auth",authRoutes)
        app.use("/project", projectRoutes);
        app.use("/reckoner",reckonerRoutes);
        app.use("/sheet",sheetRoutes);
        app.use("/material",materialRoutes)
        app.use("/expense",expenseRoutes)
        app.use("/site-incharge",SiteInchargeRoutes)
        app.use("/admin",adminRoutes)
        app.use("/supply", supplyRoutes)
        app.use("/notification", notificationRoutes)
        app.use("/projection", projectionRoutes)

        
        app.listen(process.env.PORT || 5000, () => 
            console.log(`Server running on port ${process.env.PORT || 5000}`)
        );
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

startServer();
