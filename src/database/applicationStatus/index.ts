import sqlite3, { Database } from "sqlite3";

const sqlite: sqlite3.sqlite3 = sqlite3.verbose();
const db: Database = new sqlite.Database('status_logs.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS logs (timestamp TEXT, application TEXT, endpoint TEXT, status_code TEXT, status_message TEXT)");
});

const validatePagination = (page?: number, limit?: number) => {
    if (page && limit && limit != 0) {
        const offset = (page - 1) * limit;
        return {
            query: " LIMIT ? OFFSET ?",
            params: [limit, offset]
        };
    }
    return {
        query: "",
        params: []
    };
}

const executeSelectQuery = (baseQuery: string, conditions: string, params: string[], page?: number, limit?: number) => {
    return new Promise<Log[]>((resolve, reject) => {
        const pagination = validatePagination(page, limit);
        const query = `${baseQuery} ${conditions} ORDER BY timestamp DESC${pagination.query}`;
        const allParams = [...params, ...pagination.params];

        db.all(query, allParams, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve(rows as Log[]);
            }
        });
    });
}

const save = async (application: string, endpoint: string, status_message: string, status_code?: string) => {
    return new Promise<void>((resolve, reject) => {
        const timestamp = new Date().toISOString();
        const query = "INSERT INTO logs (timestamp, application, endpoint, status_code, status_message) VALUES (?, ?, ?, ?, ?)";
        const params = [timestamp, application, endpoint, status_code, status_message];

        db.run(query, params, (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                console.log(`Status da Aplicação ${application}:${endpoint} registrado com statusCode ${status_code} e mensagem ${status_message} em ${timestamp}`);
                resolve();
            }
        });
    });
}

const getAllRecent = async () => {
    const rows: Log[] = await executeSelectQuery(`
                SELECT l1.timestamp, l1.application, l1.endpoint, l1.status_code, l1.status_message
                FROM logs l1
                INNER JOIN (
                    SELECT application, endpoint, MAX(timestamp) AS max_timestamp
                    FROM logs
                    GROUP BY application, endpoint
                ) l2 ON l1.application = l2.application AND l1.endpoint = l2.endpoint AND l1.timestamp = l2.max_timestamp
                 `, "", [], 0, 0);
    return rows;
}

const getAll = async (page?: number, limit?: number) => {
    const rows: Log[] = await executeSelectQuery("SELECT * FROM logs", "", [], page, limit);
    return rows;
}

const get = async (application: string, page?: number, limit?: number) => {
    const rows: Log[] = await executeSelectQuery("SELECT * FROM logs", "WHERE application = ?", [application], page, limit);
    return rows;
}


export const applicationStatusDatabase = { getAllRecent, save, getAll, get };