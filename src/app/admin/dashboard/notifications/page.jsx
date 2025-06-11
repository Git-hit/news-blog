"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

axios.defaults.withCredentials = true;
// const process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotificationsManager() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ title: "", link: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    document.title = "Notifications Settings";
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed = localStorage.getItem("role") === "admin" || localPerms.includes("manage_notifications");
    setAllowed(allowed);
  }, []);

  if (!allowed) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto mt-10">
        <AlertCircleIcon />
        <AlertTitle>Not allowed</AlertTitle>
        <AlertDescription>You don’t have permission to view this page.</AlertDescription>
      </Alert>
    );
  }

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`);
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${editing}`, newNotification);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, newNotification);
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`);
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
      <h1 className="text-2xl font-bold mb-6">Manage Notifications</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="space-y-4">
          <Label htmlFor="title">Notification Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Notification Title"
            value={newNotification.title}
            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-4">
          <Label htmlFor="link">Optional Link</Label>
          <Input
            id="link"
            type="text"
            placeholder="Optional Link"
            value={newNotification.link}
            onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={submitting} className="flex items-center gap-2">
            {submitting && (
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {editing ? "Update Notification" : "Add Notification"}
          </Button>

          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setNewNotification({ title: "", link: "" });
              }}
              className="text-red-500"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="w-8 h-8 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
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
                {notif.link && (
                  <a
                    href={notif.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    {notif.link}
                  </a>
                )}
              </div>
              <div className="space-x-3 flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-600 hover:underline"
                  onClick={() => handleEdit(notif)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 flex items-center gap-1"
                  onClick={() => handleDelete(notif.id)}
                  disabled={deletingId === notif.id}
                >
                  {deletingId === notif.id && (
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}