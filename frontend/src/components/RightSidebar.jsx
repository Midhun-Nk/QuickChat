import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = ({ selectedUser, messages }) => {
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    if (messages) {
      setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
    }
  }, [messages]);

  return (
    <div className="bg-[#8185B2]/10 text-white w-full h-full flex flex-col overflow-y-scroll max-md:hidden">
      {selectedUser ? (
        <>
          {/* User info */}
          <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="profile"
              className="w-20 aspect-[1/1] rounded-full"
            />
            <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              )}
              {selectedUser.fullName}
            </h1>
            <p className="px-10 mx-auto">{selectedUser.bio}</p>
          </div>

          <hr className="border-[#ffffff50] my-4" />

          {/* Media section */}
          <div className="px-5 text-xs">
            <p>Media</p>
            <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
              {msgImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => window.open(url)}
                  className="cursor-pointer rounded"
                >
                  <img src={url} alt="" className="h-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Logout button */}
          <div className="mt-auto px-5 pb-5">
            <button
              onClick={logout}
              className="w-full bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 rounded-full cursor-pointer"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        // Empty div preserves grid column
        <div className="w-full h-full"></div>
      )}
    </div>
  );
};

export default RightSidebar;
