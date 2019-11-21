import logger from "../../../common-service/src/logger/loggerFactory";
import { Inject } from "typescript-ioc";
import { Path, PUT } from "typescript-rest";
import { IVisBarCHart } from "../elasticsearchModels/visBarChartModel";
import { IVisMarkup } from "../elasticsearchModels/visMarkupModel";
import { KibanaService } from "../services/kibana-service";
import { ElasticServiceBaseController } from "./elasticServerBaseController";

@Path("/es/visualization")
export class VisualizationController extends ElasticServiceBaseController {

    constructor(@Inject private kibanaService: KibanaService) {
        super();
    }

    /**
     * Creates a new markup visualization.
     * @param newMarkupVisualization The markup visualization object to be created and stored in the database.
     */
    @Path("markup")
    @PUT
    public async createMarkupVisualization(newMarkupVisualization: IVisMarkup): Promise<any> {
        logger.info("Create markup visualization: ");
        logger.info(newMarkupVisualization);
        const markupVisualizationJSON = this.getMarkupVisualizationJSON(newMarkupVisualization);

        try {
            const response = await this.kibanaService.createMarkupVisualization(markupVisualizationJSON);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    /**
     * Creates a new bar chart visualization.
     * @param newBarChartVisualization The bar chart visualization object to be created and stored in the database.
     */
    @Path("barChart")
    @PUT
    public async createBarChartVisualization(newBarChartVisualization: IVisBarCHart): Promise<any> {
        logger.info("Create bar chart visualization: ");
        logger.info(newBarChartVisualization);
        const barChartVisualizationJSON = this.getBarChartVisualizationJSON(newBarChartVisualization);

        try {
            const response = await this.kibanaService.createBarChartVisualization(barChartVisualizationJSON);
            return response.data;
        } catch (error) {
            return error;
        }
    }

    public getBarChartVisualizationJSON(newBarChartVisualization: IVisBarCHart) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + newBarChartVisualization.id,
            data:
            {
                visualization:
                {
                    title: newBarChartVisualization.explorerTitle,
                    visState: '{"title":"' + newBarChartVisualization.id + '","type":"histogram","params":{"type":"histogram","grid":{"categoryLines":false,"style":{"color":"#eee"}},"categoryAxes":[{"id":"CategoryAxis-1","type":"category","position":"bottom","show":true,"style":{},"scale":{"type":"linear"},"labels":{"show":true,"truncate":100},"title":{}}],"valueAxes":[{"id":"ValueAxis-1","name":"LeftAxis-1","type":"value","position":"left","show":true,"style":{},"scale":{"type":"linear","mode":"normal"},"labels":{"show":true,"rotate":0,"filter":false,"truncate":100},"title":{"text":"Price Average"}}],"seriesParams":[{"show":"true","type":"histogram","mode":"stacked","data":{"label":"Price Average","id":"1"},"valueAxis":"ValueAxis-1","drawLinesBetweenPoints":true,"showCircles":true}],"addTooltip":true,"addLegend":true,"legendPosition":"right","times":[],"addTimeMarker":false},"aggs":[{"id":"1","enabled":true,"type":"max","schema":"metric","params":{"field":"avg","customLabel":"Price Average"}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"' + newBarChartVisualization.featureColumn + '.keyword","size":20,"order":"desc","orderBy":"_key","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: { searchSourceJSON: '{"query":{"query":"","language":"kuery"},"filter":[],"indexRefName":"kibanaSavedObjectMeta.searchSourceJSON.index"}' }
                },
                type: "visualization",
                references: [
                    {
                        name: "kibanaSavedObjectMeta.searchSourceJSON.index",
                        type: "index-pattern",
                        id: newBarChartVisualization.index
                    }
                ],
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2019-06-23T21:51:18.131Z"
            }
        };
    }

    public getMarkupVisualizationJSON(newMarkupVisualization: IVisMarkup) {
        return {
            method: "PUT",
            url: this.elasticSearchUrl + this.indexName + "_doc/visualization:" + newMarkupVisualization.id,
            data:
            {
                visualization:
                {
                    title: newMarkupVisualization.explorerTitle,
                    visState: '{"aggs":[],"params":{"fontSize":13,"markdown":"# ' + newMarkupVisualization.displayTitle + ' #","openLinksInNewTab":false},"title":"whats this?","type":"markdown"}',
                    uiStateJSON: "{}",
                    description: "",
                    version: 1,
                    kibanaSavedObjectMeta: { searchSourceJSON: '{"query":{"language":"kuery","query":""},"filter":[]}' }
                },
                type: "visualization",
                references: [] as Array<any>,
                migrationVersion: {
                    visualization: "7.3.0"
                },
                updated_at: "2019-06-23T22:22:58.233Z"
            }
        };
    }
}
