
import mongoose from "mongoose";

/**
 * A curated game-catalog record.
 *
 * Important:
 * - A catalog entry is not automatically a verified compatibility record.
 * - Requirements stay null until supported by a reliable source.
 * - Source and review fields let us introduce data verification properly.
 */
const requirementSetSchema = new mongoose.Schema(
  {
    operatingSystem: { type: String, default: null },
    processor: { type: String, default: null },
    memoryGB: { type: Number, default: null },
    graphics: { type: String, default: null },
    directX: { type: String, default: null },
    storageGB: { type: Number, default: null },
    additionalNotes: { type: String, default: null },
  },
  { _id: false },
);

const gameSourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    accessedAt: { type: Date, default: null },
    notes: { type: String, default: null, trim: true },
  },
  { _id: false },
);

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    aliases: {
      type: [String],
      default: [],
      validate: {
        validator: (aliases) => aliases.every((alias) => alias.trim().length > 0),
        message: "Aliases cannot contain empty strings.",
      },
    },
    genre: { type: String, default: "Unclassified", trim: true },
    releaseYear: { type: Number, default: null, min: 1970, max: 2100 },
    description: { type: String, default: "", trim: true, maxlength: 2000 },
    coverImageUrl: { type: String, default: null, trim: true },
    platform: { type: String, default: "PC", trim: true },

    // "preview" records are visible in the catalog but aren't verified.
    catalogStatus: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    dataStatus: {
      type: String,
      enum: ["preview", "needs-review", "verified"],
      default: "preview",
      index: true,
    },

    minimumRequirements: {
      type: requirementSetSchema,
      default: () => ({}),
    },
    recommendedRequirements: {
      type: requirementSetSchema,
      default: () => ({}),
    },
    sources: {
      type: [gameSourceSchema],
      default: [],
    },
    requirementsVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Common filters and lookup patterns.
gameSchema.index({ catalogStatus: 1, title: 1 });
gameSchema.index({ catalogStatus: 1, releaseYear: -1 });

const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

export default Game;