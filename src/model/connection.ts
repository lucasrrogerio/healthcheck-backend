import sqlite3, { Database } from "sqlite3";

const sqlite: sqlite3.sqlite3 = sqlite3.verbose();
const db: Database = new sqlite.Database('status.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS logs (timestamp TEXT, application TEXT, endpoint TEXT, status_code TEXT, status_message TEXT, application_available INTEGER)");
});

export { db };