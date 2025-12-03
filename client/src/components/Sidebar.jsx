import { useEffect, useState } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { LogOut, Plus, Hash } from 'lucide-react';

const Sidebar = () => {
    const { channels, fetchChannels, selectChannel, currentChannel, createChannel } = useChatStore();
    const { user, logout } = useAuthStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newChannelData, setNewChannelData] = useState({
        name: "",
        description: ""
    })

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChannelData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleCreateChannel = async (e) => {
        e.preventDefault();
        if (!newChannelData.name) return;
        try {
            await createChannel(newChannelData.name, newChannelData.description);
            setNewChannelData({
                name: "",
                description: ""
            });
            setIsCreating(false);
        } catch (error) {
            alert('Failed to create channel');
        }
    };

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="font-bold text-xl">Slack-Lite</h1>
                <button onClick={logout} title="Logout">
                    <LogOut size={20} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-400 font-semibold uppercase text-sm">Channels</h2>
                    <button onClick={() => setIsCreating(!isCreating)} className="text-gray-400 hover:text-white">
                        <Plus size={20} />
                    </button>
                </div>

                {isCreating && (
                    <form onSubmit={handleCreateChannel} className="mb-4 bg-gray-800 p-2 rounded">
                        <input
                            type="text"
                            name="name"
                            placeholder="Channel Name"
                            className="w-full bg-gray-700 text-white p-1 rounded mb-2 text-sm"
                            value={newChannelData.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            className="w-full bg-gray-700 text-white p-1 rounded mb-2 text-sm"
                            value={newChannelData.description}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white p-1 rounded text-sm">Create</button>
                    </form>
                )}

                <ul className="space-y-1">
                    {channels.map((channel) => (
                        <li key={channel.id}>
                            <button
                                onClick={() => selectChannel(channel)}
                                className={`w-full text-left px-2 py-1 rounded flex items-center ${currentChannel?.id === channel.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <Hash size={16} className="mr-2" />
                                {channel.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-gray-700 flex items-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="font-semibold">{user?.username}</div>
                    <div className="text-xs text-green-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Online
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
