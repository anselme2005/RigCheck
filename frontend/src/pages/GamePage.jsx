import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gamepad2,
  ShieldCheck,
} from "lucide-react";

import { getGameBySlug } from "../data/games.js";

/**
 * Game detail page for the initial discovery experience.
 *
 * Compatibility results are intentionally absent until the backend has
 * verified requirement records and the hardware comparison engine is ready.
 */
export default function GamePage() {
  const { slug } = useParams();
  const game = getGameBySlug(slug);

  // A missing slug should render a clear not-found state, not a broken page.
  if (!game) {
    return (
      <main className="simple-page">
        <div className="container simple-page-content">
          <span className="section-eyebrow">GAME NOT FOUND</span>
          <h1>We couldn't find that game.</h1>
          <p>
            The game may not be in the current discovery preview. Return to the
            catalog to explore the available titles.
          </p>
          <Link to="/" className="button button-primary">
            <ArrowLeft size={17} /> Back to games
          </Link>
        </div>
      </main>
    );
  }

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
                <span className="artwork-topline">RIGCHECK / GAME INDEX</span>
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
                <h2>Compatibility data is coming next</h2>
                <p>
                  This title is part of the initial discovery preview. RigCheck
                  has not yet attached a verified requirements record to this
                  page, so we won't label your PC compatible or incompatible
                  based on missing data.
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

            <Link to="/#game-discovery" className="button button-secondary">
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
                <strong>Discovery preview</strong>
                <span>Requirements not yet verified</span>
              </div>
            </div>

            <div className="sidebar-note">
              <CheckCircle2 size={16} />
              <p>
                RigCheck will distinguish missing data from a failed hardware
                requirement.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}