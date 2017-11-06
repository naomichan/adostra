/// <reference types="node" />
/// <reference types="request" />
/// <reference types="bluebird" />
/// <reference path="../types/hotsapi.d.ts" />

import { HotsApiHeroOptoins, HotsApiReplayOptions, HotsApiTalentOptions, HotsApiMapOptions } from './structs';
import { Parser, GameType } from "nydus";
import { createHash } from "crypto";

export class HotsAPIResult {
  constructor(data: HotsApiPaged, options:  HotsApiReplayOptions, client: HotsAPIClient) {
    this.options = options;
    this.data = data;
    this.client = client;
  }

  private client: HotsAPIClient;
  private data: HotsApiPaged;
  private options:  HotsApiReplayOptions;

  private duplicateOptions():  HotsApiReplayOptions {
    let ret:  HotsApiReplayOptions = {};

    for(var key in this.options) {
      ret[key] = this.options[key];
    }

    return ret;
  }

  public getReplays(): Array<HotsApiReplay> {
    return this.data.replays;
  }

  public async getPreviousPage(): Promise<HotsAPIResult | null> {
    if(this.data.replays.length == 0 || this.options.page == 0) {
      return null;
    }
    
    const newOptions: HotsApiReplayOptions = this.duplicateOptions();
    let page = this.data.page;
    if(page === undefined && this.options.page !== undefined) {
      page = this.options.page;
    } else {
      return null;
    }
    newOptions.page = page - 1;

    return await this.client.getReplayPage(this.options);
  }
  
  public async getNextPage(): Promise<HotsAPIResult | null> {
    if(this.data.replays.length == 0) {
      return null;
    }

    const newOptions:  HotsApiReplayOptions = this.duplicateOptions();
    let page = this.data.page;
    if(page === undefined && this.options.page !== undefined) {
      page = this.options.page;
    } else {
      return null;
    }
    newOptions.page = page + 1;

    return await this.client.getReplayPage(this.options);
  }
}

import { promisify } from "bluebird";
import * as req from 'request';
import { readFile } from "fs";

let readFileAsync = promisify(readFile);
let request = promisify(req);

export class HotsAPIClient {
  private generateQuery(options?: HotsApiReplayOptions): string {
    if(options == undefined) {
      options = {};
    }
    var strings: Array<string> = new Array<string>();
    for(var key in options) {
      strings.push(encodeURIComponent(key) + "=" + encodeURIComponent(options[key]));
    }
    return "?" + strings.join("&");
  }
  
  private async post(url: string, replay: Uint8Array): Promise<any> {
    var response = await request({url: url, method: 'POST', headers: {"User-Agent": this.UA()}, formData: {"replay": replay}});
    if(response.statusCode != 200) {
      return null;
    }
    return JSON.parse(response.body);
  };
    
  private async get(url: string): Promise<any> {
    var response = await request({url: url, method: 'GET', headers: {"User-Agent": this.UA()}});
    if(response.statusCode != 200) {
      return null;
    }
    return JSON.parse(response.body);
  };
  
  public async getReplayPage(options?: HotsApiReplayOptions): Promise<HotsAPIResult> {
    if(options == undefined) {
      options = {page: 0};
    }

    if(typeof(options.page) != "number") {
      options.page = 0;
    }

    var query: string = this.generateQuery(options);

    return new HotsAPIResult(await this.get("https://hotsapi.net/api/v1/replays/paged" + query), options, this);
  }
  
  public async getReplay(options?: HotsApiReplayOptions): Promise<HotsApiReplay | HotsAPIResult | null> {
    if(options !== undefined && options.page !== undefined) {
      return await this.getReplayPage(options);
    }
    if(options === undefined || options.id === undefined) {
      return null;
    }
    const query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays/" + options.id + query);
  }
    
  public async getReplays(options?: HotsApiReplayOptions): Promise<Array<HotsApiReplay> | HotsApiReplay | HotsAPIResult | null> {
    if(options !== undefined && options.page !== undefined) {
      return await this.getReplayPage(options);
    }
    if(options !== undefined && options.id !== undefined) {
      return await this.getReplay(options);
    }
    const query: string = this.generateQuery(options);

    return await this.get("https://hotsapi.net/api/v1/replays" + query);
  }
  
  public async getAbility(options?: HotsApiHeroOptoins): Promise<HotsApiHeroAbility | null> {
    if(options === undefined || options.ability === undefined || options.hero === undefined) {
      return null;
    }

    return await this.get("https://hotsapi.net/api/v1/heroes/" + options.hero + "/abilities/" + options.ability);
  }
  
  public async getHero(options?: HotsApiHeroOptoins): Promise<HotsApiHero | HotsApiHeroAbility | null> {
    if(options === undefined || options.hero === undefined) {
      return null;
    }

    if(options.ability !== undefined) {
      return await this.getAbility(options);
    }

    return await this.get("https://hotsapi.net/api/v1/heroes/" + options.hero);
  }

  public async getHeroes(options?: HotsApiHeroOptoins): Promise<Array<HotsApiHero> | HotsApiHero | HotsApiHeroAbility | null> {
    if(options !== undefined) {
      if(options.hero !== undefined) {
        if(options.ability !== undefined) {
          return await this.getAbility(options);
        }
        return await this.getHero(options);
      }
    }

    return await this.get("https://hotsapi.net/api/v1/heroes/");
  }
  
  public async getTalent(options: HotsApiTalentOptions): Promise<HotsApiTalent | null> {
    if(options === undefined || options.talent === undefined) {
      return null;
    }

    return await this.get("https://hotsapi.net/api/v1/talents/" + options.talent);
  }
  
  public async getMap(options?: HotsApiMapOptions): Promise<HotsApiMap | null> {
    if(options === undefined || options.map === undefined) {
      return null;
    }

    return await this.get("https://hotsapi.net/api/v1/maps/" + options.map);
  }

  public async getMaps(options?: HotsApiMapOptions): Promise<Array<HotsApiMap> | HotsApiMap | null> {
    if(options !== undefined && options.map !== undefined) {
      return await this.getMap(options);
    }

    return await this.get("https://hotsapi.net/api/v1/maps/");
  }

  private static GUIDByteOrder = [3, 2, 1, 0, 5, 4, 7, 6, 8, 9, 10, 11, 12, 13, 14, 15];
  private static GUIDDashPositions = [3, 5, 7, 9];

  private fingerprint(data: string): string {
    const bytes: Buffer = createHash("md5").update(data, "utf8").digest();

    let result = "";
    for(let i = 0; i < 16; ++i) {
      result += bytes.readUInt8(HotsAPIClient.GUIDByteOrder[i]).toString(16);
      if(HotsAPIClient.GUIDDashPositions.includes(i)) {
        result += "-";
      }
    }

    return result;
  }

  public async getFingerprint(replayFile: string): Promise<string | null> {
    const Nydus = new Parser(GameType.HERO);
    await Nydus.reload();
    try {
      const Replay = await Nydus.loadReplay(replayFile);
      await Replay.loadProtocol();
      let details = await Replay.parseDetails();
      let initData = await Replay.parseInitData();
      let ids: Array<any> = new Array<any>();
      for(let i = 0; i < details.m_playerList.length; ++i) {
        ids.push(details.m_playerList[i].m_toon.m_id);
      }
      ids = ids.sort();
      return this.fingerprint(ids.join("") + initData.m_syncLobbyState.m_gameDescription.m_randomValue);
    } catch {
      return null;
    }
  }
  
  public async replayFingerprintV3(replayFile: string): Promise<HotsApiFingerprintExistence | null> {
    const fingerprint = await this.getFingerprint(replayFile);
    if(fingerprint == null) {
      return null;
    }

    return this.get("https://hotsapi.net/api/v1/fingerprints/v3/" + fingerprint);
  }

  public async uploadReplay(replayFile: string): Promise<HotsApiReplayUpload | boolean> {
    const existence = await this.replayFingerprintV3(replayFile);
    if(existence === null) {
      return false;
    }
    if(existence.exists) {
      return true;
    }

    const file = await readFileAsync(replayFile);

    return await this.post("https://hotsapi.net/api/v1/replays", file);
  }

  public toString(): string {
    return "Adostra.v1 version 1.0.0";
  }

  private UA(): string {
    return "adostra=1.0.0;node;request";
  }
}

export default HotsAPIClient;
