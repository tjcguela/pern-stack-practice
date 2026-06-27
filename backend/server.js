// external packages
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// from directory
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

// config
dotenv.config();
const PORT =  process.env.PORT || 3333;

const app = express();

app.use(cors()); // avoid cross origins (CORS) error,,, typically arising from kulang authentication
app.use(express.json());
app.use(helmet()); // security middleware that helps protect app by using multiple HTTP headers
app.use(morgan("dev")); // log requests

// API handling
app.use("/api/products", productRoutes);

async function initializeDB(){
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized successfully!");
    } catch (error) {
        console.log("ERROR initializing DB from function initializeDB", error);
    }
}

initializeDB().then(()=>{
    // listen to port
    app.listen(PORT, () => {
        console.log("Server is listening at: " + String(PORT));
    })
})