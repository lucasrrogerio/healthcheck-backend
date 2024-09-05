import { Request, Response } from "express"

import { StatusCodes } from "http-status-codes"

import { applicationStatusService } from "../../service/applicationStatus";

const getPaginationQueryParams = (req: Request) => {
    const { page, limit } = req.query;

    const pageNumber: number = Number(page);
    const limitNumber: number = Number(limit);

    return {
        page: !isNaN(pageNumber) ? pageNumber : undefined,
        limit: !isNaN(limitNumber) ? limitNumber : undefined
    };
}

const errorResponse = async (err: unknown, res: Response) => {
    const errorMessage = (err instanceof Error) ? err.message : 'Erro desconhecido.';
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
}

const getAllRecent = async (req: Request, res: Response) => {
    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAllRecent();
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAll = async (req: Request, res: Response) => {
    const { page, limit } = getPaginationQueryParams(req);

    try {
        const applicationStatuses: Log[] = await applicationStatusService.getAll(page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

const getAllCount = async (req: Request, res: Response) => {
    try {
        const applicationStatusesCount: number = await applicationStatusService.getAllCount();
        res.status(StatusCodes.OK).json(applicationStatusesCount);
    } catch (err: unknown) {
        errorResponse(err, res);
    }

}
const get = async (req: Request, res: Response) => {
    const { page, limit } = getPaginationQueryParams(req);
    const { service } = req.params;

    try {
        const applicationStatuses: Log[] = await applicationStatusService.get(service, page, limit);
        res.status(StatusCodes.OK).json(applicationStatuses);
    } catch (err: unknown) {
        errorResponse(err, res);
    }
}

export const applicationStatusController = {
    getAllRecent,
    getAll,
    getAllCount,
    get
}