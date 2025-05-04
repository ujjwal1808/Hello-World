import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const CreateCommunityModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/community", { name, description });
      const communityId = res.data.community._id;
      onClose();
      navigate(`/community/${communityId}`);
    } catch (err) {
      console.error("Failed to create community", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Community</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Community Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
