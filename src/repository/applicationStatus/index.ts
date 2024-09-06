import { appDataSource } from '../connection';
import { ApplicationStatus } from '../../entity/applicationStatus';

export const saveAppStatus = async (
    application: string,
    endpoint: string,
    status_message: string,
    application_available: boolean,
    status_code?: string
): Promise<void> => {
    const applicationStatusRepository = appDataSource.getRepository(ApplicationStatus);
    const timestamp: string = new Date().toISOString();
    const newStatus = applicationStatusRepository.create({
        timestamp,
        application,
        endpoint,
        status_code,
        status_message,
        application_available: application_available ? 1 : 0
    });

    try {
        await applicationStatusRepository.save(newStatus);
    } catch (error) {
        throw new Error(`Erro ao salvar status da aplicação: ${error}`);
    }
};

export const getAllAppStatusRecent = async (): Promise<ApplicationStatus[]> => {
    const applicationStatusRepository = appDataSource.getRepository(ApplicationStatus);
    const query = `
        SELECT l1.timestamp, l1.application, l1.endpoint, l1.status_code, l1.status_message, l1.application_available
        FROM application_status l1
        INNER JOIN (
            SELECT application, endpoint, MAX(timestamp) AS max_timestamp
            FROM application_status
            GROUP BY application, endpoint
        ) l2 ON l1.application = l2.application AND l1.endpoint = l2.endpoint AND l1.timestamp = l2.max_timestamp
    `;
    try {
        const result = await applicationStatusRepository.query(query);
        return result;
    } catch (error) {
        throw new Error(`Erro ao buscar status recentes: ${error}`);
    }
};

export const getAllAppStatus = async (page?: number, limit?: number): Promise<ApplicationStatus[]> => {
    const applicationStatusRepository = appDataSource.getRepository(ApplicationStatus);
    const [result] = await applicationStatusRepository.findAndCount({
        skip: page && limit ? (page - 1) * limit : undefined,
        take: limit,
        order: { timestamp: 'DESC' }
    });
    return result;
};

export const getAppStatusByName = async (application: string, page?: number, limit?: number): Promise<ApplicationStatus[]> => {
    const applicationStatusRepository = appDataSource.getRepository(ApplicationStatus);
    const [result] = await applicationStatusRepository.findAndCount({
        where: { application },
        skip: page && limit ? (page - 1) * limit : undefined,
        take: limit,
        order: { timestamp: 'DESC' }
    });
    return result;
};

export const getEndpointStatusByName = async (
    application: string,
    endpoint: string,
    page?: number,
    limit?: number
): Promise<ApplicationStatus[]> => {
    const applicationStatusRepository = appDataSource.getRepository(ApplicationStatus);
    const [result] = await applicationStatusRepository.findAndCount({
        where: { application, endpoint },
        skip: page && limit ? (page - 1) * limit : undefined,
        take: limit,
        order: { timestamp: 'DESC' }
    });
    return result;
};

export const applicationStatusRepository = { getAllAppStatusRecent, saveAppStatus, getAllAppStatus, getAppStatusByName, getEndpointStatusByName };