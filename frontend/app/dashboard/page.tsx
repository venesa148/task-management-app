"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import api from "@/services/api";

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: string;
  assignee?: {
    id: number;
    name: string;
  };
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Load dashboard data on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks();
  }, []);

  const totalTask = tasks.length;
  const todo = tasks.filter((t) => t.status === "Todo").length;
  const progress = tasks.filter((t) => t.status === "In Progress").length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const completionRate = totalTask ? Math.round((done / totalTask) * 100) : 0;
  const upcoming = [...tasks]
    .filter((task) => task.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  return (
    <AppShell>
      <div className="page-grid">
        <section className="hero">
          <div className="hero__copy">
            <span className="hero__badge">Overview</span>
            <h2 className="hero__title">Ringkasan task hari ini.</h2>
            <p className="hero__text">
              Lihat progres, status, dan deadline task.
            </p>
          </div>

          <div className="panel" style={{ minWidth: 260 }}>
            <div className="stat-card__label">Completion rate</div>
            <div className="stat-card__value">{completionRate}%</div>
            <div className="progress">
              <div
                className="progress__bar"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </section>

        <section className="stat-grid">
          <article className="stat-card">
            <div className="stat-card__label">Total Task</div>
            <div className="stat-card__value">
              {loading ? "..." : totalTask}
            </div>
            <div className="stat-card__meta">
              Semua task yang tersimpan di database.
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-card__label">Todo</div>
            <div className="stat-card__value">{loading ? "..." : todo}</div>
            <div className="stat-card__meta">
              Task yang masih menunggu dikerjakan.
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-card__label">In Progress</div>
            <div className="stat-card__value">{loading ? "..." : progress}</div>
            <div className="stat-card__meta">
              Task yang sedang aktif dikerjakan.
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-card__label">Done</div>
            <div className="stat-card__value">{loading ? "..." : done}</div>
            <div className="stat-card__meta">Task yang sudah selesai.</div>
          </article>
        </section>

        <section className="panel">
          <div className="section-header">
            <span className="badge">Deadlineterdekat</span>
          </div>

          <div className="mini-stack">
            {upcoming.length > 0 ? (
              upcoming.map((task) => (
                <div
                  key={task.id}
                  className="helper-box"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                >
                  <div className="card-header">
                    <strong>{task.title}</strong>
                    <span
                      className={`status-pill ${task.status === "Done" ? "status-pill--done" : task.status === "In Progress" ? "status-pill--progress" : "status-pill--todo"}`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="page-meta" style={{ marginTop: 8 }}>
                    Deadline {task.deadline} • Assignee:{" "}
                    {task.assignee?.name ?? "-"}
                  </p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">✓</div>
                <p>Belum ada task yang bisa dirangkum.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
