import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Plot visualization object.
 */
export interface IESPlotVis extends IESVisualization {
    index: string;
    explorerTitle: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
} 