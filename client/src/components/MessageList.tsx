import React, { useEffect, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { format } from 'date-fns';
import { FileText, Download } from 'lucide-react';
import type { Message, FileAttachment } from '../types';

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileRenderer: React.FC<{ file: FileAttachment; type: string }> = ({ file, type }) => {
    if (type === 'IMAGE') {

        return (
            <div className="mt-2 max-w-sm">
                <div className="relative inline-block group">
                    <img
                        src={file.preview_url}
                        alt={file.original_name}
                        className="rounded-lg border border-gray-200 max-h-72 object-contain"
                        loading="lazy"
                    />
                    <a
                        href={file.download_url}
                        className="absolute inset-0 m-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/70"
                        title={`Download ${file.original_name}`}
                    >
                        <Download size={20} />
                    </a>
                </div>
                <p className="text-xs text-gray-400 mt-1">{file.original_name}</p>
            </div>
        );
    }

    // DOCUMENT (PDF)
    return (
        <div className="mt-2 max-w-xs">
            <a
                href={file.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors group"
            >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.original_name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.file_size)}</p>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
            </a>
        </div>
    );
};

const MessageList: React.FC = () => {
    const { messages, isLoading, currentChannel, selectedUser, loadMoreMessages, hasMoreMessages } = useChatStore();
    const { user: currentUser } = useAuthStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (isAutoScrolling) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAutoScrolling]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                if (entries[0].isIntersecting && hasMoreMessages && !isLoading) {
                    // Save scroll position before loading more
                    const scrollContainer = scrollContainerRef.current;
                    const previousScrollHeight = scrollContainer?.scrollHeight ?? 0;

                    loadMoreMessages().then(() => {
                        // Restore scroll position
                        if (scrollContainer) {
                            scrollContainer.scrollTop = scrollContainer.scrollHeight - previousScrollHeight;
                        }
                    });
                }
            },
            { threshold: 1.0 }
        );

        if (topRef.current) {
            observer.observe(topRef.current);
        }

        return () => observer.disconnect();
    }, [hasMoreMessages, isLoading, loadMoreMessages]);

    const handleScroll = (_e: UIEvent<HTMLDivElement>): void => {
        const container = scrollContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
            setIsAutoScrolling(isAtBottom);
        }
    };

    if (!currentChannel && !selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                Select a channel or user to start messaging
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center shadow-sm z-10">
                <div className="font-bold text-lg text-gray-800">
                    {currentChannel ? `# ${currentChannel.name}` : `@ ${selectedUser?.username}`}
                </div>
                {currentChannel && (
                    <div className="ml-4 text-sm text-gray-500 truncate">
                        {currentChannel.description}
                    </div>
                )}
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={scrollContainerRef}
                onScroll={handleScroll}
            >
                <div ref={topRef} className="h-1" />
                {isLoading && messages.length === 0 && <div>Loading messages...</div>}
                {hasMoreMessages && messages.length > 0 && <div className="text-center text-gray-400 text-xs">Loading older messages...</div>}

                {messages.map((msg: Message) => {
                    const isSender = currentUser?.id === msg.sender_id;

                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-3 ${isSender ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${isSender ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                {msg.Sender?.username?.charAt(0).toUpperCase()}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
                                {/* Sender name & time */}
                                <div className={`flex items-baseline gap-2 mb-1 ${isSender ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-xs font-semibold text-gray-600">{msg.Sender?.username}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                </div>

                                {/* Message bubble */}
                                <div
                                    className={`rounded-2xl px-4 py-2 inline-block ${
                                        isSender
                                            ? 'bg-indigo-500 text-white rounded-br-sm'
                                            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                    }`}
                                >
                                    {/* Text content */}
                                    {msg.content && (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    )}
                                    {/* File attachment */}
                                    {msg.File && (
                                        <FileRenderer file={msg.File} type={msg.type || 'DOCUMENT'} />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;
