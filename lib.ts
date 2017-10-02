/// <reference types="node" />
/// <reference types="request" />
/// <reference types="bluebird" />
/// <reference path="types/hotsapiclient.d.ts" />

class Result implements IHotsApiResult {
  constructor(data: HotsApiPaged, options: HotsApiOptionsWithPage, client: IHotsApiClient) {
    this.options = options;
    this.data = data;
    this.client = client;
  }

  private client: IHotsApiClient;
  private data: HotsApiPaged;
  private options: HotsApiOptionsWithPage;

  private duplicateOptions(): HotsApiOptionsWithPage {
    var ret: HotsApiOptionsWithPage;

    for(var key in this.options) {
      ret[key] = this.options[key];
    }

    return ret;
  }

  public getReplays(): Array<HotsApiReplay> {
    return this.data.replays;
  }

  public async getPreviousPage(): Promise<IHotsApiResult> {
    if(this.data.replays.length == 0 || this.options.page == 0) {
      return null;
    }
    
    var newOptions: HotsApiOptionsWithPage = this.duplicateOptions();
    newOptions.page = (this.data.page || this.options.page) - 1;

    return await this.client.getReplayPage(this.options);
  }
  
  public async getNextPage(): Promise<IHotsApiResult> {
    if(this.data.replays.length == 0) {
      return null;
    }

    var newOptions: HotsApiOptionsWithPage = this.duplicateOptions();
    newOptions.page = (this.data.page || this.options.page) + 1;

    return await this.client.getReplayPage(this.options);
  }
}

import bluebird = require("bluebird");
import req = require("request");
let request = bluebird.promisify(req);

class Client implements IHotsApiClient {

  private generateQuery(options: HotsApiOptions): string {
    var strings: Array<string> = new Array<string>();
    for(var key in options) {
      strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
    }
    return "?" + strings.join("&");
  }
  
  private async post(url: string, replay: Uint8Array): Promise<any> {
    var response = await request({url: url, method: 'POST', formData: {"replay": replay}});
    if(response.statusCode != 200) {
      return null;
    }
    return JSON.parse(response.body);
  };
    
  private async get(url: string): Promise<any> {
    var response = await request({url: url, method: 'GET'});
    if(response.statusCode != 200) {
      return null;
    }
    return JSON.parse(response.body);
  };
  
  public async getReplayPage(options?: HotsApiOptionsWithPage): Promise<IHotsApiResult> {
    if(options == undefined) {
      options = {page: 0};
    }

    if(typeof(options.page) != "number") {
      options.page = 0;
    }

    var query: string = this.generateQuery(options);

    return new Result(await this.get("https://hotsapi.net/api/v1/replays/paged" + query), options, this);
  }
  
  public async getReplay(id: number, options?: HotsApiOptions): Promise<HotsApiReplay> {
    var query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays/" + id + query);
  }

  public async getReplays(options?: HotsApiOptions): Promise<Array<HotsApiReplay>> {
    var query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays" + query);
  }

  public toString(): string {
    return "HotsAPIClient.v1 version 1.0.0";
  }
}

export = Client;
