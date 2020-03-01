import { IESVisualization } from "./visualizationModel";

export interface IESBarChart extends IESVisualization {
    explorerTitle: string;
    featureColumn: string;
    aggregationName: string;
    metricColumn: string;
    index: string;
}
