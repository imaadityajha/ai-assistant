import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("Hi this site is working")
})



app.use(
    cors({
        origin: ["http://localhost:5174", "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

// setting up routes


import userRoutes from "./routes/user.routes.js"
import chatRouter from "./routes/aichat.routes.js"
import youtubeRouter from "./routes/youtube.routes.js"
import wikipediaRouter from "./routes/wikipedia.routes.js"
import contactRoutes from "./routes/contact.routes.js"


app.use("/api/v1/users", userRoutes)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/youtube', youtubeRouter)
app.use('/api/v1/wikipedia', wikipediaRouter)
app.use('/api/v1/contact', contactRoutes)

// Debug endpoint: list registered routes (safe to remove later)
app.get('/debug/routes', (req, res) => {
    try {
        const routes = [];
        app._router.stack.forEach((middleware) => {
            if (middleware.route) {
                // routes registered directly on the app
                const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
                routes.push({ path: middleware.route.path, methods });
            } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
                // router middleware
                middleware.handle.stack.forEach((handler) => {
                    if (handler.route) {
                        const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase());
                        routes.push({ path: handler.route.path, methods });
                    }
                });
            }
        });
        return res.json({ success: true, routes });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to list routes', error: err.message });
    }
});

// Return JSON for unmatched routes (helps frontend avoid HTML responses)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler)

export default app;