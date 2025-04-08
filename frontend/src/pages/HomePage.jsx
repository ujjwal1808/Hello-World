import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import LocSearch from "../components/LocSearch";
import { useState } from "react";

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredLocation, setFilteredLocation] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostCreation user={authUser} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFilteredLocation(searchLocation.trim().toLowerCase());
          }}
          className="flex items-center gap-2 mb-4"
        >
          <input
            type="text"
            placeholder="Search posts by location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          >
            Search
          </button>
        </form>



        {posts
          ?.filter((post) => {
            if (!filteredLocation) return true;
            return post.location?.toLowerCase().includes(filteredLocation);
          })
          .map((post) => (
            <Post key={post._id} post={post} />
          ))}


        {posts?.filter((post) => {
          if (!filteredLocation) return true;
          return post.location?.toLowerCase().includes(filteredLocation);
        }).length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                No Posts Found
              </h2>
              <p className="text-gray-600 mb-6">
                Try searching for a different location!
              </p>
            </div>
          )}

      </div>

      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
