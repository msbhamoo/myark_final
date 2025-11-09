-- =================================================================
-- Core User and Authentication Tables
-- =================================================================

-- Users table: Stores basic information for all user types.
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "avatar_url" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "role" VARCHAR(50) NOT NULL CHECK ("role" IN ('student', 'parent', 'organizer', 'school_admin', 'site_admin')), -- Role determines which profile table to join
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Schools table: Manages school information.
CREATE TABLE "schools" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100),
    "website" VARCHAR(255),
    "logo_url" VARCHAR(255),
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Student Profiles: Specific details for student users.
CREATE TABLE "student_profiles" (
    "user_id" UUID PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
    "school_id" UUID REFERENCES "schools"("id") ON DELETE SET NULL,
    "grade" INT,
    "date_of_birth" DATE,
    "parent_id" UUID REFERENCES "users"("id") ON DELETE SET NULL -- Links to a user with the 'parent' role
);

-- Organizer Profiles: Specific details for hosts/organizers.
CREATE TABLE "organizer_profiles" (
    "user_id" UUID PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
    "organization_name" VARCHAR(255) NOT NULL,
    "organization_logo_url" VARCHAR(255),
    "organization_website" VARCHAR(255),
    "is_verified" BOOLEAN DEFAULT false,
    "description" TEXT
);

-- =================================================================
-- Opportunity and Related Tables
-- =================================================================

-- Opportunity Categories: For filtering and display.
CREATE TABLE "opportunity_categories" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "icon" VARCHAR(50), -- e.g., 'Trophy', 'Award'
    "color" VARCHAR(50) -- e.g., 'from-orange-400 to-orange-600'
);

-- Opportunities table: The central table for all listings.
CREATE TABLE "opportunities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL, -- For clean URLs
    "organizer_id" UUID NOT NULL REFERENCES "organizer_profiles"("user_id"),
    "category_id" INT NOT NULL REFERENCES "opportunity_categories"("id"),
    "description" TEXT,
    "image_url" VARCHAR(255),
    "mode" VARCHAR(50) CHECK ("mode" IN ('online', 'offline', 'hybrid')),
    "fee" NUMERIC(10, 2) DEFAULT 0.00,
    "currency" VARCHAR(3) DEFAULT 'INR',
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "registration_deadline" TIMESTAMPTZ NOT NULL,
    "grade_eligibility_min" INT,
    "grade_eligibility_max" INT,
    "status" VARCHAR(50) DEFAULT 'published' CHECK ("status" IN ('draft', 'published', 'archived')),
    "created_at" TIMESTAMPTZ DEFAULT now(),
    "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Rich content for opportunities, normalized into separate tables.

CREATE TABLE "opportunity_eligibility" (
    "id" SERIAL PRIMARY KEY,
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "criterion" TEXT NOT NULL
);

CREATE TABLE "opportunity_benefits" (
    "id" SERIAL PRIMARY KEY,
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "benefit" TEXT NOT NULL
);

CREATE TABLE "opportunity_timeline" (
    "id" SERIAL PRIMARY KEY,
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "event_date" TIMESTAMPTZ NOT NULL,
    "event_name" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) CHECK ("status" IN ('completed', 'active', 'upcoming'))
);

CREATE TABLE "opportunity_exam_patterns" (
    "opportunity_id" UUID PRIMARY KEY REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "total_questions" INT,
    "duration_minutes" INT,
    "negative_marking" BOOLEAN,
    "negative_marks_per_question" NUMERIC(4, 2)
);

CREATE TABLE "opportunity_exam_sections" (
    "id" SERIAL PRIMARY KEY,
    "exam_pattern_id" UUID NOT NULL REFERENCES "opportunity_exam_patterns"("opportunity_id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "questions" INT,
    "marks" INT
);

-- =================================================================
-- User Interaction Tables
-- =================================================================

-- Registrations: Junction table for students enrolling in opportunities.
CREATE TABLE "registrations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL REFERENCES "student_profiles"("user_id"),
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id"),
    "registered_at" TIMESTAMPTZ DEFAULT now(),
    "status" VARCHAR(50) DEFAULT 'confirmed' CHECK ("status" IN ('confirmed', 'pending_payment', 'cancelled')),
    UNIQUE("student_id", "opportunity_id") -- A student can only register once for an opportunity
);

-- Bookmarks: For users to save opportunities.
CREATE TABLE "bookmarks" (
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY ("user_id", "opportunity_id")
);

-- =================================================================
-- Content and Resource Tables
-- =================================================================

-- Resources: A generic table for various content types.
CREATE TABLE "resources" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL CHECK ("resource_type" IN ('practice_paper', 'sample_paper', 'video_tutorial', 'cheat_sheet', 'notes')),
    "file_url" VARCHAR(255), -- For downloadable content
    "video_url" VARCHAR(255), -- For video content
    "description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT now()
);

-- Discussion Forum: For user discussions on an opportunity.
CREATE TABLE "discussion_threads" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "opportunity_id" UUID NOT NULL REFERENCES "opportunities"("id") ON DELETE CASCADE,
    "author_id" UUID NOT NULL REFERENCES "users"("id"),
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "discussion_replies" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "thread_id" UUID NOT NULL REFERENCES "discussion_threads"("id") ON DELETE CASCADE,
    "author_id" UUID NOT NULL REFERENCES "users"("id"),
    "body" TEXT NOT NULL,
    "parent_reply_id" UUID REFERENCES "discussion_replies"("id"), -- For nested replies
    "created_at" TIMESTAMPTZ DEFAULT now()
);
