import axios, { AxiosError } from "axios";
import https from "https";

import { applications } from "../../data/applications";
import { applicationStatusDatabase } from "../../database/applicationStatus";

const httpsAgent: https.Agent = new https.Agent({ rejectUnauthorized: false });

const getAllRecent = async () => {
    await updateAllRecent();

    const recentAppStatus = await applicationStatusDatabase.getAllRecent();
    return recentAppStatus;
}

const getAll = async (page?: number, limit?: number) => {
    const appStatus = await applicationStatusDatabase.getAll(page, limit);
    return appStatus;
}

const getAllCount = async () => {
    const appStatusCount = await getAll();
    return appStatusCount.length;
}

const get = async (service: string, page?: number, limit?: number) => {
    const appStatus = await applicationStatusDatabase.get(service, page, limit);
    return appStatus;
}

const updateAllRecent = async () => {
    await Promise.all(applications.map(async (application: Application) => {

        await Promise.all(application.service.endpoints.map(async (endpoint: Endpoint) => {

            const url: string = `${application.service.host_url}/${application.service.base_url}`;
            await updateEndpointStatus(application.name, url, endpoint);

        }));

    }));

}

const updateEndpointStatus = async (applicationName: string, url: string, endpoint: Endpoint) => {
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
            statusCode = error.response ? String(error.response.status) : error.code;

        } else {
            statusMessage = "Erro desconhecido.";
            
        }
    }

    await applicationStatusDatabase.save(applicationName, endpointName, statusMessage, statusCode);

};

export const applicationStatusService = { getAllRecent, getAll, getAllCount, get };