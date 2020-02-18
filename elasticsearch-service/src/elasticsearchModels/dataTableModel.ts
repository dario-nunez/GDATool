import { IVisualization } from "./visualizationModel";

export interface IDataTable extends IVisualization {
    explorerTitle: string;
    operations: string[];
    featureColumns: Array<string>;
    index: string;
}