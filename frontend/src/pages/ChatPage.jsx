import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { toast } from "react-hot-toast"; // ✅ Make sure this is installed and configured

const ENDPOINT = "http://localhost:8000";
let socket;

const ChatPage = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const messagesEndRef = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  const fetchMessages = async (userId, otherUserId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/chats/send/${userId}/${otherUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt-linkedin")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]);
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[user._id];
      return updated;
    });
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    if (selectedUser) {
      const room = [authUser._id, selectedUser._id].sort().join("_");
      socket.emit("joinChat", { userId: authUser._id, otherUserId: selectedUser._id });
      fetchMessages(authUser._id, selectedUser._id);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [selectedUser, authUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && selectedUser) {
      socket.emit("sendMessage", {
        senderId: authUser._id,
        receiverId: selectedUser._id,
        content: input,
      });
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 h-full p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        <div className="space-y-4">
          {connections?.data?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                selectedUser?._id === user._id
                  ? "bg-primary text-white"
                  : unreadMessages[user._id] > 0
                  ? "bg-yellow-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between p-4 bg-primary text-white shadow-md">
          <h2 className="text-xl font-bold">
            {selectedUser ? selectedUser.name : "Select a User"}
          </h2>
          <button
            className="bg-white text-primary font-semibold px-4 py-2 rounded hover:bg-gray-200"
            onClick={() => setShowCreateCommunityModal(true)}
          >
            + Create Community
          </button>
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.senderId === authUser._id
                  ? "self-end bg-primary"
                  : "self-start bg-gray-300"
              } rounded-lg p-2 px-4 text-white max-w-xs`}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="flex items-center p-4 bg-gray-200" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors m-1"
            disabled={!selectedUser}
          >
            Send
          </button>
        </form>

        {/* Create Community Modal */}
        {showCreateCommunityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Community</h2>

              <input
                type="text"
                placeholder="Community Name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />

              <h3 className="font-semibold mb-2">Select Members</h3>
              <div className="max-h-40 overflow-y-auto mb-4">
                {connections?.data?.map((user) => (
                  <label key={user._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => {
                        setSelectedMembers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        );
                      }}
                    />
                    {user.name}
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCreateCommunityModal(false)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
                <button
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  onClick={async () => {
    if (!communityName.trim()) {
      toast.error("Please enter a community name.");
      return;
    }

    try {
      const res = await axiosInstance.post("/community", {
        name: communityName,
        members: selectedMembers,
      });

      const communityId = res?.data?.community?._id;

      toast.success("Community created successfully! 🚀");

      // Reset modal and form state
      setShowCreateCommunityModal(false);
      setCommunityName("");
      setSelectedMembers([]);

      // Navigate to the new community page
      navigate(`/community/${communityId}`);
    } catch (err) {
      console.error("Error creating community:", err);
      toast.error("Failed to create community.");
    }
  }}
>
  Create
</button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
