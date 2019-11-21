import { IVisualization } from "./visualizationModel";

export interface IDashboard {
    id: string;
    title: string;
    visualizations: Array<IVisualization>;
    description: string;
}
