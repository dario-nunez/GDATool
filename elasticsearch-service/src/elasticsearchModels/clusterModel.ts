import { IVisualization } from "./visualizationModel";

export interface ICluster extends IVisualization {
    index: string;
    explorerTitle: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
}