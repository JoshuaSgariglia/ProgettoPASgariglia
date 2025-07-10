-- Create the database tables

-- Enum types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE resource_type AS ENUM ('gpu', 'cpu');
CREATE TYPE request_status AS ENUM ('pending', 'invalid', 'approved', 'refused');

-- Users
CREATE TABLE Users (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "surname" VARCHAR(64) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "role" user_role NOT NULL DEFAULT 'user',
    "tokenAmount" INTEGER NOT NULL DEFAULT 50
);

-- Resources
CREATE TABLE Resources (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "model" VARCHAR(64) NOT NULL,
    "serial" BIGINT NOT NULL,
    "manufacturer" VARCHAR(64) NOT NULL,
    "type" resource_type NOT NULL DEFAULT 'gpu'
);

-- Calendars
CREATE TABLE Calendars (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "resource" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_calendar_resource FOREIGN KEY ("resource") REFERENCES "Resources" ("uuid") ON DELETE CASCADE
);

-- Requests
CREATE TABLE Requests (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" UUID NOT NULL,
    "calendar" UUID NOT NULL,
    "status" request_status NOT NULL DEFAULT 'pending',
    "datetimeStart" TIMESTAMPTZ NOT NULL,
    "datetimeEnd" TIMESTAMPTZ NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "reason" VARCHAR(512) NOT NULL,
    "refusalReason" VARCHAR(512),
    CONSTRAINT fk_request_user FOREIGN KEY ("user") REFERENCES "Users" ("uuid") ON DELETE CASCADE,
    CONSTRAINT fk_request_calendar FOREIGN KEY ("calendar") REFERENCES "Calendars" ("uuid") ON DELETE CASCADE
);