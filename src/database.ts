import { join } from "path";
import { Database } from "sqlite3";

let db: Database;

const dbLocation = join(__dirname, "../data/myDb.db");

export const getDBConnection = (): Database => {
    if (!db) {
        const sqlite3 = require("sqlite3").verbose();
        db = new sqlite3.Database(dbLocation);
    }
    return db;
};
