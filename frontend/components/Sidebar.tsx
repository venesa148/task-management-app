"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">TF</div>
        <div className="sidebar__title">
          <strong>TaskFlow</strong>
          <span>Task management</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <Link
          href="/dashboard"
          className={`sidebar__link ${pathname === "/dashboard" ? "sidebar__link--active" : ""}`}
        >
          Dashboard
        </Link>

        <Link
          href="/tasks"
          className={`sidebar__link ${pathname === "/tasks" ? "sidebar__link--active" : ""}`}
        >
          Tasks
        </Link>

        <Link
          href="/users"
          className={`sidebar__link ${pathname === "/users" ? "sidebar__link--active" : ""}`}
        >
          Users
        </Link>

        <Link
          href="/chatbot"
          className={`sidebar__link ${pathname === "/chatbot" ? "sidebar__link--active" : ""}`}
        >
          Chatbot
        </Link>
      </nav>
    </div>
  );
}
