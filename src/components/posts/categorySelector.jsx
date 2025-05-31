import { useEffect, useState } from "react";
import axios from "axios";

export default function CategorySelector({
  selectedCategories = [],
  onChange,
  categories,
  setCategories,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);

  // 🔒 Fetch categories using token
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories", {
        withCredentials: true,
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  // 📌 Select or remove categories
  const handleSelect = (category) => {
    if (!selectedCategories.includes(category.id)) {
      onChange([...selectedCategories, category.id]);
    }
  };

  const removeCategory = (id) => {
    onChange(selectedCategories.filter((catId) => catId !== id));
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
  }, []);

  // ➕ Create category
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    setCreatingNewCategory(true);

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie"); // fetch XSRF cookie

      const res = await axios.post("http://localhost:8000/api/categories", {
        name: newCategory,
      });

      const created = res.data;
      setCategories([...categories, created]);
      onChange([...selectedCategories, created.id]);
      setNewCategory("");
      setCreatingNewCategory(false);
    } catch (err) {
      setCreatingNewCategory(false);
      console.error("Error creating category", err);
    }
  };

  return (
    <div className="mb-6">
      <label className="block font-medium mb-1">Categories</label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((catId) => {
          const cat = categories.find((c) => c.id === catId);
          return (
            <span
              key={catId}
              className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded-full flex items-center"
            >
              {cat?.name}
              <button
                onClick={() => removeCategory(catId)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dropdownOpen ? "Hide categories" : "Choose categories"}
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 bg-white border w-full mt-1 max-h-48 overflow-y-auto shadow-lg rounded text-sm">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category.id}
                  className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                    selectedCategories.includes(category.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleSelect(category)}
                >
                  {category.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No categories found</li>
            )}
          </ul>
        )}
      </div>

      {/* Create new category */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Create new category"
          className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          type="button"
          onClick={handleCreateCategory}
          className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {creatingNewCategory ? <div className="size-7 border-2 border-b-0 border-white rounded-full animate-spin"></div> : `Add`}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-1">
        You can select or create categories
      </p>
    </div>
  );
}