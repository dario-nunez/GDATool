import { IVisualization } from "./visualizationModel";

export interface IDashboard {
    id: string;
    title: string;
    visualizations: Array<Array<IVisualization>>;
    description: string;
}
