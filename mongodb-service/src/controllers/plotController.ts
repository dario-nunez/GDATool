import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { IPlot, IPlotModel } from "../models/plotModel";
import { PlotRepository } from "../repositories/plotRepository";
import { Controller } from "./controller";

/**
 * Plot endpoints rooted at "/ms/plot".
 */
@Path("/ms/plot")
export class PlotController extends Controller<IPlot> {
    constructor(@Inject private plotRepository: PlotRepository) {
        super(plotRepository);
    }

    /**
     * Return all Plots.
     */
    @Path("getAll")
    @GET
    public async getAllPlots(): Promise<Array<IPlotModel>> {
        return await this.plotRepository.getAll();
    }

    /**
     * Return all Plots linked to a Job id.
     * @param id 
     */
    @Path("byJob/:id")
    @GET
    public async getPlotsByJobId(@PathParam("id") id: string): Promise<Array<IPlotModel>> {
        return await this.plotRepository.getPlotsByJobId(id);
    }

    /**
     * Store a collection of Plots.
     * @param plots 
     */
    @Path("/multiple")
    @POST
    public async createMultiplePlots(plots: Array<IPlotModel>): Promise<Array<IPlotModel>> {
        return await this.plotRepository.createMultiplePlots(plots);
    }

    /**
     * Crete a single Plot.
     * @param plot 
     */
    @POST
    public async createPlot(plot: IPlotModel): Promise<IPlotModel> {
        return await this.plotRepository.create(plot);
    }

    /**
     * Delete a Plot by id.
     * @param id 
     */
    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IPlotModel> {
        return await this.plotRepository.delete(id);
    }
}