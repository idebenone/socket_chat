import { Router, Request, Response, NextFunction } from 'express';

const message = Router();

message.get("/messages", async (req: Request, res: Response) => {

})

export default message;
