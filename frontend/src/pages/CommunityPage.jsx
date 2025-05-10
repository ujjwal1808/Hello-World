import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import { Paperclip, UserPlus, X as CloseIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

const CommunityPage = () => {
  const { communityId } = useParams();
  const [communityData, setCommunityData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const queryClient = useQueryClient();

  // Fetch connections for member adding UI
  const { data: connectionsData } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });
  const connections = connectionsData?.data || [];

  // Mutation to add members
  const { mutate: addMembers, isLoading: isAddingMembers } = useMutation({
    mutationFn: async (memberIds) => {
      const res = await axiosInstance.post(`/community/${communityId}/add-members`, { memberIds });
      return res.data.members;
    },
    onSuccess: (updatedMembers) => {
      setCommunityData((prev) => ({ ...prev, members: updatedMembers }));
      toast.success("Members added!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add members");
    },
  });

  // Remove member mutation
  const { mutate: removeMember, isLoading: isRemovingMember } = useMutation({
    mutationFn: async (memberId) => {
      const res = await axiosInstance.delete(`/community/${communityId}/remove-member/${memberId}`);
      return res.data.members;
    },
    onSuccess: (updatedMembers) => {
      setCommunityData((prev) => ({ ...prev, members: updatedMembers }));
      toast.success("Member removed");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to remove member");
    },
  });

  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleAddMembers = () => {
    if (selectedMembers.length === 0) return toast.error("Select at least one user");
    addMembers(selectedMembers);
    setSelectedMembers([]);
    setShowAddMemberModal(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communityRes = await axiosInstance.get(`/community/${communityId}`);
        console.log("Fetched community:", communityRes.data);
        setCommunityData(communityRes.data.community || {}); // Fallback to empty object

        const messagesRes = await axiosInstance.get(`/community/${communityId}/messages`);
        setMessages(messagesRes.data.messages || []);
      } catch (err) {
        toast.error("Failed to load community or messages");
        console.error("Error in fetchData:", err);
      }
    };

    fetchData();
  }, [communityId]);

  useEffect(() => {
    const handleNewMessage = (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    };

    socket.emit("join-community", communityId);
    socket.on("new-community-message", handleNewMessage);

    return () => {
      socket.emit("leave-community", communityId);
      socket.off("new-community-message", handleNewMessage);
    };
  }, [communityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !mediaFile) return;

    try {
      setUploading(true);
      let messageData = { content: message };

      if (mediaFile) {
        const formData = new FormData();
        formData.append("media", mediaFile);

        const mediaRes = await axiosInstance.post(
          `/community/${communityId}/media`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        messageData.mediaUrl = mediaRes.data.url;
      }

      const res = await axiosInstance.post(
        `/community/${communityId}/messages`,
        messageData
      );

      const fullMessage = res.data.message;
      if (!fullMessage) throw new Error("Message data missing from response");

      setMessages((prev) => [...prev, fullMessage]);
      socket.emit("send-community-message", fullMessage);

      setMessage("");
      setMediaFile(null);
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleMediaChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const members = communityData?.members || [];

  // State for message deletion UI
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [deleteMode, setDeleteMode] = useState(null); // 'all' or 'selected'
  const [selectedMsgIds, setSelectedMsgIds] = useState([]);

  // Delete all messages mutation
  const { mutate: deleteAllMessages, isLoading: isDeletingAll } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/community/${communityId}/messages`);
    },
    onSuccess: () => {
      setMessages([]);
      toast.success("All messages deleted");
      setShowDeleteMenu(false);
      setDeleteMode(null);
    },
    onError: () => toast.error("Failed to delete all messages"),
  });

  // Delete selected messages mutation
  const { mutate: deleteSelectedMessages, isLoading: isDeletingSelected } = useMutation({
    mutationFn: async (ids) => {
      await axiosInstance.post(`/community/${communityId}/messages/delete-selected`, { messageIds: ids });
    },
    onSuccess: () => {
      setMessages((prev) => prev.filter(m => !selectedMsgIds.includes(m._id)));
      toast.success("Selected messages deleted");
      setSelectedMsgIds([]);
      setShowDeleteMenu(false);
      setDeleteMode(null);
    },
    onError: () => toast.error("Failed to delete selected messages"),
  });

  const handleMsgSelect = (msgId) => {
    setSelectedMsgIds((prev) => prev.includes(msgId)
      ? prev.filter(id => id !== msgId)
      : [...prev, msgId]
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div
        className="bg-primary text-white p-4 text-xl font-bold shadow-md cursor-pointer flex justify-between items-center relative"
        onClick={() => setShowMembers(!showMembers)}
      >
        <span>{communityData?.name || "Community Chat"}</span>
        <div className="flex gap-2 items-center">
          <span className="text-sm">{showMembers ? "Hide Members" : "View Members"}</span>
          {/* Move Delete Messages button into header, right-aligned */}
          <button
            onClick={e => { e.stopPropagation(); setShowDeleteMenu(m => !m); }}
            className="ml-2 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 text-xs"
          >
            Delete Messages
          </button>
        </div>
      </div>
      {/* Message Deletion Menu */}
      {showDeleteMenu && (
        <div className="absolute right-4 top-20 z-30">
          <div className="bg-white rounded shadow-lg mt-2 p-3 min-w-[180px] flex flex-col gap-2">
            <button
              className="bg-red-400 hover:bg-red-600 text-white rounded px-2 py-1"
              onClick={() => { setDeleteMode('all'); setShowDeleteMenu(false); }}
            >
              Delete All Messages
            </button>
            <button
              className="bg-red-200 hover:bg-red-400 text-red-800 rounded px-2 py-1"
              onClick={() => { setDeleteMode('selected'); setShowDeleteMenu(false); }}
            >
              Delete Selected Messages
            </button>
          </div>
        </div>
      )}
      {/* Members List */}
      {showMembers && (
        <div className="bg-base-200 p-3 border-b max-h-60 overflow-y-auto rounded-lg shadow">
          <div className="font-semibold mb-2 flex items-center justify-between">
            <span>Members:</span>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition"
            >
              <UserPlus size={16} /> Add Members
            </button>
          </div>
          <ul className="space-y-2">
            {Array.isArray(members) && members.map((member) => (
              <li key={member?._id || Math.random()} className="flex items-center gap-3 bg-white rounded-md p-2 shadow-sm hover:shadow-md transition">
                <img
                  src={member?.profilePicture || '/avatar.png'}
                  alt={member?.name || member?.username || 'User'}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{member?.name || member?.username || member?.fullName || "Unknown"}</div>
                  {member?.username && (
                    <div className="text-xs text-gray-500">@{member.username}</div>
                  )}
                </div>
                {member?._id !== communityData?.createdBy && (
                  <button
                    onClick={() => removeMember(member._id)}
                    disabled={isRemovingMember}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[260px] w-full max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddMemberModal(false)}
              title="Close"
            >
              <CloseIcon size={18} />
            </button>
            <h3 className="font-semibold mb-4 text-lg text-center">Add Members</h3>
            {connections.length === 0 ? (
              <div className="text-gray-500 text-sm">No connections available.</div>
            ) : (
              <>
                <select
                  multiple
                  value={selectedMembers}
                  onChange={e => setSelectedMembers(Array.from(e.target.selectedOptions, opt => opt.value))}
                  className="border rounded p-2 text-sm w-full mb-4 focus:outline-none focus:ring focus:border-blue-300 min-h-[80px]"
                >
                  {connections.map(conn => (
                    <option key={conn._id} value={conn._id}>
                      {conn.name || conn.username}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMembers}
                  disabled={isAddingMembers || selectedMembers.length === 0}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
                >
                  {isAddingMembers ? "Adding..." : "Add Selected Members"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages?.map((msg, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded-md">
            <div className="font-semibold mb-1">
              {typeof msg.sender === "object"
                ? msg.sender.name || msg.sender.fullName || msg.sender.username || "Unknown"
                : "Unknown"}
            </div>
            <div>{msg?.content}</div>

            {msg?.mediaUrl && (
              msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video controls className="mt-2 max-h-48 rounded">
                  <source src={msg.mediaUrl} />
                </video>
              ) : (
                <img src={msg.mediaUrl} alt="media" className="mt-2 max-h-48 rounded" />
              )
            )}

            <div className="text-xs text-gray-500 mt-1">
              {msg?.createdAt && new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-md w-full"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaChange}
            className="hidden"
            accept="image/*,video/*"
          />

          <div className="flex gap-2 items-center w-full sm:w-auto">
            <button
              type="button"
              onClick={handleFileClick}
              className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
              title="Attach Media"
            >
              <Paperclip size={18} /> 
              {/* delete it  */}
            </button>

            <button
              type="submit"
              disabled={uploading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition ${uploading && "opacity-50 cursor-not-allowed"}`}
            >
              {uploading ? "Sending..." : "Send"}
            </button>
          </div>

          {mediaFile && (
            <div className="text-sm text-gray-600 ml-1 mt-1 sm:mt-0">
              Attached: {mediaFile.name}
            </div>
          )}
        </form>
      </div>

      {/* Confirm Delete All Dialog */}
      {deleteMode === 'all' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[260px] w-full max-w-xs relative">
            <h3 className="font-semibold mb-4 text-lg text-center">Delete ALL Messages?</h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => deleteAllMessages()}
                disabled={isDeletingAll}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                {isDeletingAll ? "Deleting..." : "Yes, Delete All"}
              </button>
              <button
                onClick={() => setDeleteMode(null)}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select & Delete Selected Messages Dialog */}
      {deleteMode === 'selected' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md relative">
            <h3 className="font-semibold mb-4 text-lg text-center">Select Messages to Delete</h3>
            <div className="max-h-60 overflow-y-auto mb-4">
              {messages.length === 0 && <div className="text-gray-500">No messages.</div>}
              {messages.map(msg => (
                <div key={msg._id} className="flex items-center gap-2 border-b py-2">
                  <input
                    type="checkbox"
                    checked={selectedMsgIds.includes(msg._id)}
                    onChange={() => handleMsgSelect(msg._id)}
                    className="accent-red-500"
                  />
                  <span className="flex-1 truncate text-sm">
                    {msg.content ? msg.content.slice(0, 50) : (msg.mediaUrl ? `[Media]` : '[No Content]')}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => deleteSelectedMessages(selectedMsgIds)}
                disabled={isDeletingSelected || selectedMsgIds.length === 0}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                {isDeletingSelected ? "Deleting..." : "Delete Selected"}
              </button>
              <button
                onClick={() => { setDeleteMode(null); setSelectedMsgIds([]); }}
                className="bg-gray-200 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
