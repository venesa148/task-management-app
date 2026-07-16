"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
}

interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  deadline: string;

  assignee: {
    id: number;
    name: string;
  };
}

interface Props {
  onSuccess: () => void;
  onCancel?: () => void;
  task?: Task | null;
}

export default function TaskForm({ onSuccess, onCancel, task }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState(task?.status ?? "Todo");
  const [deadline, setDeadline] = useState(task?.deadline ?? "");
  const [assignee, setAssignee] = useState(
    task ? String(task.assignee.id) : "",
  );

  async function fetchUsers() {
    try {
      setLoadingUsers(true);
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat daftar user");
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    // Load assignee options when the form mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !deadline || !assignee) {
      alert("Lengkapi judul, deskripsi, deadline, dan assignee.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      deadline,
      assignee_id: Number(assignee),
    };

    try {
      setSaving(true);

      if (task) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      onSuccess();

      setTitle("");
      setDescription("");
      setStatus("Todo");
      setDeadline("");
      setAssignee("");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-grid">
      <div className="card-header">
        <div>
          <h3 className="page-title" style={{ marginBottom: 4 }}>
            {task ? "Edit Task" : "Add Task"}
          </h3>
          <p className="page-meta">Isi data task.</p>
        </div>
        <span className="badge">{task ? "Edit mode" : "New task"}</span>
      </div>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Title</span>
          <input
            className="input"
            placeholder="Judul task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <label className="field form-grid--full">
          <span className="field__label">Description</span>
          <textarea
            className="textarea"
            placeholder="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Deadline</span>
          <input
            className="input"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Assignee</span>
          <select
            className="select"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">{loadingUsers ? "Memuat..." : "Assignee"}</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button
          className="btn btn--secondary"
          type="button"
          onClick={() => onCancel?.()}
        >
          Cancel
        </button>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={saving || loadingUsers}
        >
          {saving ? "Saving..." : task ? "Update Task" : "Save Task"}
        </button>
      </div>
    </form>
  );
}
