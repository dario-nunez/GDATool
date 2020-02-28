"use strict";

import { Request, Response } from "express";
import { Document } from "mongoose";
import logger from "../logger/loggerFactory";
import { IRepository } from "../repositories/repository";

export interface IController {
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    delete(req: Request, res: Response): void;
    getById(req: Request, res: Response): void;
    getAll(req: Request, res: Response): void;
}

export class Controller<T extends Document> implements IController {
    public repo: IRepository<T>;

    constructor(repo: IRepository<T>) {
        this.repo = repo;
    }

    public create(req: Request, res: Response): void {
        const promise: Promise<T> = this.repo.create(req.body);
        promise.then(() => {
            res.send(req.body);
        });
        promise.catch((err) => {
            res.send(err);
        });
    }

    public delete(req: Request, res: Response): void {
        const promise = this.repo.delete(req.params.id);
        promise.then(() => {
            res.send("Successfully deleted a model!");
        });
        promise.catch((err) => {
            res.send(err);
        });
    }

    public getById(req: Request, res: Response): void {
        const promise = this.repo.getById(req.params.id);
        promise.then((o: T) => {
            logger.info(o);
            res.status(200).send(o);
        });
        promise.catch((reason: Error) => {
            logger.info(reason);
            res.status(500).send(reason);
        });
    }

    public update(req: Request, res: Response): void {
        const promise = this.repo.update(req.params.id, req.body);
        promise.then(() => {
            res.send("Successfully updated a model!");
        });
        promise.catch((err) => {
            logger.info(err);
            res.status(500).send(err);
        });
    }

    public getAll(req: Request, res: Response): void {
        const promise = this.repo.getAll();
        promise.then((o: Array<T>) => {
            logger.info(o);
            res.status(200).send(o);
        });
        promise.catch((reason: Error) => {
            logger.info(reason);
            res.status(500).send(reason);
        });
    }
}
