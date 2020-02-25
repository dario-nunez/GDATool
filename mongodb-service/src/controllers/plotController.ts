import { Controller } from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { GET, Path, POST, PathParam } from "typescript-rest";
import { PlotRepository } from "../../../common-service/src/repositories/plotRepository";
import { IPlotModel, IPlot } from "../../../common-service/src/models/plotModel";

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
    public async getPlotsByJobId(@PathParam("id") id: string): Promise<IPlotModel> {
        return await this.plotRepository.getPlotsByJobId(id);
    }

    @Path("/multiple")
    @POST
    public async createMultiplePlots(plots: IPlotModel[]): Promise<IPlotModel[]> {
        return await this.plotRepository.createMultiplePlots(plots);
    }

    @POST
    public async createPlot(plot: IPlotModel): Promise<IPlotModel> {
        return await this.plotRepository.create(plot);
    }
}