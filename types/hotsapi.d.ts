interface HotsApiPlayer {
  battletag: string,
  hero: string,
  hero_level: number,
  team: number,
  winner: boolean,
  blizz_id: number
}

interface HotsApiReplay {
  id: number,
  filename: string,
  size: number,
  game_type: string,
  game_date: string,
  game_length: number,
  game_version: string,
  region: number,
  fingerprint: string,
  url: string,
  players?: Array<HotsApiPlayer>
}

interface HotsApiPaged {
  page?: number,
  page_count?: number,
  total?: number,
  per_page?: number,
  replays: Array<HotsApiReplay>
}
