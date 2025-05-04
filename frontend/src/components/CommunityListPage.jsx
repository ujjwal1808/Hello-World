// src/pages/CommunityListPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const CommunityListPage = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/community/my");
        setCommunities(res.data.communities);
      } catch (err) {
        console.error("Failed to fetch communities", err);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Communities</h1>
      <ul className="space-y-2">
        {communities.map((community) => (
          <li key={community._id}>
            <Link to={`/community/${community._id}`} className="text-blue-500 hover:underline">
              {community.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityListPage;
