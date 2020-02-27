import Plot, { IPlot } from "../models/plotModel";
import { Repository } from "./repository";

export class PlotRepository extends Repository<IPlot> {
    constructor() {
        super(Plot);
    }

    public getPlotsByJobId(id: any): Promise<Array<IPlot>> {
        return Plot.find({jobId: id}).exec();
    }

    public async createMultiplePlots(plots: Array<any>): Promise<Array<IPlot>> {
        for (const plot of plots) {
            this.create(plot);
        }

        return plots;
    }
}