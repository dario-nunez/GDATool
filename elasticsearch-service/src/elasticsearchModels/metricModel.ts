import { IESVisualization } from "./visualizationModel";

export interface IESMetric extends IESVisualization {
    explorerTitle: string;
    aggregationName: string;
    index: string;
}
