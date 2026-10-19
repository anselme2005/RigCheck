import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

/**
 * Fallback page for URLs that don't match a registered route.
 */
export default function NotFoundPage() {
  return (
    <main className="simple-page">
      <div className="container simple-page-content">
        <span className="section-eyebrow">404 / PAGE NOT FOUND</span>

        <div className="not-found-icon">
          <Search size={28} />
        </div>

        <h1>This page isn't in the system.</h1>

        <p>
          The address may be incorrect, or the page may not be available yet.
          Let's get you back to game discovery.
        </p>

        <Link to="/" className="button button-primary">
          <ArrowLeft size={17} /> Back to RigCheck
        </Link>
      </div>
    </main>
  );
}