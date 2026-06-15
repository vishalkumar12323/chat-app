import React from 'react';
import useChatStore from '../store/chatStore';

const TypingIndicator: React.FC = () => {
    const { typingUsers } = useChatStore();

    if (typingUsers.length === 0) return null;

    const getText = (): string => {
        if (typingUsers.length === 1) {
            return `${typingUsers[0].username} is typing`;
        } else if (typingUsers.length === 2) {
            return `${typingUsers[0].username} and ${typingUsers[1].username} are typing`;
        } else {
            return 'Several people are typing';
        }
    };

    return (
        <div className="px-4 py-1.5 bg-white border-t border-gray-100 flex items-center gap-2 min-h-[28px]">
            {/* Profile initials */}
            <div className="flex -space-x-1.5">
                {typingUsers.slice(0, 3).map((user) => (
                    <div
                        key={user.userId}
                        className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center ring-1 ring-white"
                        title={user.username}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Typing text */}
            <span className="text-xs text-gray-500 italic">
                {getText()}
            </span>

            {/* Animated dots */}
            <span className="flex gap-0.5 items-center">
                <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                <span className="typing-dot" style={{ animationDelay: '160ms' }} />
                <span className="typing-dot" style={{ animationDelay: '320ms' }} />
            </span>

            <style>{`
                .typing-dot {
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: #6b7280;
                    animation: typingBounce 1.2s ease-in-out infinite;
                }

                @keyframes typingBounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-4px);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default TypingIndicator;
