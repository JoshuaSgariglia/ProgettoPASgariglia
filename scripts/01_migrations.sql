-- Create the database tables

-- Enum types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE resource_type AS ENUM ('gpu', 'cpu');
CREATE TYPE request_status AS ENUM ('pending', 'invalid', 'approved', 'refused');

-- Users
CREATE TABLE users (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" VARCHAR(32) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "surname" VARCHAR(64) NOT NULL,
    "password" VARCHAR(512) NOT NULL,
    "role" user_role NOT NULL DEFAULT 'user',
    "tokenAmount" INTEGER NOT NULL DEFAULT 50,
    "datetimeCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeUpdated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeDeleted" TIMESTAMPTZ
);

-- Computing Resources
CREATE TABLE computing_resources (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "model" VARCHAR(64) NOT NULL,
    "serial" BIGINT NOT NULL,
    "manufacturer" VARCHAR(64) NOT NULL,
    "type" resource_type NOT NULL DEFAULT 'gpu',
    "datetimeCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeUpdated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeDeleted" TIMESTAMPTZ
);

-- Calendars
CREATE TABLE calendars (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "resource" UUID NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT FALSE,
    "datetimeCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeUpdated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeDeleted" TIMESTAMPTZ,
    CONSTRAINT fk_calendar_resource FOREIGN KEY ("resource") REFERENCES "computing_resources" ("uuid") ON DELETE CASCADE
);

-- Slot Requests
CREATE TABLE slot_requests (
    "uuid" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user" UUID NOT NULL,
    "calendar" UUID NOT NULL,
    "status" request_status NOT NULL DEFAULT 'pending',
    "datetimeStart" TIMESTAMPTZ NOT NULL,
    "datetimeEnd" TIMESTAMPTZ NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "reason" VARCHAR(512) NOT NULL,
    "refusalReason" VARCHAR(512),
    "datetimeCreated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeUpdated" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "datetimeDeleted" TIMESTAMPTZ,
    CONSTRAINT fk_request_user FOREIGN KEY ("user") REFERENCES "users" ("uuid") ON DELETE CASCADE,
    CONSTRAINT fk_request_calendar FOREIGN KEY ("calendar") REFERENCES "calendars" ("uuid") ON DELETE CASCADE
);