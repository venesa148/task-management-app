"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import TaskForm from "@/components/TaskForm";
import api from "@/services/api";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline: string;

  assignee: {
    id: number;
    name: string;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Gagal mengambil data task", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load task data on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTasks();
  }, []);

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalTask = tasks.length;
  const todo = tasks.filter((task) => task.status === "Todo").length;
  const progress = tasks.filter((task) => task.status === "In Progress").length;
  const done = tasks.filter((task) => task.status === "Done").length;

  const deleteTask = async (id: number) => {
    const confirmDelete = confirm("Yakin ingin menghapus task?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      setSelectedTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus task");
    }
  };

  return (
    <AppShell>
      <div className="page-grid">
        <section className="hero">
          <div className="hero__copy">
            <span className="hero__badge">Task board</span>
            <h2 className="hero__title">Kelola task dengan cepat.</h2>
            <p className="hero__text">
              Tambah, ubah status, pilih assignee, dan hapus task.
            </p>
          </div>

          <div className="hero__actions">
            <button
              className="btn btn--secondary"
              onClick={() => {
                setSelectedTask(null);
                setShowForm((current) => !current);
              }}
            >
              {showForm ? "Hide form" : "New task"}
            </button>

            <button className="btn btn--primary" onClick={fetchTasks}>
              Refresh
            </button>
          </div>
        </section>

        <section className="stat-grid">
          <article className="stat-card">
            <div className="stat-card__label">Total task</div>
            <div className="stat-card__value">
              {loading ? "..." : totalTask}
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-card__label">Todo</div>
            <div className="stat-card__value">{loading ? "..." : todo}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card__label">In progress</div>
            <div className="stat-card__value">{loading ? "..." : progress}</div>
          </article>
          <article className="stat-card">
            <div className="stat-card__label">Done</div>
            <div className="stat-card__value">{loading ? "..." : done}</div>
          </article>
        </section>

        {showForm && (
          <section className="task-form-card">
            <TaskForm
              key={selectedTask ? `task-${selectedTask.id}` : "task-new"}
              task={selectedTask}
              onSuccess={() => {
                fetchTasks();
                setSelectedTask(null);
                setShowForm(false);
              }}
              onCancel={() => {
                setSelectedTask(null);
                setShowForm(false);
              }}
            />
          </section>
        )}

        <section className="table-card">
          <div className="table-toolbar">
            <div>
              <h2 className="page-title">Task list</h2>
              <p className="page-meta">Daftar task aktif.</p>
            </div>

            <div className="filters" style={{ marginBottom: 0 }}>
              <input
                className="input"
                placeholder="Cari task, deskripsi, atau assignee"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All status</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Assignee</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {!loading && filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-state__icon">◎</div>
                        <p>Belum ada task yang cocok dengan filter saat ini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className="mini-stack">
                          <strong>{task.title}</strong>
                          <span className="subtle">{task.description}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className="select"
                          value={task.status}
                          disabled={updatingId === task.id}
                          onChange={async (e) => {
                            try {
                              setUpdatingId(task.id);
                              await api.patch(`/tasks/${task.id}/status`, {
                                status: e.target.value,
                              });
                              fetchTasks();
                            } catch (error) {
                              console.error(error);
                              alert("Gagal memperbarui status task");
                            } finally {
                              setUpdatingId(null);
                            }
                          }}
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td>{formatDeadline(task.deadline)}</td>
                      <td>
                        <span className="badge">
                          {task.assignee?.name ?? "-"}
                        </span>
                      </td>
                      <td>
                        <div
                          className="auth-actions"
                          style={{ justifyContent: "flex-start" }}
                        >
                          <button
                            className="btn btn--secondary"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowForm(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn--danger"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </div>
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
