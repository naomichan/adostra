export interface HotsApiReplayOptions {
  start_date?: string,
  end_date?: string,
  game_map?: string,
  game_type?: string,
  min_id?: number,
  player?: string,
  hero?: string,
  with_players?: boolean,
  id?: string,
  page?: number,
  [key: string]: any
}

export interface HotsApiHeroOptoins {
  hero?: string,
  ability?: string,
  [key: string]: any
}

export interface HotsApiTalentOptions {
  talent: string,
  [key: string]: any
}

export interface HotsApiMapOptions {
  map?: string,
  [key: string]: any
}

