import { IVisualization } from "./visualizationModel";

export interface IMetric extends IVisualization {
    explorerTitle: string;
    aggregationName: string;
    index: string;
}
