import { db } from "../connection"

interface PaginationParams {
    query: string;
    params: number[];
}

const validatePagination = (page?: number, limit?: number): PaginationParams => {
    if (page && limit && limit != 0) {
        const offset: number = (page - 1) * limit;
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

const executeSelectQuery = (baseQuery: string, conditions: string, params: string[], page?: number, limit?: number): Promise<Log[]> => {
    return new Promise<Log[]>((resolve, reject) => {
        const pagination: PaginationParams = validatePagination(page, limit);
        const query: string = `${baseQuery} ${conditions} ORDER BY timestamp DESC${pagination.query}`;
        const allParams: unknown[] = [...params, ...pagination.params];

        db.all(query, allParams, (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                const logs: Log[] = (rows as Log[]).map(row => {
                    return {
                        ...row,
                        application_available: row.application_available == 1
                    };
                });
                resolve(logs);
            }
        });
    });
}

const save = (application: string, endpoint: string, status_message: string, application_available: boolean, status_code?: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const timestamp: string = new Date().toISOString();
        const query: string = "INSERT INTO logs (timestamp, application, endpoint, status_code, status_message, application_available) VALUES (?, ?, ?, ?, ?, ?)";
        const params: unknown[] = [timestamp, application, endpoint, status_code, status_message, application_available ? 1 : 0];

        db.run(query, params, (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const getAllRecent = async (): Promise<Log[]> => {
    const rows: Log[] = await executeSelectQuery(`
                SELECT l1.timestamp, l1.application, l1.endpoint, l1.status_code, l1.status_message, l1.application_available
                FROM logs l1
                INNER JOIN (
                    SELECT application, endpoint, MAX(timestamp) AS max_timestamp
                    FROM logs
                    GROUP BY application, endpoint
                ) l2 ON l1.application = l2.application AND l1.endpoint = l2.endpoint AND l1.timestamp = l2.max_timestamp
                 `, "", [], 0, 0);
    return rows;
}

const getAll = async (page?: number, limit?: number): Promise<Log[]> => {
    const rows: Log[] = await executeSelectQuery("SELECT * FROM logs", "", [], page, limit);
    return rows;
}

const get = async (application: string, page?: number, limit?: number): Promise<Log[]> => {
    const rows: Log[] = await executeSelectQuery("SELECT * FROM logs", "WHERE application = ?", [application], page, limit);
    return rows;
}


export const applicationStatusModel = { getAllRecent, save, getAll, get };