/// <reference types="node" />
/// <reference types="request" />
/// <reference types="bluebird" />
/// <reference path="d/hotsapiclient.d.ts" />

class Result implements IHotsApiResult {
  constructor(data: Array<HotsApiReplay>, options: HotsApiOptionsWithPage, client: IHotsApiClient) {
    this.options = options;
    this.data = data;
    this.client = client;
  }

  client: IHotsApiClient
  data: Array<HotsApiReplay>;
  options: HotsApiOptionsWithPage;
  
  async getPreviousPage(): Promise<IHotsApiResult> {
    if(this.data.length == 0 || this.options.page == 0) {
      return null;
    }
    var newOptions: HotsApiOptionsWithPage = JSON.parse(JSON.stringify(this.options));
    newOptions.page -= 1;
    return await this.client.getReplayPage(this.options);
  }
  
  async getNextPage(): Promise<IHotsApiResult> {
    if(this.data.length == 0) {
      return null;
    }
    var newOptions: HotsApiOptionsWithPage = JSON.parse(JSON.stringify(this.options));
    newOptions.page += 1;

    return await this.client.getReplayPage(this.options);
  }
}

import bluebird = require("bluebird");
import request = require("request");
let requestAsync = bluebird.promisify(request);

class Client implements IHotsApiClient {
  generateQuery(options: HotsApiOptions): string {
    var strings: Array<string> = new Array<string>();
    for(var key in options) {
      strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
    }
    return "?" + strings.join("&");
  }

  async get(url: string): Promise<any> {
    var response = await requestAsync({url: url});
    if(response.statusCode != 200) {
      return null;
    }
    return JSON.parse(response.body);
  };
  
  async getReplayPage(options?: HotsApiOptionsWithPage): Promise<IHotsApiResult> {
    if(options == undefined) {
      options = {page: 0};
    }

    if(typeof(options.page) != "number") {
      options.page = 0;
    }

    var query: string = this.generateQuery(options);

    return new Result(await this.get("https://hotsapi.net/api/v1/replays/paged" + query), options, this);
  }
  
  async getReplay(id: number, options?: HotsApiOptions): Promise<HotsApiReplay> {
    var query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays/" + id + query);
  }

  async getReplays(options?: HotsApiOptions): Promise<Array<HotsApiReplay>> {
    var query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays" + query);
  }
}

export = Client;
