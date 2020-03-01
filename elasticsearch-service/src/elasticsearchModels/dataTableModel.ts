import { IESVisualization } from "./visualizationModel";

export interface IESDataTable extends IESVisualization {
    explorerTitle: string;
    operations: Array<string>;
    featureColumns: Array<string>;
    index: string;
}