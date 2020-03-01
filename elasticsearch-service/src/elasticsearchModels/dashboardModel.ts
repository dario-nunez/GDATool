import { IESVisualization } from "./visualizationModel";

export interface IESDashboard {
    _id: string;
    title: string;
    visualizations: Array<Array<IESVisualization>>;
    description: string;
}
