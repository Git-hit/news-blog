"use client";

import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_BASE = "http://localhost:8000";

export default function NotificationsManager() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ title: "", link: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
  }, [])

  const getCSRF = async () => {
    await axios.get(`${API_BASE}/sanctum/csrf-cookie`);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await getCSRF();
      const res = await axios.get(`${API_BASE}/api/notifications`);
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await getCSRF();
      if (editing) {
        await axios.put(`${API_BASE}/api/notifications/${editing}`, newNotification);
      } else {
        await axios.post(`${API_BASE}/api/notifications`, newNotification);
      }
      setNewNotification({ title: "", link: "" });
      setEditing(null);
      fetchNotifications();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notification) => {
    setNewNotification({ title: notification.title, link: notification.link || "" });
    setEditing(notification.id);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await getCSRF();
      await axios.delete(`${API_BASE}/api/notifications/${id}`);
      fetchNotifications();
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Notifications</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Notification Title"
          value={newNotification.title}
          onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Optional Link"
          value={newNotification.link}
          onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={submitting}
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {editing ? "Update Notification" : "Add Notification"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setNewNotification({ title: "", link: "" });
            }}
            className="ml-4 text-red-500 cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{notif.title}</p>
                {notif.link && <p className="text-sm text-blue-600">{notif.link}</p>}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(notif)}
                  className="text-yellow-500 hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-red-500 hover:underline flex items-center gap-1"
                  disabled={deletingId === notif.id}
                >
                  {deletingId === notif.id && (
                    <div className="w-3 h-3 cursor-pointer border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}