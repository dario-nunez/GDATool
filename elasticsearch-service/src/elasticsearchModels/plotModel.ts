import { IESVisualization } from "./visualizationModel";

export interface IESPlot extends IESVisualization {
    index: string;
    explorerTitle: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
} 