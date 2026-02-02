import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
      console.log(response.data);
      alert(response.data?.message || "Logged out Successfully");
      navigate("/");
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (editingItem) {
        response = await axios.post(`${API_URL}/edit-list`, {
          id: editingItem.id,
          title,
          status,
        });
        alert(response.data?.message || "List Updated successfully");
      } else {
        response = await axios.post(`${API_URL}/add-list`, {
          title,
          status,
        });
        alert(response.data?.message || "List Added successfully");
      }
      console.log(response.data);
      fetchList();
      setTitle("");
      setStatus("");
      setEditingItem(null);
      setShowDialog(false);
      navigate("/home");
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const response = await axios.post(`${API_URL}/delete-list`, { id });
        console.log(response.data);
        alert(response.data?.message || "List Deleted successfully");
        fetchList();
      } catch (error) {
        console.error(
          "There was an error!",
          error.response?.data || error.message,
        );
        alert(
          error.response?.data?.message || error.message || "An error occurred",
        );
      }
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setStatus(item.status);
    setEditingItem(item);
    setShowDialog(true);
  };

  const handleOpen = (item) => {
    navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
  };
/*   const handleEditlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/edit-list`, {
        title,
        stats,
      });
      setLists(response.data);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  }; */

  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-list`);
      console.log(response.data);
      setLists(response.data.list);
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center mt-8">
        <div className="flex justify-between items-center w-full max-w-2xl mb-6 px-4">
          <h1 className="text-4xl text-gray-800">To-Do List</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 "
          >
            <strong>Logout</strong>
          </button>
        </div>
        <div className="w-full max-w-5xl bg-white  border border-gray-300 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">My Lists</h2>
            <button
              onClick={() => setShowDialog(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            >
              Add New List
            </button>
          </div>
          {lists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No Data Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white border border-gray-300 p-6 "
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Status: <span className="font-medium">{item.status}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleOpen(item)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm"
                    >
                      <strong>Open List</strong>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm"
                    >
                      <strong>Delete</strong>
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm"
                    >
                      <strong>Edit</strong>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8  max-w-md w-full">
            <h3 className="text-2xl text-center font-medium mb-4">
              {editingItem ? "Edit List" : "Add New List"}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Title:</label>
              <input
                type="text"
                placeholder="Title"
                className="mt-1 p-2 border border-gray-300 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
              <input
                type="text"
                placeholder="Status"
                className="mt-1 p-2 border border-gray-300 w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditingItem(null);
                  setTitle("");
                  setStatus("");
                }}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                {editingItem ? "Update List" : "Add List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default home;
