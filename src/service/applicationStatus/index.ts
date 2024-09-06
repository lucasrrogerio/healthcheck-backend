import axios, { AxiosError } from "axios";
import https from "https";

import { applications } from "../../data/applications";
import { applicationStatusModel } from "../../model/applicationStatus";

const httpsAgent: https.Agent = new https.Agent({ rejectUnauthorized: false });

const getAllAppStatusRecent = async (): Promise<Log[]> => {
    await updateAllAppStatusRecent();

    const recentAppStatus = await applicationStatusModel.getAllAppStatusRecent();
    return updateLogWithStatus(recentAppStatus);
}

const getAllAppStatus = async (page?: number, limit?: number): Promise<Log[]> => {
    const appStatus = await applicationStatusModel.getAllAppStatus(page, limit);
    return updateLogWithStatus(appStatus);
}

const getAllAppStatusCount = async (): Promise<number> => {
    const appStatusCount = await applicationStatusModel.getAllAppStatus();
    return appStatusCount.length;
}

const getAppStatusByName = async (application: string, page?: number, limit?: number): Promise<Log[]> => {
    const appStatus = await applicationStatusModel.getAppStatus(application, page, limit);
    return updateLogWithStatus(appStatus);
}

const getAppStatusByNameCount = async (application: string): Promise<number> => {
    const appStatus = await applicationStatusModel.getAppStatus(application);
    return appStatus.length;
}

const updateAllAppStatusRecent = async (): Promise<void> => {
    await Promise.all(applications.map(async (application: Application) => {

        await Promise.all(application.service.endpoints.map(async (endpoint: Endpoint) => {

            const url: string = `${application.service.host_url}/${application.service.base_url}`;
            await updateEndpointStatus(application.name, url, endpoint);

        }));
    }));
}

const updateEndpointStatus = async (applicationName: string, url: string, endpoint: Endpoint): Promise<void> => {
    let statusMessage: string;
    let statusCode: string | undefined;

    const endpointName = endpoint.name;
    const endpointUrl = url.concat(`/${endpoint.url}`);

    try {
        const response = await axios.get(endpointUrl, { httpsAgent });

        statusMessage = response.statusText;
        statusCode = String(response.status);

    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            statusMessage = error.response ? error.response.statusText : error.message;
            statusCode = error.response ? String(error.response.status) : undefined;

        } else {
            statusMessage = "Erro desconhecido.";

        }
    }

    const appAvailable = statusCode ? true : false;

    await applicationStatusModel.saveAppStatus(applicationName, endpointName, statusMessage, appAvailable, statusCode);

};

const updateLogWithStatus = (logs: Log[]): Log[] => {
    logs.forEach(log => {
        log.application_available = log.status_code != undefined;
    })
    return logs;
}

export const applicationStatusService = { getAllAppStatusRecent, getAllAppStatus, getAllAppStatusCount, getAppStatusByName, getAppStatusByNameCount };