import { IColumn } from './column.model';

export interface ISchema {
    datasetName: string;
    schema: Array<IColumn>;
}