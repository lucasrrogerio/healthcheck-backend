import sqlite3, { Database } from "sqlite3";

const sqlite: sqlite3.sqlite3 = sqlite3.verbose();
const db: Database = new sqlite.Database('status_logs.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS logs (timestamp TEXT, service TEXT, endpoint TEXT, status TEXT)");
});

function saveLogStatus(service: string, endpoint: string, status: string) {
    return new Promise<void>((resolve, reject) => {
        const timestamp = new Date().toISOString();
        const query = "INSERT INTO logs (timestamp, service, endpoint, status) VALUES (?, ?, ?, ?)";
        const params = [timestamp, service, endpoint, status];

        db.run(query, params, (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                console.log(`Status do serviço ${service}:${endpoint} registrado como ${status} em ${timestamp}`);
                resolve();
            }
        });
    });
}


export { postLogStatus };