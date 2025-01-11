import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, WS_URL } from '../config/api';
import io from 'socket.io-client';

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/chat/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();

    socketRef.current = io(WS_URL);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentRoom) {
      socketRef.current.emit('join room', currentRoom.id);
      fetchMessages();
    }
  }, [currentRoom]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/rooms/${currentRoom.id}/messages`);
      setMessages(response.data.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/chat/rooms/${currentRoom.id}/messages`, {
        content: newMessage
      });

      socketRef.current.emit('chat message', {
        room: currentRoom.id,
        message: response.data
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Rooms Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Rooms</h2>
          <div className="mt-4">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setCurrentRoom(room)}
                className={`w-full text-left p-2 rounded ${
                  currentRoom?.id === room.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.userId === user.id ? 'text-right' : ''
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.userId === user.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;