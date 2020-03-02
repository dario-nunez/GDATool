import { IESVisualization } from "./visualizationModel";

export interface IESBarChart extends IESVisualization {
    explorerTitle: string;
    featureColumn: string;
    operationName: string;
    metricColumn: string;
    index: string;
}
