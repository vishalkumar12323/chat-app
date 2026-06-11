import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

const Chat = () => {
    const { connectSocket, disconnectSocket } = useChatStore();
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            connectSocket(token);
        }
        return () => {
            disconnectSocket();
        };
    }, [token, connectSocket, disconnectSocket]);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <MessageList />
                <MessageInput />
            </div>
            <UserList />
        </div>
    );
};

export default Chat;
