const users = [
  {
    id: '1sdf',
    name: "stuart",
    email: "slump@gmail.com"
  },
  {
    id: '1sdsadff',
    name: "jenni",
    email: "jenni@gmail.com"
  },
  {
    id: 'asdfase',
    name: "ratchet",
    email: "ratchet@gmail.com"
  },
]

const tournaments = [
  {
    id: "alsk",
    name: "FNF1"
  },
  {
    id: "dasf",
    name: "FNF2"
  },
  {
    id: "gagwe",
    name: "FNF3"
  },
]

const matches = [
  {
    id: "1",
    tournament: "alsk",
    homePlayer: "1",
    awayPlayer: "2",
    home_score: 24,
    away_score: 20,
  },
  {
    id: "2",
    tournament: "alsk",
    homePlayer: "3",
    awayPlayer: "4",
    home_score: 16,
    away_score: 9,
  },
]

const players = [
  {
    id: "1",
    name: "slump"
  },
  {
    id: "2",
    name: "antcap24"
  },
  {
    id: "3",
    name: "deliverance"
  },
  {
    id: "4",
    name: "hollywood"
  },
]

const db = {
  users,
  tournaments,
  matches,
  players
}

export default db