import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Cluster visualization object.
 */
export interface IESClusterVis extends IESVisualization {
    index: string;
    explorerTitle: string;
    identifier: string;
    identifierType: string;
    xAxis: string;
    xType: string;
    yAxis: string;
    yType: string;
}