import React, { useState, useRef, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react';
import useChatStore from '../store/chatStore';
import { Send } from 'lucide-react';

const MessageInput: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const { sendMessage, currentChannel, selectedUser, emitTyping } = useChatStore();
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setContent(e.target.value);

        if (e.target.value.trim()) {
            // Emit typing: true immediately
            emitTyping(true);

            // Reset the 2-second debounce timer
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
                emitTyping(false);
                typingTimeoutRef.current = null;
            }, 2000);
        } else {
            // Input cleared — stop typing
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
            emitTyping(false);
        }
    };

    const handleSend = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!content.trim() || (!currentChannel && !selectedUser)) return;

        // Stop typing immediately on send
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        emitTyping(false);

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
                    onChange={handleChange}
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
