CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- channels

CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_by UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,

    CONSTRAINTS fk_channel_creator
        FOREIGN KEY (created_by),
        REFERENCES users(id),
        ON DELETE CASCADE
    
);

-- direct_messages
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    content VARCHAR(255) NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    file_id VARCHAR(100)
    "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,

    CONSTRAINT fk_dm_sender 
        FOREIGN KEY (sender_id),
        REFERENCES users(id),
        ON DELETE CASCADE,

    CONSTRAINT fk_dm_recipient
        FOREIGN KEY (recipient_id) REFERENCES users(id),
        ON DELETE CASCADE

    CONSTRAINT fk_file_id
        FOREIGN KEY (file_id)
        REFERENCES files(file_id)
        ON DELETE CASCADE
);

-- channel_messages

CREATE TABLE IF NOT EXISTS channel_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    content VARCHAR(255),
    sender_id UUID NOT NULL,
    channel_id UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    CONSTRAINT fk_channel_msg_sender
        FOREIGN KEY (sender_id),
        REFERENCES users(id),
        ON DELETE CASCADE,

    CONSTRAINT fk_channel_msg_channel
        FOREIGN KEY (channel_id),
        REFERENCES channels(id),
        ON DELETE CASCADE
    
);

-- channel_members
CREATE TABLE IF NOT EXISTS channel_members (
    user_id UUID NOT NULL,
    channel_id UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,

    CONSTRAINT fk_channel_member_user 
        FOREIGN KEY (user_id),
        REFERENCES users (id),
        ON DELETE CASCADE,

    CONSTRAINT fk_channel_member_channel
        FOREIGN KEY (channel_id),
        REFERENCES channels (id),
        ON DELETE CASCADE
    
);

-- files
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sender_id UUID NOT NULL,
    recipient_id UUID,
    channel_id UUID,
    original_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    download_url VARCHAR(500) NOT NULL,
    preview_url VARCHAR(500) NOT NULL,
    bucket_id VARCHAR(50) NOT NULL,
    file_id VARCHAR(50) not NULL

    "createdAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL CURRENT_TIMESTAMP,

    CONSTRAINT fk_file_sender FOREIGN KEY (sender_id),
    REFERENCES users(id),
    ON DELETE CASCADE,

    CONSTRAINT fk_file_recipint FOREIGN KEY (recipient_id),
    REFERENCES users(id),
    ON DELETE CASCADE,

    CONSTRAINT fk_file_channel FOREIGN KEY (channel_id),
    REFERENCES channels(id),
    ON DELETE CASCADE,

    CONSTRAINT chk_file_target
        CHECK (
            (recipient_id IS NOT NULL AND channel_id IS NULL)
            OR
            (recipient_id IS NULL AND channel_id IS NOT NULL)
        )
);