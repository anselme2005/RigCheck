/**
 * Initial game discovery data for the RigCheck frontend.
 *
 * IMPORTANT:
 * These entries support the UI during development only.
 * They do not contain verified system requirements or performance claims.
 * Keep hardware requirements out of this file until each game's data
 * has a reliable source and a recorded verification date.
 */
export const games = [
  {
    id: "cyberpunk-2077",
    slug: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    genre: "Action RPG",
    platform: "PC",
    year: 2020,
    initials: "2077",
    artworkTone: "amber",
    description:
      "Explore Night City, a sprawling open-world metropolis in a story-driven action RPG.",
  },
  {
    id: "elden-ring",
    slug: "elden-ring",
    title: "Elden Ring",
    genre: "Action RPG",
    platform: "PC",
    year: 2022,
    initials: "ER",
    artworkTone: "olive",
    description:
      "Explore a vast fantasy world and face challenging enemies in an open-world action RPG.",
  },
  {
    id: "gta-v",
    slug: "grand-theft-auto-v",
    title: "Grand Theft Auto V",
    genre: "Action-adventure",
    platform: "PC",
    year: 2015,
    initials: "V",
    artworkTone: "green",
    description:
      "Explore Los Santos in an open-world action-adventure game with a large city sandbox.",
  },
  {
    id: "red-dead-redemption-2",
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    genre: "Action-adventure",
    platform: "PC",
    year: 2019,
    initials: "RDR2",
    artworkTone: "rust",
    description:
      "Experience an open-world Western adventure set in a detailed fictional American frontier.",
  },
  {
    id: "forza-horizon-5",
    slug: "forza-horizon-5",
    title: "Forza Horizon 5",
    genre: "Racing",
    platform: "PC",
    year: 2021,
    initials: "FH5",
    artworkTone: "blue",
    description:
      "Drive a wide range of cars across a large open-world racing environment inspired by Mexico.",
  },
  {
    id: "minecraft",
    slug: "minecraft",
    title: "Minecraft",
    genre: "Sandbox",
    platform: "PC",
    year: 2011,
    initials: "MC",
    artworkTone: "forest",
    description:
      "Build, explore and survive in a block-based world shaped by your creativity.",
  },
  {
    id: "valorant",
    slug: "valorant",
    title: "VALORANT",
    genre: "Tactical shooter",
    platform: "PC",
    year: 2020,
    initials: "V",
    artworkTone: "red",
    description:
      "Compete in a tactical team-based shooter built around precise gunplay and unique abilities.",
  },
  {
    id: "the-witcher-3",
    slug: "the-witcher-3-wild-hunt",
    title: "The Witcher 3: Wild Hunt",
    genre: "Action RPG",
    platform: "PC",
    year: 2015,
    initials: "W3",
    artworkTone: "slate",
    description:
      "Follow a monster hunter through a story-rich fantasy world full of quests and exploration.",
  },
];

/**
 * Find one game using its URL-friendly slug.
 * The game detail page uses this instead of duplicating game data.
 */
export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug);
}
