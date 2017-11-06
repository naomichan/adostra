interface HotsApiPlayer {
  battletag: string,
  hero: string,
  hero_level: number,
  team: number,
  winner: boolean,
  blizz_id: number,
  silenced: boolean,
  party: number,
  talents: Array<HotsApiTalent>,
  scores: Array<HotsApiPlayerScore>
}

interface HotsApiPlayerScore {
  level: number,
  kills: number,
  assists: number,
  takedowns: number,
  deaths: number,
  highest_kill_streak: number,
  hero_damage: number,
  siege_damage: number,
  structure_damage: number,
  minion_damage: number,
  creep_damage: number,
  summon_damage: number,
  time_cc_enemy_heroes: number,
  healing: number,
  self_healing: number,
  damage_taken: number,
  experience_contribution: number,
  town_kills: number,
  time_spent_dead: number,
  merc_camp_captures: number,
  watch_tower_captures: number,
  meta_experience: number
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
  page: number,
  page_count: number,
  total: number,
  per_page: number,
  replays: Array<HotsApiReplay>
}

interface HotsApiHero {
  name: string,
  short_name: string,
  attribute_id: string,
  translations: Array<string>,
  icon_url: {[key: string]: string},
  role: string,
  type: string,
  release_date: string,
  abilities: Array<HotsApiHeroAbility>,
  talents: Array<HotsApiTalent>
}

interface HotsApiHeroAbility {
  owner: string,
  name: string,
  title: string,
  description: string,
  icon: string,
  hotkey: string,
  cooldown: number,
  mana_cost: number,
  trait: boolean
}

interface HotsApiTalent {
  name: string,
  title: string,
  description: string,
  icon: string,
  icon_url: {[key: string]: string},
  ability: string,
  sort: number,
  cooldown: number,
  mana_cost: number,
  level: number,
}

interface HotsApiMap {
  name: string,
  translations: Array<string>
}

interface HotsApiFingerprintExistence {
  exists: boolean
}

interface HotsApiReplayUpload {
  success: string,
  Error: string,
  status: string,
  id: number,
  file: string,
  url: string
}
