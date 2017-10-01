/// <reference path="hotsapi.d.ts" />

interface HotsApiOptions {
  start_date?: string,
  end_date?: string,
  game_map?: string,
  game_type?: string,
  min_id?: number,
  player?: string,
  hero?: string,
  with_players?: boolean,
  [key: string]: any
}

interface HotsApiOptionsWithPage extends HotsApiOptions {
  page: number
}

interface IHotsApiResult {
  getPreviousPage(): Promise<IHotsApiResult>;
  getNextPage(): Promise<IHotsApiResult>;
  data: Array<HotsApiReplay>;
}

interface IHotsApiClient {
  getReplayPage(options: HotsApiOptions): Promise<IHotsApiResult>;
  getReplay(id: number, options: HotsApiOptions): Promise<HotsApiReplay>;
  getReplays(options: HotsApiOptions): Promise<Array<HotsApiReplay>>;
}
