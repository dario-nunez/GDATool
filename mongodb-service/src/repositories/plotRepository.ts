import Plot, { IPlot, IPlotModel } from "../models/plotModel";
import { Repository } from "./repository";

export class PlotRepository extends Repository<IPlot> {
    constructor() {
        super(Plot);
    }

    public getPlotsByJobId(id: string): Promise<Array<IPlotModel>> {
        return Plot.find({jobId: id}).exec();
    }

    public async createMultiplePlots(plots: Array<IPlotModel>): Promise<Array<IPlotModel>> {
        for (const plot of plots) {
            this.create(plot);
        }

        return plots;
    }
}