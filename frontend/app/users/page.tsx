"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <AppShell>
      <div className="page-grid">
        <section className="hero">
          <div className="hero__copy">
            <span className="hero__badge">Users</span>
            <h2 className="hero__title">Daftar user.</h2>
            <p className="hero__text">
              User ini dipakai sebagai assignee task.
            </p>
          </div>

          <div className="panel" style={{ minWidth: 220 }}>
            <div className="stat-card__label">Registered users</div>
            <div className="stat-card__value">
              {loading ? "..." : users.length}
            </div>
          </div>
        </section>

        <section className="table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="page-title">Users</h2>
              <p className="page-meta">Data user dari API.</p>
            </div>

            <button className="btn btn--secondary" onClick={fetchUsers}>
              Refresh
            </button>
          </div>

          <div className="table-wrap">
            <table className="table" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Username</th>
                </tr>
              </thead>

              <tbody>
                {!loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="empty-state">
                        <div className="empty-state__icon">!</div>
                        <p>Belum ada user di database.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>
                        <span className="badge">{user.username}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
