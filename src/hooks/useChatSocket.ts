import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useChatSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io('http://sua-api.com', { transports: ['websocket'] });

    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      socketInstance.emit('join', { userId });
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useChatSocket;
