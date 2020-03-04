import axios from "axios";

/**
 * An http service that interacts with the Elasticsearch cluster. It is used to save Kibana
 * objects to the .kibana index.
 */
export class KibanaService {
    public createElasticsearchEntity(entityJson: any) : Promise<any> {
        return axios(entityJson);
    }
}
