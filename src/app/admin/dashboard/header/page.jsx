"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

function SortableItem({ item, index, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className="flex items-center justify-between border p-3 mb-2 bg-white rounded shadow-sm"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center gap-3">
        {/* ✅ Drag Handle */}
        <div
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={16} />
        </div>

        <div>
          <p className="font-medium">{item.name}</p>
          <small className="text-gray-500">{item.href}</small>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
        //   console.log("Delete clicked for:", item.id);
          onDelete(item.id);
        }}
        className="text-red-500"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}

export default function HeaderMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", href: "" });
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed = localStorage.getItem("role") === "admin" || localPerms.includes("manage_footer_settings");
    setAllowed(allowed);
  }, []);

  if (!allowed) {
    return (
      <p className="text-red-500">You don’t have permission to view this page.</p>
    );
  }

  const addItem = () => {
    if (!newItem.name || !newItem.href) return;
    setMenu([...menu, { ...newItem, id: Date.now() }]);
    setNewItem({ name: "", href: "" });
    setOpen(false);
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, { menu });
      toast("Menu saved successfully");
    } catch (err) {
      toast("Error saving menu");
    //   console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = menu.findIndex((i) => i.id === active.id);
    const newIndex = menu.findIndex((i) => i.id === over.id);
    setMenu(arrayMove(menu, oldIndex, newIndex));
  };

  const deleteItem = (id) => {
    // console.log("Deleting:", id);
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Top Nav Menu (Drag to reorder)</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
          <Button onClick={saveMenu} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Menu
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={menu.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {menu.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                onDelete={deleteItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Label</Label>
              <Input
                className="mt-2 p-6 !border !border-gray-800"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Link (href)</Label>
              <Input
                className="mt-2 p-6 !border !border-gray-800"
                value={newItem.href}
                onChange={(e) =>
                  setNewItem({ ...newItem, href: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}