import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Data Table visualization object.
 */
export interface IESDataTableVis extends IESVisualization {
    explorerTitle: string;
    operations: Array<string>;
    featureColumns: Array<string>;
    index: string;
}