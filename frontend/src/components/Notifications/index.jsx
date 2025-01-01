import React, { useEffect, useRef, useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import socketClient from "socket.io-client";
import { environmentUrls } from '../../constants';
import axios from 'axios';
import { failureToaster, successToaster } from '../../utils/swal';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);


  const unreadCount = notifications.filter((n) => !n?.isRead).length;

  // Fetch all notifications
  const getAllNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${environmentUrls.api_url}/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.docs);
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Failed to fetch notifications.");
    }
  };

  // Mark a specific notification as read
  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(`${environmentUrls.api_url}/notification/mark-as-read/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      successToaster("Notification marked as read.");
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Failed to mark notification as read.");
    }
  };

  // Delete a specific notification
  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${environmentUrls.api_url}/notification/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((notif) => notif._id !== id));
      successToaster("Notification deleted.");
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Failed to delete notification.");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(`${environmentUrls.api_url}/notification/mark-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
      successToaster("All notifications marked as read.");
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Failed to mark all notifications as read.");
    }
  };

  // Socket setup for real-time updates
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    let socket;
    
    const initializeSocket = () => {
      socket = socketClient(environmentUrls.file_url);
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Userrrr outside ", user)

      if (user && user.id) {
        const userId = user.id;
        console.log("Userrrr inside ", user)

        // Listen to the user-specific notification channel
        socket.on(`notify-${userId}`, (notification) => {
          console.log("nofications", notification)
          getAllNotifications();
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    getAllNotifications();
    initializeSocket();

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (socket) socket.disconnect();
    };
  }, []);


  function timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
  
    if (diffInSeconds < minute) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < month) {
      const days = Math.floor(diffInSeconds / day);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInSeconds / month);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
  }
  

  return (
    <div className="relative" ref={containerRef} style={{zIndex: 22222}}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100"
      >
        <Bell className="h-8 w-8 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden  "  >
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                Mark all as read
              </button>
              
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notif.isRead ? "bg-purple-50" : ""
                }`}
              >
                <div className="mr-4 text-3xl">{notif.icon || "🔔"}</div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                  <p className="text-sm text-gray-600">{notif.description}</p>
                  <span className="text-xs text-gray-500 mt-1">
                    {timeAgo(notif.createdAt)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;

