import { AppComponent } from './app.component';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PasswordMathcValidatorDirective } from './sign-up-page/password-match.directive';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobComponent } from './jobs-page/job/job.component';
import { UserPageComponent } from './user-page/user-page.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { JobDetailsPageComponent } from './job-details-page/job-details-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DetailsComponent } from './create-job-page/details/details.component';
import { UploadComponent } from './create-job-page/upload/upload.component';
import { SchemaComponent } from './create-job-page/schema/schema.component';
import { QueryComponent } from './create-job-page/query/query.component';
import { ExecuteComponent } from './create-job-page/execute/execute.component';
import { StatusLineComponent } from './jobs-page/job/status-line/status-line.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { GeneralPlotsComponent } from './create-job-page/query/general-plots/general-plots.component';
import { AggregationsComponent } from './create-job-page/query/aggregations/aggregations.component';
import { AggregationFilteringComponent } from './create-job-page/query/aggregation-filtering/aggregation-filtering.component';
import { AggregationClusteringComponent } from './create-job-page/query/aggregation-clustering/aggregation-clustering.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { IUserModel } from '../../../mongodb-service/src/models/userModel';
import { IJobModel } from '../../../mongodb-service/src/models/jobModel';
import { IAggregationModel } from '../../../mongodb-service/src/models/aggregationModel';
import { IStatusLine } from 'src/models/statusLine.model';
import { Routes } from '@angular/router';
import { IClusterModel } from '../../../mongodb-service/src/models/clusterModel';
import { ISchema } from 'src/models/schema.model';
import { IColumn } from 'src/models/column.model';
import { IFilterModel } from '../../../mongodb-service/src/models/filterModel';

export function tokenGetter(): string {
    return localStorage.getItem("auth_token");
}

export const MOCK_FILTER:IFilterModel = {
    _id: "mock_id",
    aggName: "mock_aggName",
    query: "mock_query"
}

export const MOCK_QUERY_SERVICE = {
    aggregations: [],
    generalPlots: [],
    aggregationFilters: [],
    aggregationClusters: []
}

export const MOCK_COLUMN: IColumn = {
    name: "mock_name",
    type: "mock_type",
    range: ["0", "10"]
}

export const MOCK_SCHEMA: ISchema = {
    datasetName: "mock_dataset_name",
    schema: [MOCK_COLUMN]
}

export const MOCK_SCHEMA_SERVICE = {
    featureColumns: [],
    metricColumns: [],
    schema: "mock_schema",

    getSchema() {
        return MOCK_SCHEMA
    }
}

export const MOCK_USER: IUserModel = {
    _id: "mock_id",
    name: "mock_name",
    email: "emock_mail",
    password: "mock_password"
}

export const MOCK_JOB: IJobModel = {
    name: "string",
    _id: "string",
    description: "string",
    rawInputDirectory: "string",
    stagingFileName: "string",
    userId: "string",
    generateESIndices: true,
    jobStatus: 0,
}

export const MOCK_CLUSTER: IClusterModel = {
    aggName: "mock_name1",
    identifier: "mock_identifier",
    identifierType: "nominal",
    xAxis: "mock_x",
    xType: "quantitative",
    yAxis: "mock_y",
    yType: "quantitative"
}

export const MOCK_JOBS: Array<IJobModel> = [
    {
        name: "mock_name1",
        _id: "mock_id1",
        description: "mock_description1",
        rawInputDirectory: "mock_rawInputDirectory1",
        stagingFileName: "mock_stagingFileName1",
        userId: "mock_userId1",
        generateESIndices: true,
        jobStatus: 0,
    },
    {
        name: "mock_name2",
        _id: "mock_id2",
        description: "mock_description2",
        rawInputDirectory: "mock_rawInputDirectory2",
        stagingFileName: "mock_stagingFileName2",
        userId: "mock_userId2",
        generateESIndices: true,
        jobStatus: 0,
    }
]

export const MOCK_AGGREGATIONS: IAggregationModel[] = [
    {
        _id: "mock_id1",
        aggs: [],
        featureColumns: [],
        jobId: "mock_jobId1",
        metricColumn: "mock_metricColumn1",
        name: "mock_name1",
        sortColumnName: "mock_sortColumnName1"
    },
    {
        _id: "mock_id2",
        aggs: [],
        featureColumns: [],
        jobId: "mock_jobId2",
        metricColumn: "mock_metricColumn2",
        name: "mock_name2",
        sortColumnName: "mock_sortColumnName2"
    }
]

export const MOCK_STATUS_LINE: IStatusLine = {
    jobStatus: 0,
    lineText: "lineTest",
    lineTriggerStatus: 1
}

export const routes: Routes = [
    { path: "", component: MarketingPageComponent },
    { path: "logIn", component: LogInPageComponent },
    { path: "signUp", component: SignUpPageComponent },
    { path: "upload/" + MOCK_JOB._id, component: UploadComponent },
    { path: "jobsPage", component: JobsPageComponent },
    { path: "jobDetailsPage/" + MOCK_JOB._id, component: JobDetailsPageComponent },
    { path: "details", component: DetailsComponent },
    { path: "schema/" + MOCK_JOB._id, component: SchemaComponent },
    { path: "query/" + MOCK_JOB._id, component: QueryComponent },
    { path: "execute/" + MOCK_JOB._id, component: ExecuteComponent },
    { path: "dashboardPage/" + MOCK_JOB._id, component: DashboardPageComponent }
];

export const COMMON_DECLARATIONS = [
    AppComponent,
    MarketingPageComponent,
    LogInPageComponent,
    SignUpPageComponent,
    PasswordMathcValidatorDirective,
    JobsPageComponent,
    JobComponent,
    UserPageComponent,
    TopNavbarComponent,
    JobDetailsPageComponent,
    DashboardPageComponent,
    DetailsComponent,
    UploadComponent,
    SchemaComponent,
    QueryComponent,
    ExecuteComponent,
    StatusLineComponent,
    FileSelectDirective,
    GeneralPlotsComponent,
    AggregationsComponent,
    AggregationFilteringComponent,
    AggregationClusteringComponent
]

export const COMMON_IMPORTS = [
    BrowserModule,
    RouterTestingModule.withRoutes(routes),
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
        config: {
            tokenGetter,
            whitelistedDomains: [],
            blacklistedRoutes: ["/ms/user/createAndGetJWT", "/auth/jwt/getToken"]
        }
    }),
    NgbModule
]