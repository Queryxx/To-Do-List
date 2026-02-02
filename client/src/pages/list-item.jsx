import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function listItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const { listId, listTitle } = location.state || {};
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [itemStatus, setItemStatus] = useState("pending");

  const fetchItems = async () => {
    try {
      const response = await axios.post(`${API_URL}/get-items`, { listId });
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
      alert(response.data?.message || "Item added successfully");
      setDesc("");
      setItemStatus("pending");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditDesc(item.description);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
      alert(response.data?.message || "Item updated successfully");
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditDesc("");
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.post(`${API_URL}/delete-items`, { id });
        alert(response.data?.message || "Item deleted successfully");
        fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item");
      }
    }
  };

  useEffect(() => {
    if (listId) {
      fetchItems();
    }
  }, [listId]);

  if (!listId) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No list selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center mt-8">
        <div className="flex justify-between items-center w-full max-w-2xl mb-6 px-4">
          <h1 className="text-4xl text-gray-800">{listTitle} - Items</h1>
          <button
            onClick={() => navigate('/home')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
          >
            Back to Lists
          </button>
        </div>
        <div className="w-full max-w-5xl bg-white border border-gray-300 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-4">Add New Item</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <input
                type="text"
                placeholder="Item description"
                className="mt-1 p-2 border border-gray-300 w-full"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
              <input
                type="text"
                placeholder="Item status"
                className="mt-1 p-2 border border-gray-300 w-full"
                value={itemStatus}
                onChange={(e) => setItemStatus(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-4">Items</h2>
            {items.length === 0 ? (
              <p className="text-gray-500">No items found.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 p-4 flex justify-between items-center">
                    {editingItem === item.id ? (
                      <div className="flex-1 mr-4">
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="p-2 border border-gray-300 w-full"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800 flex-1"><strong>Description:</strong> {item.description}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500"><strong>Status:</strong> {item.status}</p>
                      {editingItem === item.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-500 text-white hover:bg-green-600 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-3 py-1 bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>  
    </div>
  );
}

export default listItem;
