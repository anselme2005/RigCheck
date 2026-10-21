import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";

import { api } from "../lib/api.js";

/**
 * Keep the existing CSS-based artwork while using real API game records.
 * These presentation values are not game requirements or verified data.
 */
const artworkBySlug = {
  "cyberpunk-2077": { initials: "2077", artworkTone: "amber" },
  "elden-ring": { initials: "ER", artworkTone: "olive" },
  "grand-theft-auto-v": { initials: "V", artworkTone: "green" },
  "red-dead-redemption-2": { initials: "RDR2", artworkTone: "rust" },
  "forza-horizon-5": { initials: "FH5", artworkTone: "blue" },
  minecraft: { initials: "MC", artworkTone: "forest" },
  valorant: { initials: "V", artworkTone: "red" },
  "the-witcher-3-wild-hunt": { initials: "W3", artworkTone: "slate" },
};

function adaptGame(game) {
  return {
    ...game,
    year: game.releaseYear ?? "Year unavailable",
    genre: game.genre || "Unclassified",
    platform: game.platform || "PC",
    description: game.description || "No description is available yet.",
    ...(artworkBySlug[game.slug] || {
      initials: game.title.slice(0, 3).toUpperCase(),
      artworkTone: "slate",
    }),
  };
}

export default function GamePage() {
  const { slug } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGame() {
      setLoading(true);
      setError("");
      setGame(null);

      try {
        const result = await api.getGame(slug);

        if (!cancelled) {
          setGame(adaptGame(result.data));
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.status === 404
              ? "GAME_NOT_FOUND"
              : requestError.message ||
                  "We couldn't load this game's information.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGame();

    return () => {
      // Prevent a previous game's response from updating a newer route.
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="simple-page">
        <div className="container simple-page-content">
          <span className="section-eyebrow">GAME CATALOG</span>
          <h1>Loading game details...</h1>
          <p>Retrieving the latest catalog information from RigCheck.</p>
        </div>
      </main>
    );
  }

  if (error === "GAME_NOT_FOUND") {
    return (
      <main className="simple-page">
        <div className="container simple-page-content">
          <span className="section-eyebrow">GAME NOT FOUND</span>
          <h1>We couldn't find that game.</h1>
          <p>
            This game isn't currently available in the published RigCheck
            catalog. Return to the catalog to explore the available titles.
          </p>
          <Link to="/#game-discovery" className="button button-primary">
            <ArrowLeft size={17} /> Back to games
          </Link>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="simple-page">
        <div className="container simple-page-content">
          <span className="section-eyebrow">UNABLE TO LOAD GAME</span>
          <h1>We couldn't load this game's information.</h1>
          <p>{error || "An unexpected error occurred."}</p>
          <p>
            Check that the RigCheck backend is running and try opening this
            page again.
          </p>
          <Link to="/#game-discovery" className="button button-primary">
            <ArrowLeft size={17} /> Back to games
          </Link>
        </div>
      </main>
    );
  }

  // Requirements must not be presented as verified unless the API explicitly
  // reports that the requirements have been reviewed and verified.
  const requirementsVerified = game.dataStatus === "verified";

  return (
    <main className="game-detail-page">
      <div className="container">
        <Link to="/#game-discovery" className="back-link">
          <ArrowLeft size={16} /> Back to game discovery
        </Link>

        <div className="game-detail-layout">
          <div className="game-detail-main">
            <div className="game-detail-art">
              <div
                className={`game-artwork artwork-${game.artworkTone}`}
                role="img"
                aria-label={`${game.title} artwork placeholder`}
              >
                <span className="artwork-topline">
                  RIGCHECK / GAME INDEX
                </span>
                <span className="artwork-initials" aria-hidden="true">
                  {game.initials}
                </span>
                <span className="artwork-bottomline">
                  {game.genre.toUpperCase()}
                </span>
              </div>
            </div>

            <span className="section-eyebrow">GAME OVERVIEW</span>
            <h1>{game.title}</h1>

            <div className="game-detail-tags">
              <span>{game.genre}</span>
              <span>{game.platform}</span>
              <span>{game.year}</span>
            </div>

            <p className="game-detail-description">{game.description}</p>

            <section className="requirements-placeholder">
              <div className="requirements-placeholder-icon">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h2>
                  {requirementsVerified
                    ? "Verified requirements are available"
                    : "Compatibility data is coming next"}
                </h2>
                <p>
                  {requirementsVerified
                    ? "This game's requirements have been marked as verified. Hardware compatibility checking will become available as the comparison feature is implemented."
                    : "RigCheck has not yet attached a verified requirements record to this page. We won't label your PC compatible or incompatible based on missing or unverified data."}
                </p>
                <p>
                  Data status:{" "}
                  <strong>
                    {game.dataStatus === "verified"
                      ? "Verified"
                      : game.dataStatus === "needs-review"
                        ? "Awaiting review"
                        : "Preview — not verified"}
                  </strong>
                </p>
              </div>
            </section>

            <div className="detail-next-step">
              <div className="detail-next-step-icon">
                <Cpu size={20} />
              </div>
              <div>
                <h3>What will be compared?</h3>
                <p>
                  Your processor, graphics card and memory against the game's
                  published minimum and recommended requirements. Supported
                  resolution and other details will be included where reliable
                  data is available.
                </p>
              </div>
            </div>

            <Link
              to="/#game-discovery"
              className="button button-secondary"
            >
              Explore other games <ArrowRight size={16} />
            </Link>
          </div>

          <aside className="game-detail-sidebar">
            <span className="section-eyebrow">AT A GLANCE</span>
            <h2>Game details</h2>

            <div className="detail-info-row">
              <span>Title</span>
              <strong>{game.title}</strong>
            </div>

            <div className="detail-info-row">
              <span>Genre</span>
              <strong>{game.genre}</strong>
            </div>

            <div className="detail-info-row">
              <span>Platform</span>
              <strong>{game.platform}</strong>
            </div>

            <div className="detail-info-row">
              <span>Release year</span>
              <strong>{game.year}</strong>
            </div>

            <div className="sidebar-status">
              <Gamepad2 size={18} />
              <div>
                <strong>
                  {requirementsVerified
                    ? "Requirements verified"
                    : "Discovery preview"}
                </strong>
                <span>
                  {requirementsVerified
                    ? "Compatibility checker in development"
                    : "Requirements not yet verified"}
                </span>
              </div>
            </div>

            <div className="sidebar-note">
              <CheckCircle2 size={16} />
              <p>
                RigCheck distinguishes missing or unverified data from a
                failed hardware requirement.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
