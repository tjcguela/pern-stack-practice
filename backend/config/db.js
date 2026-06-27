import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// connection string while making use of ENV variables
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
)

// this sql will be used to safely write SQL queries safely