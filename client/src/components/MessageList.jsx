import { useEffect, useRef, useState } from 'react';
import useChatStore from '../store/chatStore';
import { format } from 'date-fns';

const MessageList = () => {
    const { messages, isLoading, currentChannel, selectedUser, loadMoreMessages, hasMoreMessages } = useChatStore();
    const bottomRef = useRef(null);
    const topRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (isAutoScrolling) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAutoScrolling]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreMessages && !isLoading) {
                    // Save scroll position before loading more
                    const scrollContainer = scrollContainerRef.current;
                    const previousScrollHeight = scrollContainer.scrollHeight;

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

    const handleScroll = () => {
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

                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            {msg.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-baseline">
                                <span className="font-bold mr-2">{msg.user?.username}</span>
                                <span className="text-xs text-gray-500">
                                    {format(new Date(msg.createdAt), 'h:mm a')}
                                </span>
                            </div>
                            <p className="text-gray-800">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;
