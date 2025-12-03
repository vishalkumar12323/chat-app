import { useEffect } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from "../store/authStore";

const UserList = () => {
    const { users, fetchUsers, onlineUsers, selectUser, selectedUser } = useChatStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-screen">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-700">Users</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {users.map((u) => {
                        const isOnline = onlineUsers.has(u.id) || u.is_online;

                        if (u.id === user?.id) return null;

                        return (

                            <li
                                key={u.id}
                                className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-200 ${selectedUser?.id === u.id ? 'bg-indigo-100' : ''}`}
                                onClick={() => selectUser(u)}
                            >
                                <div className="relative mr-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ring-1 ring-indigo-500 ring-offset-2 ring-offset-gray-50">
                                        {u.username.charAt(0).toUpperCase()}
                                    </div>
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <span className={isOnline ? 'font-medium text-gray-900' : 'text-gray-500'}>
                                    {u.username}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default UserList;
