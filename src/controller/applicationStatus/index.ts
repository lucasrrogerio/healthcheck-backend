import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { Readable } from "stream";

import { applicationStatusService } from "../../service/applicationStatus";

interface PaginationParams {
    page: number | undefined;
    limit: number | undefined;
}

const getPaginationQueryParams = (req: Request): PaginationParams => {
    const { page, limit } = req.query;

    const pageNumber: number = Number(page);
    const limitNumber: number = Number(limit);

    return {
        page: !isNaN(pageNumber) ? pageNumber : undefined,
        limit: !isNaN(limitNumber) ? limitNumber : undefined
    };
}

const exportLogDataStream = (logs: Log[], res: Response, application?: string,) => {
    const readable = new Readable({
        read() {
            this.push(JSON.stringify(logs, null, 2));
            this.push(null);
        }
    });

    const filename = application ? `${application}_full_logs` : 'full_logs';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
    res.setHeader('Content-Type', 'application/json');
    readable.pipe(res);
};

const errorResponse = async (err: unknown, res: Response): Promise<void> => {
    const errorMessage = (err instanceof Error) ? err.message : 'Erro desconhecido.';
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
}

const getAllAppStatusRecent = async (req: Request, res: Response): Promise<void> => {
    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllAppStatusRecent();
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAllAppStatus = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = getPaginationQueryParams(req);

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllAppStatus(page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAllAppStatusCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const applicationStatusesCount: number = await applicationStatusService.getAllAppStatusCount();
        res.status(StatusCodes.OK).json(applicationStatusesCount);
    } catch (err: unknown) {
        errorResponse(err, res);
    }

}

const getAppStatusFromApp = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = getPaginationQueryParams(req);
    const { application } = req.params;

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAppStatusByName(application, page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAppStatusFromAppCount = async (req: Request, res: Response): Promise<void> => {
    const { application } = req.params;

    try {
        const applicationStatusesCount: number = await applicationStatusService.getAppStatusByNameCount(application);
        res.status(StatusCodes.OK).json(applicationStatusesCount);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const exportAllLogs = async (req: Request, res: Response) => {
    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllAppStatus();
        exportLogDataStream(applicationStatuses, res);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const exportAllLogsFromApp = async (req: Request, res: Response) => {
    const { application } = req.params;

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAppStatusByName(application);
        exportLogDataStream(applicationStatuses, res, application);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

export const applicationStatusController = {
    getAllAppStatusRecent,
    getAllAppStatus,
    getAllAppStatusCount,
    getAppStatusFromApp,
    getAppStatusFromAppCount,
    exportAllLogs,
    exportAllLogsFromApp
}