export interface HotsApiReplayOptions {
  start_date?: string, // >=
  end_date?: string, // <=
  game_map?: string, // NOTE: Currently disabled on hotsapi for performance reasons.
  game_type?: string,
  min_id?: number,
  player?: string,
  hero?: string, // NOTE: Currently disabled on hotsapi because broken.
  with_players?: boolean,
  id?: string,
  page?: number,
  [key: string]: any
}

export interface HotsApiReplayUploadOptions {
  uploadToHotslogs?: boolean,
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

