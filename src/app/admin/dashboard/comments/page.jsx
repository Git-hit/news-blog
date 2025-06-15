"use client";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Comments() {
    const [comments, setComments] = useState([]);
    const [filtered, setFiltered] = useState("all");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
        localStorage.getItem("role") === "admin" ||
        localPerms.includes("manage_comments");

    useEffect(() => {
        if (!allowed) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`)
            .then((res) => res.json())
            .then((data) => setComments(data))
            .catch((err) => console.error("Failed to load comments:", err));
    }, [allowed]);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
                }
            );

            if (!res.ok) throw new Error("Failed to update");

            toast.success(`Comment ${status}`);
            setComments((prev) =>
                prev.map((c) => (c._id === id ? { ...c, status } : c))
            );
        } catch (err) {
            toast.error("Update failed");
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!selectedComment) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${selectedComment._id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Comment deleted");
            setComments((prev) =>
                prev.filter((comment) => comment._id !== selectedComment._id)
            );
            setOpenDeleteModal(false);
            setSelectedComment(null);
        } catch (err) {
            toast.error("Failed to delete");
            console.error(err);
        }
    };

    const statusFiltered = (status) =>
        status === "all" ? comments : comments.filter((c) => c.status === status);

    if (!allowed)
        return (
            <div className="text-center py-10 text-gray-500 text-lg">
                You do not have permission to manage comments.
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Manage Comments</h1>

            <Tabs defaultValue="all" onValueChange={setFiltered} className="w-full">
                <TabsList>
                    <TabsTrigger className="cursor-pointer" value="all">All</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="approved">Approved</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="pending">Pending</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="rejected">Rejected</TabsTrigger>
                </TabsList>

                {["all", "approved", "pending", "rejected"].map((status) => (
                    <TabsContent value={status} key={status}>
                        {statusFiltered(status).length === 0 ? (
                            <p className="text-gray-500 mt-4">No comments to show.</p>
                        ) : (
                            <div className="space-y-4 mt-4">
                                {statusFiltered(status).map((c) => (
                                    <div
                                        key={c._id}
                                        className="border rounded-lg p-4 flex justify-between items-start gap-4"
                                    >
                                        <div>
                                            <p className="font-semibold">{c.name}</p>
                                            <p className="text-sm text-gray-500">{c.email}</p>
                                            <p className="mt-2">{c.comment}</p>

                                            {filtered === "all" && (
                                                <p className="text-sm font-medium text-blue-600 mt-1 capitalize">
                                                    Status: {c.status}
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-400 mt-1">
                                                Posted on: {new Date(c.created_at).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className="cursor-pointer" variant="outline" size="sm">
                                                        Metadata
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Post Info</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <span className="text-xs">Post Slug:</span>
                                                        <br />
                                                        <span className="text-xs text-gray-700">
                                                            {c.postSlug}
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <span className="text-xs">Status:</span>
                                                        <br />
                                                        <span className="text-xs text-gray-700">
                                                            {c.status}
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {(c.status === "pending" || c.status === "rejected") && (
                                                <div className="flex gap-2 flex-wrap">
                                                    {c.status !== "approved" && (
                                                        <Button
                                                            className="cursor-pointer"
                                                            size="sm"
                                                            onClick={() => updateStatus(c._id, "approved")}
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {c.status !== "pending" && (
                                                        <Button
                                                            className="cursor-pointer"
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => updateStatus(c._id, "pending")}
                                                        >
                                                            Mark Pending
                                                        </Button>
                                                    )}
                                                    {c.status !== "rejected" && (
                                                        <Button
                                                            className="cursor-pointer"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => updateStatus(c._id, "rejected")}
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="cursor-pointer text-red-600 border-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    setSelectedComment(c);
                                                    setOpenDeleteModal(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                            <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Comment?</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="text-sm text-gray-500">
                                                        Are you sure you want to permanently delete the comment by{" "}
                                                        <strong>{selectedComment?.name}</strong>?
                                                    </div>
                                                    <DialogFooter className="mt-4">
                                                        <Button className="cursor-pointer" variant="ghost" onClick={() => setOpenDeleteModal(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button className="cursor-pointer" variant="destructive" onClick={handleDelete}>
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}