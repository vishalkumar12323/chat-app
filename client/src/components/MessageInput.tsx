import React, { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react';
import useChatStore from '../store/chatStore';
import { Send } from 'lucide-react';

const MessageInput: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const { sendMessage, currentChannel, selectedUser } = useChatStore();

    const handleSend = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!content.trim() || (!currentChannel && !selectedUser)) return;

        sendMessage(content);
        setContent('');
    };

    const isDisabled: boolean = !currentChannel && !selectedUser;
    const placeholder: string = currentChannel
        ? `Message #${currentChannel.name}`
        : selectedUser
            ? `Message @${selectedUser.username}`
            : 'Select a channel or user...';

    return (
        <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <input
                    type="text"
                    className="flex-1 bg-transparent outline-none"
                    placeholder={placeholder}
                    value={content}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
                    disabled={isDisabled}
                />
                <button
                    type="submit"
                    className={`ml-2 p-2 rounded-full ${content.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
                    disabled={!content.trim() || isDisabled}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
