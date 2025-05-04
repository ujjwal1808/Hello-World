import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav className='bg-secondary shadow-md sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center space-x-4'>
            <Link to='/'>
              <img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
            </Link>
          </div>
          <div className='flex items-center gap-2 md:gap-6'>
            {authUser ? (
              <>
                <Link to={"/"} className='text-neutral flex flex-col items-center'>
                  <Home size={20} />
                  <span className='text-xs hidden md:block'>Home</span>
                </Link>
                <Link to='/network' className='text-neutral flex flex-col items-center relative'>
                  <Users size={20} />
                  <span className='text-xs hidden md:block'>My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
                  <Bell size={20} />
                  <span className='text-xs hidden md:block'>Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center'>
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link to={`/chat/${authUser.username}`} className='text-neutral flex flex-col items-center relative'>
                  <MessageCircle size={20} />
                  <span className='text-xs hidden md:block'>Chats</span>
                </Link>
                <div className="relative">
                  <div
                    className="text-neutral flex flex-col items-center cursor-pointer"
                    onClick={() => setDropdownOpen(dropdownOpen === 'communities' ? false : 'communities')}
                  >
                    <Users size={20} />
                    <span className='text-xs hidden md:block'>Communities</span>
                  </div>
                  {dropdownOpen === 'communities' && authUser && (
                    <CommunityDropdown queryClient={queryClient} onClose={() => setDropdownOpen(false)} />
                  )}
                </div>
                <Link to={`/profile/${authUser.username}`} className='text-neutral flex flex-col items-center'>
                  <User size={20} />
                  <span className='text-xs hidden md:block'>Me</span>
                </Link>
                <button
                  className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className='hidden md:inline'>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='btn btn-ghost'>
                  Sign In
                </Link>
                <Link to='/signup' className='btn btn-primary'>
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function CommunityDropdown({ queryClient, onClose }) {
  const navigate = useNavigate();
  const { data: communities, isLoading } = useQuery({
    queryKey: ["myCommunities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/community/my-communities");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="absolute top-10 right-0 bg-white rounded shadow-lg w-48 z-20 p-2">Loading...</div>
    );
  if (!communities?.length)
    return (
      <div className="absolute top-10 right-0 bg-white rounded shadow-lg w-48 z-20 p-2">No communities found</div>
    );
  return (
    <div className="absolute top-10 right-0 bg-white rounded shadow-lg w-48 z-20">
      <ul className="py-2">
        {communities.map((community) => (
          <li key={community._id}>
            <button
              className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
              onClick={() => {
                navigate(`/community/${community._id}`);
                if (onClose) onClose();
              }}
            >
              {community.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
