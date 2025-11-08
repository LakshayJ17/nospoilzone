import { Request, Response, NextFunction } from "express"
import { AuthRequest } from "../types/request";

type AsyncRequestHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export { asyncHandler }

