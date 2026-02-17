-- CreateTable
CREATE TABLE "test_users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "test_code" VARCHAR(6) NOT NULL,
    "has_taken_test" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "authority_level" TEXT,
    "answers" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_users_test_code_key" ON "test_users"("test_code");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
