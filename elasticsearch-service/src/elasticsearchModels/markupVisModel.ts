import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Markup visualization object.
 */
export interface IESMarkupVis extends IESVisualization {
    explorerTitle: string;
    displayText: string;
}
