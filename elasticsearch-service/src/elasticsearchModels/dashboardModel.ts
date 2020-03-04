import { IESVisualization } from "./visualizationModel";

/**
 * Encapsulates the minimum metadata necessary to create a Dashboard object.
 */
export interface IESDashboard {
    _id: string;
    title: string;
    visualizations: Array<Array<IESVisualization>>;
    description: string;
}
