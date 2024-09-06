import { Request, Response } from "express"

import { StatusCodes } from "http-status-codes"

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

const errorResponse = async (err: unknown, res: Response): Promise<void> => {
    const errorMessage = (err instanceof Error) ? err.message : 'Erro desconhecido.';
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
}

const getAllRecent = async (req: Request, res: Response): Promise<void> => {
    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllAppStatusRecent();
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = getPaginationQueryParams(req);

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllAppStatus(page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAllCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const applicationStatusesCount: number = await applicationStatusService.getAllAppStatusCount();
        res.status(StatusCodes.OK).json(applicationStatusesCount);
    } catch (err: unknown) {
        errorResponse(err, res);
    }

}

const get = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = getPaginationQueryParams(req);
    const { service } = req.params;

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAppStatusByName(service, page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getCount = async (req: Request, res: Response): Promise<void> => {
    const { service } = req.params;

    try {
        const applicationStatusesCount: number = await applicationStatusService.getAppStatusByNameCount(service);
        res.status(StatusCodes.OK).json(applicationStatusesCount);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

export const applicationStatusController = {
    getAllRecent,
    getAll,
    getAllCount,
    get,
    getCount,
}