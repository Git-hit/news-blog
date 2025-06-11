"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PERMISSION_LABELS = {
  create_edit_post: "Create/Edit post",
  view_posts_only: "View posts only",
  create_edit_page: "Create/Edit page",
  view_pages_only: "View pages only",
  manage_header_settings: "Manage header settings",
  manage_footer_settings: "Manage footer settings",
  manage_notifications: "Manage notifications",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [],
  });
  const [allowed, setAllowed] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [updatingPermissionId, setUpdatingPermissionId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    const fetchData = async () => {
      try {
        const [userRes, permRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/permissions`),
        ]);

        setUsers(userRes.data.users);
        setPermissions(permRes.data.permissions);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data", err);
        setLoading(false);
      }
    };

    // const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    // const allowed = localPerms.includes("manage_notifications");
    const allowed = localStorage.getItem("role") === "admin";
    setAllowed(allowed);

    if (allowed) fetchData();
  }, []);

  if (!allowed) {
    return (
      <p className="text-red-500 text-center mt-10">
        🚫 You don’t have permission to view this page.
      </p>
    );
  }

  const handleTogglePermission = async (userId, permission) => {
    setUpdatingPermissionId(userId);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/permissions`, {
        permission,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                permissions: user.permissions.includes(permission)
                  ? user.permissions.filter((p) => p !== permission)
                  : [...user.permissions, permission],
              }
            : user
        )
      );
    } catch (err) {
      console.error("Error updating permission", err);
    } finally {
      setUpdatingPermissionId(null);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSavingUser(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, formData);
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", permissions: [] });
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
      setUsers(userRes.data.users);
      toast("User successfully added");
    } catch (err) {
      toast("Error adding user");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      toast("User successfully deleted");
    } catch (err) {
      toast("Error deleting user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const togglePermissionInForm = (perm) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="animate-spin mr-2" />
        Loading users...
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">User Role Management</h1>
        <Button onClick={() => setShowForm(true)}>+ Add User</Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddUser}
          className="mb-6 p-6 border rounded bg-muted"
        >
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="mb-6">
            <Label className="font-medium mb-2 block">
              Assign Permissions:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`perm-${key}`}
                    checked={formData.permissions.includes(key)}
                    onCheckedChange={() => togglePermissionInForm(key)}
                  />
                  <Label htmlFor={`perm-${key}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={savingUser}>
              {savingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
              <TableHead key={key} className="text-center">
                {label}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((user) => user.email !== "admin@admin.com")
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                {Object.keys(PERMISSION_LABELS).map((perm) => (
                  <TableCell key={perm} className="text-center">
                    <Checkbox
                      checked={user.permissions.includes(perm)}
                      disabled={updatingPermissionId === user.id}
                      onCheckedChange={() =>
                        handleTogglePermission(user.id, perm)
                      }
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Dialog
                    open={deleteDialogOpen && userToDelete?.id === user.id}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete user{" "}
                          <b>{user.name}</b>?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteUser}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}