import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Bar Chart visualization object.
 */
export interface IESBarChartVis extends IESVisualization {
    explorerTitle: string;
    featureColumn: string;
    operationName: string;
    metricColumn: string;
    index: string;
}
