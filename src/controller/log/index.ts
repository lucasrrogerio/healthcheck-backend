import { Request, Response } from "express"
import axios, { AxiosError } from "axios";
import https from "https";
import { StatusCodes } from "http-status-codes"

import { applications } from "../../data/applications"
import { logDatabase } from "../../database/log";
import { HealthStatus } from "../../types/enums";

const fetchEndpointStatus = async (applicationName: string, url: string, endpoint: Endpoint) => {
    const httpsAgent: https.Agent = new https.Agent({ rejectUnauthorized: false });
    let endpointHealthInfo: EndpointHealthInfo;
    let statusMessage: string;
    let healthStatus: HealthStatus;

    const endpointName = endpoint.name;

    url = url.concat(`/${endpoint.url}`);

    try {
        const response = await axios.get(url, { httpsAgent });

        statusMessage = `(${response.status}) ${response.statusText}`;
        healthStatus  = response.status >= 200 && response.status < 300 ? HealthStatus.Up : HealthStatus.Down;

        endpointHealthInfo = {
            name: endpointName,
            message: statusMessage,
            status: healthStatus
        }


    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            statusMessage = error.response ? `(${error.response.status}) ${error.response.statusText}` : error.message;
            healthStatus = error?.response?.status !== undefined
                && error.response.status >= 400 && error.response.status < 500 ? HealthStatus.Up : HealthStatus.Down;

            endpointHealthInfo = {
                name: endpointName,
                message: statusMessage,
                status: healthStatus
            }
        } else {
            statusMessage = "Erro inesperado";
            healthStatus = HealthStatus.Down;

            endpointHealthInfo = {
                name: endpointName,
                message: statusMessage,
                status: healthStatus
            }

        }
    }

    logDatabase.saveLogStatus(applicationName, endpointName, statusMessage);

    return endpointHealthInfo;
};

const getHealth = async (req: Request, res: Response) => {
    const applicationStatuses: ApplicationHealthInfo[] = await Promise.all(applications.map(async (application) => {
        const endpointStatuses: EndpointHealthInfo[] = await Promise.all(application.service.endpoints.map(endpoint => {
            const url = `${application.service.host_url}/${application.service.base_url}`;
            return fetchEndpointStatus(application.name, url, endpoint);
        }));

        const applicationHealthInfo: ApplicationHealthInfo = { name: application.name, services: endpointStatuses }
        return applicationHealthInfo;
    }));

    res.status(StatusCodes.OK).json(applicationStatuses);
}

export const logController = {
    getHealth
}