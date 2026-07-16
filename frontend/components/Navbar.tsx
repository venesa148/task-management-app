"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const currentTime = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="navbar">
      <div>
        <div className="navbar__eyebrow">TaskFlow</div>
        <h1 className="navbar__title">Workspace</h1>
        <p className="navbar__subtitle">{currentTime}</p>
      </div>

      <button className="btn btn--secondary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
