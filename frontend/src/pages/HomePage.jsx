import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Cpu,
  Gamepad2,
  Gauge,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { games } from "../data/games.js";

/**
 * Display the initial discovery artwork.
 *
 * These simple CSS-based covers avoid relying on third-party image URLs.
 * We can add licensed or otherwise appropriately sourced game artwork later.
 */
function GameArtwork({ game, compact = false }) {
  return (
    <div
      className={`game-artwork artwork-${game.artworkTone} ${
        compact ? "game-artwork-compact" : ""
      }`}
      aria-label={`${game.title} artwork placeholder`}
      role="img"
    >
      <span className="artwork-topline">RIGCHECK / GAME INDEX</span>
      <span className="artwork-initials" aria-hidden="true">
        {game.initials}
      </span>
      <span className="artwork-bottomline">{game.genre.toUpperCase()}</span>
    </div>
  );
}

/**
 * A reusable game card links directly to the corresponding detail route.
 */
function GameCard({ game }) {
  return (
    <article className="game-card">
      <Link
        to={`/games/${game.slug}`}
        className="game-card-art-link"
        aria-label={`View ${game.title}`}
      >
        <GameArtwork game={game} />
        <span className="game-card-arrow" aria-hidden="true">
          <ArrowRight size={17} />
        </span>
      </Link>

      <div className="game-card-content">
        <div className="game-card-meta">
          <span>{game.genre}</span>
          <span>{game.year}</span>
        </div>

        <h3>
          <Link to={`/games/${game.slug}`}>{game.title}</Link>
        </h3>

        <p>View game details and compatibility information.</p>

        <Link className="text-link" to={`/games/${game.slug}`}>
          View game <ChevronRight size={15} />
        </Link>
      </div>
    </article>
  );
}

const genres = [
  "All games",
  "Action RPG",
  "Action-adventure",
  "Racing",
  "Sandbox",
  "Tactical shooter",
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All games");

  // Search by title or genre and apply the selected genre filter.
  // useMemo avoids recalculating the list on unrelated state changes.
  const filteredGames = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return games.filter((game) => {
      const matchesSearch =
        !normalizedQuery ||
        game.title.toLowerCase().includes(normalizedQuery) ||
        game.genre.toLowerCase().includes(normalizedQuery);

      const matchesGenre =
        selectedGenre === "All games" || game.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  return (
    <>
      <main>
        {/* Hero */}
        <section className="hero-section">
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                PC GAMING COMPATIBILITY
              </div>

              <h1>
                Your PC.
                <br />
                <span>Your games.</span>
                <br />
                Know before you play.
              </h1>

              <p className="hero-description">
                Find out whether your hardware meets a game's system
                requirements, understand what might hold you back, and explore
                upgrade options when you need them.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#game-search">
                  Check a game
                  <ArrowRight size={17} />
                </a>

                <a className="button button-secondary" href="#how-it-works">
                  How it works
                  <ArrowDown size={16} />
                </a>
              </div>

              <div className="hero-trust-row">
                <span>
                  <ShieldCheck size={16} />
                  Requirements-led
                </span>
                <span>
                  <CheckCircle2 size={16} />
                  No account required
                </span>
              </div>
            </div>

            {/* Detect My PC section — replaces How Compatibility Works */}
            <section className="detect-section" id="detect-pc">
              <div className="detect-content">
                <span className="section-eyebrow">YOUR PC</span>

                <h2>Let's see what your PC can do.</h2>

                
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    window.dispatchEvent(new Event("rigcheck:detect-pc"));
                  }}
                >
                  <span aria-hidden="true">⌕</span>
                  Detect My PC
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="detect-preview">
                <div className="detect-preview-header">
                  <div className="detect-preview-icon" aria-hidden="true">
                    ▦
                  </div>

                  <div>
                    <strong>Your hardware profile</strong>
                    <span>System overview</span>
                  </div>

                  <span className="preview-badge">PC SCAN</span>
                </div>

                <div className="detect-spec-row">
                  <span>Screen resolution</span>
                  <strong>To be identified</strong>
                </div>

                <div className="detect-spec-row">
                  <span>Processor</span>
                  <strong>To be identified</strong>
                </div>

                <div className="detect-spec-row">
                  <span>Graphics card</span>
                  <strong>To be identified</strong>
                </div>

                <div className="detect-spec-row">
                  <span>Installed RAM</span>
                  <strong>To be confirmed</strong>
                </div>

                <div className="detect-preview-footer">
                  <span className="detect-preview-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>
                    Review your specifications before checking game
                    compatibility.
                  </span>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Search and filtering operate on the initial local discovery data. */}
        <section
          className="discovery-section section-spacing"
          id="game-discovery"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">GAME DISCOVERY</span>
                <h2>Find your next game check.</h2>
                <p>
                  Search for a game to explore its details and compatibility
                  information.
                </p>
              </div>

              <span className="catalog-count">
                {filteredGames.length}{" "}
                {filteredGames.length === 1 ? "game" : "games"}
              </span>
            </div>

            <div className="search-panel" id="game-search">
              <label className="search-input-wrap">
                <Search size={20} aria-hidden="true" />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by game title or genre..."
                  aria-label="Search games by title or genre"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </label>

              <div className="genre-filter" aria-label="Filter games by genre">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    className={`filter-chip ${
                      selectedGenre === genre ? "filter-chip-active" : ""
                    }`}
                    aria-pressed={selectedGenre === genre}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="game-grid" aria-live="polite">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {filteredGames.length === 0 && (
              <div className="empty-search">
                <span className="empty-search-icon">
                  <Search size={23} />
                </span>
                <h3>No matching games found</h3>
                <p>
                  Try another title or select a different genre to continue
                  exploring.
                </p>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("All games");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            <p className="catalog-disclaimer">
              This is an initial discovery preview. Verified system requirements
              and compatibility verdicts will be introduced with the curated
              game catalog.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="how-section section-spacing" id="how-it-works">
          <div className="container">
            <div className="section-heading section-heading-centered">
              <span className="section-eyebrow">HOW RIGCHECK WORKS</span>
              <h2>Make the next upgrade an informed one.</h2>
              <p>
                Three clear steps, grounded in published requirements and your
                actual hardware.
              </p>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>
                <span className="step-icon">
                  <Gamepad2 size={23} />
                </span>
                <h3>Choose your game</h3>
                <p>
                  Find the game you want to play and review its published
                  minimum and recommended requirements.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">02</span>
                <span className="step-icon">
                  <Cpu size={23} />
                </span>
                <h3>Compare your PC</h3>
                <p>
                  Enter or select your processor, graphics card and memory to
                  see how they compare with the requirements.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">03</span>
                <span className="step-icon">
                  <CheckCircle2 size={23} />
                </span>
                <h3>Understand your options</h3>
                <p>
                  Review any limitations, consider settings changes, and explore
                  suitable upgrades only when they make sense.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* PC Builder introduction; the full build flow belongs to Phase 4. */}
        <section className="builder-section section-spacing" id="pc-builder">
          <div className="container">
            <div className="builder-panel">
              <div className="builder-copy">
                <span className="section-eyebrow">RIGCHECK PC BUILDER</span>
                <h2>Building a PC for a game?</h2>
                <p>
                  Start with the games you want to play, your target resolution
                  and your budget. RigCheck will help you work toward a balanced
                  component list as the builder becomes available.
                </p>

                <span className="coming-soon-label">
                  <span />
                  PC Builder in development
                </span>
              </div>

              <div className="builder-illustration" aria-hidden="true">
                <div className="builder-chip">
                  <Cpu size={54} strokeWidth={1.2} />
                  <span>RIG / 01</span>
                </div>
                <div className="builder-line builder-line-one" />
                <div className="builder-line builder-line-two" />
                <div className="builder-line builder-line-three" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <Cpu size={21} strokeWidth={1.8} />
              <span className="brand-check">✓</span>
            </span>
            <span className="brand-word">
              Rig<span>Check</span>
            </span>
          </Link>

          <p>
            Clear answers for your next gaming decision. No guesswork presented
            as certainty.
          </p>

          <span className="footer-copyright">
            © {new Date().getFullYear()} RigCheck
          </span>
        </div>
      </footer>
    </>
  );
}
