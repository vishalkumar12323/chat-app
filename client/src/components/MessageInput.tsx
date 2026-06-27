import React, { useState, useRef, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react';
import useChatStore from '../store/chatStore';
import { Send, Paperclip, X, FileText, Image } from 'lucide-react';

const ACCEPTED_FILE_TYPES = '.png,.jpeg,.jpg,.pdf';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageInput: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const { sendMessage, sendFileMessage, currentChannel, selectedUser, emitTyping, isUploading } = useChatStore();
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        setFileError('');
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setFileError('File size exceeds 5MB limit.');
            return;
        }

        setSelectedFile(file);
        // Reset the file input so the same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeSelectedFile = (): void => {
        setSelectedFile(null);
        setFileError('');
    };

    const handleSend = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (isUploading) return;
        if (!content.trim() && !selectedFile) return;
        if (!currentChannel && !selectedUser) return;

        // Stop typing immediately on send
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        emitTyping(false);

        if (selectedFile) {
            try {
                await sendFileMessage(selectedFile, content.trim() || undefined);
                setSelectedFile(null);
                setContent('');
            } catch {
                setFileError('Failed to upload file. Please try again.');
            }
        } else {
            sendMessage(content);
            setContent('');
        }
    };

    const isDisabled: boolean = !currentChannel && !selectedUser;
    const placeholder: string = currentChannel
        ? `Message #${currentChannel.name}`
        : selectedUser
            ? `Message @${selectedUser.username}`
            : 'Select a channel or user...';

    const isImage = selectedFile?.type.startsWith('image/');

    return (
        <div className="p-4 bg-white border-t border-gray-200">
            {/* File preview */}
            {selectedFile && (
                <div className="mb-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 animate-in">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-gray-200 shrink-0">
                        {isImage ? (
                            <Image size={16} className="text-blue-500" />
                        ) : (
                            <FileText size={16} className="text-red-500" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Remove file"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Error message */}
            {fileError && (
                <div className="mb-2 text-xs text-red-500 px-1">
                    {fileError}
                </div>
            )}

            <form onSubmit={handleSend} className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500">
                {/* File attachment button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`mr-2 p-1.5 rounded-full transition-colors ${isDisabled || isUploading
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    disabled={isDisabled || isUploading}
                    title="Attach file (.png, .jpeg, .pdf)"
                >
                    <Paperclip size={18} />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={handleFileSelect}
                />

                <input
                    type="text"
                    className="flex-1 bg-transparent outline-none"
                    placeholder={selectedFile ? 'Add a caption (optional)...' : placeholder}
                    value={content}
                    onChange={handleChange}
                    disabled={isDisabled || isUploading}
                />

                <button
                    type="submit"
                    className={`ml-2 p-2 rounded-full transition-colors ${(content.trim() || selectedFile) && !isUploading
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                    disabled={(!content.trim() && !selectedFile) || isDisabled || isUploading}
                >
                    {isUploading ? (
                        <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
