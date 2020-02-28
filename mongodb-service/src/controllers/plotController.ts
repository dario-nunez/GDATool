import { Inject } from "typescript-ioc";
import { DELETE, GET, Path, PathParam, POST } from "typescript-rest";
import { IPlot, IPlotModel } from "../models/plotModel";
import { PlotRepository } from "../repositories/plotRepository";
import { Controller } from "./controller";

@Path("/ms/plot")
export class PlotController extends Controller<IPlot> {
    constructor(@Inject private plotRepository: PlotRepository) {
        super(plotRepository);
    }

    @Path("getAll")
    @GET
    public async getAllPlots(): Promise<Array<IPlotModel>> {
        return await this.plotRepository.getAll();
    }

    @Path("byJob/:id")
    @GET
    public async getPlotsByJobId(@PathParam("id") id: string): Promise<Array<IPlotModel>> {
        return await this.plotRepository.getPlotsByJobId(id);
    }

    @Path("/multiple")
    @POST
    public async createMultiplePlots(plots: Array<IPlotModel>): Promise<Array<IPlotModel>> {
        return await this.plotRepository.createMultiplePlots(plots);
    }

    @POST
    public async createPlot(plot: IPlotModel): Promise<IPlotModel> {
        return await this.plotRepository.create(plot);
    }

    @Path(":id")
    @DELETE
    public async deleteAggregation(@PathParam("id") id: string): Promise<IPlotModel> {
        return await this.plotRepository.delete(id);
    }
}