import axios from "axios";

export class KibanaService {

    public createSimpleDashbaord(dashboardJSON: any): Promise<any> {
        return axios(dashboardJSON);
    }

    public createIndexPattern(indexPatternJSON: any): Promise<any> {
        return axios(indexPatternJSON);
    }

    public createMarkupVisualization(markupVisualizationJSON: any): Promise<any> {
        return axios(markupVisualizationJSON);
    }

    public createBarChartVisualization(newBarChartVisualization: any): Promise<any> {
        return axios(newBarChartVisualization);
    }

    public createMetricVisualization(metricVisualization: any): Promise<any> {
        return axios(metricVisualization);
    }

    public createDataTable(dataTableVisualization: any): Promise<any> {
        return axios(dataTableVisualization);
    }
}
