/// <reference path="../types/hotsapi.d.ts" />
import { HotsApiHeroOptoins, HotsApiReplayOptions, HotsApiReplayUploadOptions, HotsApiTalentOptions, HotsApiMapOptions } from './structs';
export declare class HotsAPIResult {
    constructor(data: HotsApiPaged, options: HotsApiReplayOptions, client: HotsAPIClient);
    private client;
    private data;
    private options;
    private duplicateOptions();
    getReplays(): Array<HotsApiReplay>;
    getPreviousPage(): Promise<HotsAPIResult | null>;
    getNextPage(): Promise<HotsAPIResult | null>;
}
export declare class HotsAPIClient {
    private generateQuery(options?);
    private post(url, replay);
    private get(url);
    getReplayPage(options?: HotsApiReplayOptions): Promise<HotsAPIResult>;
    getReplay(options?: HotsApiReplayOptions): Promise<HotsApiReplay | HotsAPIResult | null>;
    getReplays(options?: HotsApiReplayOptions): Promise<Array<HotsApiReplay> | HotsApiReplay | HotsAPIResult | null>;
    getAbility(options?: HotsApiHeroOptoins): Promise<HotsApiHeroAbility | null>;
    getHero(options?: HotsApiHeroOptoins): Promise<Array<HotsApiHero> | HotsApiHero | HotsApiHeroAbility | null>;
    getHeroes(options?: HotsApiHeroOptoins): Promise<Array<HotsApiHero> | HotsApiHero | HotsApiHeroAbility | null>;
    getTalent(options: HotsApiTalentOptions): Promise<HotsApiTalent | null>;
    getMap(options?: HotsApiMapOptions): Promise<Array<HotsApiMap> | HotsApiMap | null>;
    getMaps(options?: HotsApiMapOptions): Promise<Array<HotsApiMap> | HotsApiMap | null>;
    private static GUIDByteOrder;
    private static GUIDDashPositions;
    private fingerprint(data);
    getFingerprint(replayFile: string): Promise<string>;
    replayFingerprintV3(replayFile: string): Promise<HotsApiFingerprintExistence>;
    uploadReplay(replayFile: string, options?: HotsApiReplayUploadOptions): Promise<HotsApiReplayUpload | boolean>;
    toString(): string;
    private UA();
}
export default HotsAPIClient;
