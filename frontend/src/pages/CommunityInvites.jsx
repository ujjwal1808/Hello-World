import React, { useEffect, useState } from "react";
import axios from "axios";

const CommunityInvites = () => {
  const [invites, setInvites] = useState([]);

  const fetchInvites = async () => {
    try {
      const res = await axios.get("/api/v1/community/invites", {
        withCredentials: true
      });
      setInvites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const acceptInvite = async (communityId) => {
    try {
      await axios.post(`/api/v1/community/${communityId}/accept-invite`, {}, {
        withCredentials: true
      });
      setInvites(prev => prev.filter(c => c._id !== communityId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Community Invites</h2>
      {invites.length === 0 ? (
        <p>No invites yet</p>
      ) : (
        invites.map(invite => (
          <div key={invite._id} className="bg-white shadow rounded p-3 mb-3">
            <p><strong>{invite.createdBy.username}</strong> invited you to join <strong>{invite.name}</strong></p>
            <button
              onClick={() => acceptInvite(invite._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
            >
              Accept Invite
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommunityInvites;
