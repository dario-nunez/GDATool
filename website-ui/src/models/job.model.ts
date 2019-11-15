import { IRun } from './run.model';

export interface IJob {
    name: string;
    _id: string;
    description: string;
    rawInputDirectory: string;
    stagingFielName: string;
    userId: string;
    jobStatus: string;
    runs: IRun[];
}