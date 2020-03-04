import Plot, { IPlot, IPlotModel } from "../models/plotModel";
import { Repository } from "./repository";

/**
 * Extends the base Repository class and adds methods unique to Plots.
 */
export class PlotRepository extends Repository<IPlot> {
    constructor() {
        super(Plot);
    }

    /**
     * Return a collection of plots given a Job id.
     * @param id 
     */
    public getPlotsByJobId(id: string): Promise<Array<IPlotModel>> {
        return Plot.find({jobId: id}).exec();
    }

    /**
     * Store a collection of Plots.
     * @param plots 
     */
    public async createMultiplePlots(plots: Array<IPlotModel>): Promise<Array<IPlotModel>> {
        for (const plot of plots) {
            this.create(plot);
        }
        return plots;
    }
}