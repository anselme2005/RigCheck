
import "dotenv/config";
import mongoose from "mongoose";
import Game from "../src/models/Game.js";

/**
 * Initial RigCheck catalog seed.
 *
 * These are discovery/catalog records, not verified compatibility records.
 * No CPU, GPU, RAM, DirectX, or storage requirements are fabricated here.
 *
 * Running this script again updates the same records by slug rather than
 * creating duplicates. Existing verification fields are not overwritten
 * unless they are part of the fields explicitly set below.
 */
const previewGames = [
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    aliases: ["Cyberpunk"],
    genre: " Action RPG",
    releaseYear: 2020,
    description:
      "An open-world role-playing game set in the futuristic Night City.",
    dataStatus: "preview",
  },
  {
    title: "Elden Ring",
    slug: "elden-ring",
    aliases: [],
    genre: "Action RPG",
    releaseYear: 2022,
    description:
      "An action role-playing adventure set in a vast fantasy world.",
    dataStatus: "preview",
  },
  {
    title: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    aliases: ["GTA V", "GTA 5", "Grand Theft Auto 5"],
    genre: "Action-Adventure",
    releaseYear: 2013,
    description:
      "An open-world action-adventure game set in Los Santos and its surrounding areas.",
    dataStatus: "preview",
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    aliases: ["RDR2"],
    genre: "Action-Adventure",
    releaseYear: 2018,
    description:
      "An open-world western adventure following Arthur Morgan and the Van der Linde gang.",
    dataStatus: "preview",
  },
  {
    title: "Forza Horizon 5",
    slug: "forza-horizon-5",
    aliases: ["FH5"],
    genre: "Racing",
    releaseYear: 2021,
    description:
      "An open-world racing game set across a range of environments in Mexico.",
    dataStatus: "preview",
  },
  {
    title: "Minecraft",
    slug: "minecraft",
    aliases: ["Minecraft Java Edition", "Minecraft Bedrock Edition"],
    genre: "Sandbox",
    releaseYear: 2011,
    description:
      "A sandbox game centered on exploration, building, and survival.",
    dataStatus: "preview",
  },
  {
    title: "VALORANT",
    slug: "valorant",
    aliases: ["Valorant"],
    genre: "Tactical Shooter",
    releaseYear: 2020,
    description:
      "A tactical team-based shooter featuring agents with distinct abilities.",
    dataStatus: "preview",
  },
  {
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    aliases: ["The Witcher 3", "Witcher 3"],
    genre: "RPG",
    releaseYear: 2015,
    description:
      "An open-world role-playing adventure following monster hunter Geralt of Rivia.",
    dataStatus: "preview",
  },
];

async function seedGames() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is missing. Check the backend .env configuration.",
    );
  }

  await mongoose.connect(mongoUri);

  let inserted = 0;
  let updated = 0;

  for (const game of previewGames) {
    const existing = await Game.findOne({ slug: game.slug }).select("_id");

    await Game.updateOne(
      { slug: game.slug },
      {
        $set: {
          ...game,
          catalogStatus: "published",
          platform: "PC",
        },
        $setOnInsert: {
          minimumRequirements: {},
          recommendedRequirements: {},
          sources: [],
          requirementsVerifiedAt: null,
        },
      },
      { upsert: true, runValidators: true },
    );

    if (existing) {
      updated += 1;
    } else {
      inserted += 1;
    }
  }

  console.log(
    `Game catalog seed complete. Inserted: ${inserted}; updated: ${updated}.`,
  );
  console.log(
    "All seeded games are marked as preview data; requirements remain unverified.",
  );
}

seedGames()
  .catch((error) => {
    console.error("Failed to seed the game catalog:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });