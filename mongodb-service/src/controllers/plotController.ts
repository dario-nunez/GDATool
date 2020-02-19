import { Controller } from "../../../common-service/src/controllers/controller";
import { Inject } from "typescript-ioc";
import { GET, Path, POST } from "typescript-rest";
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