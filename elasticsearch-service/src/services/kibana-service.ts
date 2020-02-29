import axios from "axios";

export class KibanaService {
    public createElasticsearchEntity(entityJson: any) : Promise<any> {
        return axios(entityJson);
    }
}
