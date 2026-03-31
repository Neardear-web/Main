-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RECEIVER', 'COMPANION', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PAUSED', 'SUSPENDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ApplicationStage" AS ENUM ('EXPRESSION_OF_INTEREST', 'FULL_APPLICATION', 'UNDER_VERIFICATION', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'ORIENTATION_PENDING', 'ORIENTATION_COMPLETE', 'ADMIN_REVIEW', 'APPROVED', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "TrustLevel" AS ENUM ('LEVEL_0', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3');

-- CreateEnum
CREATE TYPE "ServiceMode" AS ENUM ('REMOTE', 'IN_PERSON', 'BOTH');

-- CreateEnum
CREATE TYPE "ServiceCluster" AS ENUM ('PRESENCE', 'NAVIGATION', 'CONTINUITY', 'CONNECTION', 'PROFESSIONAL_ADVISORY');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('FIRST_TIME', 'SOME_EXPERIENCE', 'CONFIDENT');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('SOLO_COMPANION', 'TEAM_OPERATOR', 'TEAM_MEMBER', 'PROFESSIONAL_ADVISOR');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('SUBMITTED', 'MATCHED', 'COMPANION_NOTIFIED', 'ACCEPTED', 'PAYMENT_PENDING', 'PAYMENT_COMPLETE', 'SESSION_SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'NO_MATCH');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'CHECKED_IN', 'CHECKED_OUT', 'NOTE_SUBMITTED', 'COMPLETED', 'NO_SHOW_COMPANION', 'NO_SHOW_USER', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CAPTURED', 'RELEASED', 'REFUNDED', 'FAILED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ConcernSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ConcernStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('PUSH', 'SMS', 'EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('USER_REGISTERED', 'USER_LOGIN', 'USER_LOGOUT', 'PROFILE_UPDATED', 'APPLICATION_SUBMITTED', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'TRUST_LEVEL_CHANGED', 'SESSION_CREATED', 'SESSION_CHECKED_IN', 'SESSION_CHECKED_OUT', 'SESSION_COMPLETED', 'SESSION_CANCELLED', 'PAYMENT_CAPTURED', 'PAYMENT_RELEASED', 'PAYMENT_REFUNDED', 'CONCERN_RAISED', 'CONCERN_RESOLVED', 'ACCOUNT_SUSPENDED', 'ACCOUNT_RESTORED', 'ADMIN_ACTION', 'WARNING_ISSUED');

-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InterviewRecommendation" AS ENUM ('APPROVE', 'CONDITIONAL', 'REJECT');

-- CreateEnum
CREATE TYPE "HardSkill" AS ENUM ('FOUR_WHEELER_DRIVER', 'TWO_WHEELER_DRIVER', 'COMPUTER_LITERATE', 'MEDICAL_BACKGROUND', 'LEGAL_KNOWLEDGE', 'FINANCIAL_LITERACY', 'GOVT_OFFICE_NAVIGATION', 'MULTILINGUAL', 'FIRST_AID_TRAINED');

-- CreateEnum
CREATE TYPE "SoftSkill" AS ENUM ('EMPATHETIC', 'PATIENT', 'GOOD_COMMUNICATOR', 'WARM_PRESENCE', 'EMOTIONALLY_MATURE', 'CULTURALLY_SENSITIVE', 'CALM_UNDER_PRESSURE', 'TRUSTWORTHY', 'RELIABLE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "role" "Role" NOT NULL DEFAULT 'RECEIVER',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "consentTerms" BOOLEAN NOT NULL DEFAULT false,
    "consentAbuse" BOOLEAN NOT NULL DEFAULT false,
    "consentData" BOOLEAN NOT NULL DEFAULT false,
    "consentNotif" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "elder_profiles" (
    "id" TEXT NOT NULL,
    "familyUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "ageRange" TEXT NOT NULL,
    "primaryLanguage" TEXT NOT NULL,
    "secondaryLanguage" TEXT,
    "healthNotes" TEXT,
    "mobilityNotes" TEXT,
    "emergencyContact" TEXT NOT NULL,
    "emergencyName" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "elder_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "applicationStage" "ApplicationStage" NOT NULL DEFAULT 'EXPRESSION_OF_INTEREST',
    "trustLevel" "TrustLevel" NOT NULL DEFAULT 'LEVEL_0',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'PAUSED',
    "legalName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "alternatPhone" TEXT,
    "selfieUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT,
    "addressProofUrl" TEXT,
    "yearsAtAddress" TEXT,
    "aadhaarLast4" TEXT,
    "aadhaarVerified" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "aadhaarVerifiedAt" TIMESTAMP(3),
    "panNumber" TEXT,
    "pccUrl" TEXT,
    "pccIssuingAuth" TEXT,
    "pccIssuedAt" TIMESTAMP(3),
    "pccVerifiedAt" TIMESTAMP(3),
    "pccStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "pccExpiresAt" TIMESTAMP(3),
    "whyThisWork" TEXT,
    "serviceRadiusKm" INTEGER NOT NULL DEFAULT 10,
    "serviceAreas" TEXT[],
    "willingToTravel" BOOLEAN NOT NULL DEFAULT false,
    "vehicleType" TEXT,
    "hasVehicle" BOOLEAN NOT NULL DEFAULT false,
    "hardSkills" "HardSkill"[],
    "softSkills" "SoftSkill"[],
    "languages" TEXT[],
    "canAccompanyHospital" BOOLEAN NOT NULL DEFAULT false,
    "canDriveElderly" BOOLEAN NOT NULL DEFAULT false,
    "comfortableBedridden" BOOLEAN NOT NULL DEFAULT false,
    "availableDays" TEXT[],
    "availableSlots" TEXT[],
    "weeklyHours" TEXT,
    "noticePeriod" TEXT,
    "primaryExpertise" TEXT,
    "subSpecialisation" TEXT,
    "yearsExperience" INTEGER,
    "currentEmployer" TEXT,
    "feePerSession" INTEGER,
    "sessionDuration" INTEGER,
    "onlineOnly" BOOLEAN NOT NULL DEFAULT true,
    "officeAddress" TEXT,
    "googleMapsLink" TEXT,
    "teamOperatorId" TEXT,
    "teamSize" INTEGER,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "avgFeedbackScore" DOUBLE PRECISION,
    "acceptanceRate" DOUBLE PRECISION,
    "activatedAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "reVerificationDue" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_operators" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "orgName" TEXT,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,
    "registrationNo" TEXT,
    "registrationDoc" TEXT,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_references" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "yearsKnown" TEXT NOT NULL,
    "callStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "callNotes" TEXT,
    "calledAt" TIMESTAMP(3),
    "calledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_records" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "aadhaarStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "aadhaarCheckedAt" TIMESTAMP(3),
    "aadhaarCheckedBy" TEXT,
    "pccStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "pccCheckedAt" TIMESTAMP(3),
    "pccCheckedBy" TEXT,
    "ref1Status" TEXT NOT NULL DEFAULT 'PENDING',
    "ref1CalledAt" TIMESTAMP(3),
    "ref2Status" TEXT NOT NULL DEFAULT 'PENDING',
    "ref2CalledAt" TIMESTAMP(3),
    "overallStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_records" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "conductedAt" TIMESTAMP(3),
    "interviewerId" TEXT,
    "meetLink" TEXT,
    "empathyScore" INTEGER,
    "communicationScore" INTEGER,
    "boundaryScore" INTEGER,
    "scenarioScore" INTEGER,
    "totalScore" INTEGER,
    "recommendation" "InterviewRecommendation",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orientation_records" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "module1Complete" BOOLEAN NOT NULL DEFAULT false,
    "module2Complete" BOOLEAN NOT NULL DEFAULT false,
    "module3Complete" BOOLEAN NOT NULL DEFAULT false,
    "module4Complete" BOOLEAN NOT NULL DEFAULT false,
    "module5Complete" BOOLEAN NOT NULL DEFAULT false,
    "module6Complete" BOOLEAN NOT NULL DEFAULT false,
    "quizScore" INTEGER,
    "quizPassedAt" TIMESTAMP(3),
    "codeSignedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "renewalDue" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orientation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trust_level_history" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "fromLevel" "TrustLevel",
    "toLevel" "TrustLevel" NOT NULL,
    "reason" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trust_level_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_credentials" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "credentialType" TEXT NOT NULL,
    "issuingBody" TEXT,
    "year" TEXT,
    "documentUrl" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annual_reviews" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "reviewedBy" TEXT NOT NULL,
    "newPccUrl" TEXT,
    "interviewNotes" TEXT,
    "outcome" TEXT NOT NULL,
    "nextDue" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annual_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cluster" "ServiceCluster" NOT NULL,
    "mode" "ServiceMode" NOT NULL,
    "descriptionProvider" TEXT NOT NULL,
    "descriptionReceiver" TEXT NOT NULL,
    "minTrustLevel" "TrustLevel" NOT NULL DEFAULT 'LEVEL_0',
    "suggestedFeeMin" INTEGER NOT NULL,
    "suggestedFeeMax" INTEGER NOT NULL,
    "requiresVehicle" BOOLEAN NOT NULL DEFAULT false,
    "hardSkillTags" "HardSkill"[],
    "softSkillTags" "SoftSkill"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_offerings" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'FIRST_TIME',
    "personalStatement" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "elderProfileId" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "descriptionRaw" TEXT NOT NULL,
    "aiExtractedData" JSONB,
    "serviceCity" TEXT NOT NULL,
    "serviceArea" TEXT,
    "preferredDate" TIMESTAMP(3),
    "preferredTimeSlot" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringFreq" "RecurringFrequency",
    "specialNotes" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_services" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "matchReason" JSONB,
    "cardCopy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SHOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "companionId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "durationMinutes" INTEGER,
    "serviceCity" TEXT NOT NULL,
    "serviceAddress" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "checkedInLat" DOUBLE PRECISION,
    "checkedInLng" DOUBLE PRECISION,
    "checkedOutAt" TIMESTAMP(3),
    "checkedOutLat" DOUBLE PRECISION,
    "checkedOutLng" DOUBLE PRECISION,
    "completedAt" TIMESTAMP(3),
    "confirmedByUser" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "autoConfirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_notes" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "whatDoneToday" TEXT NOT NULL,
    "personWellbeing" TEXT,
    "familyObservation" TEXT,
    "hasConcern" BOOLEAN NOT NULL DEFAULT false,
    "concernDetail" TEXT,
    "nextVisitNeeded" BOOLEAN NOT NULL DEFAULT false,
    "nextVisitDate" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "arrivedOnTime" BOOLEAN,
    "followedScope" BOOLEAN,
    "wellbeingScore" INTEGER,
    "wouldRequestAgain" TEXT,
    "overallScore" INTEGER,
    "concernText" TEXT,
    "hasConcern" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "platformFee" INTEGER NOT NULL,
    "companionShare" INTEGER NOT NULL,
    "capturedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" INTEGER,
    "refundReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earnings" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "bankAccount" TEXT,
    "ifscCode" TEXT,
    "accountName" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'REQUESTED',
    "processedAt" TIMESTAMP(3),
    "transactionRef" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurring_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "elderProfileId" TEXT,
    "providerProfileId" TEXT NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,
    "frequency" "RecurringFrequency" NOT NULL,
    "sessionsPerCycle" INTEGER NOT NULL,
    "feePerSession" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextBillingDate" TIMESTAMP(3),
    "lastSessionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concerns" (
    "id" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,
    "providerProfileId" TEXT,
    "sessionId" TEXT,
    "severity" "ConcernSeverity" NOT NULL DEFAULT 'LOW',
    "status" "ConcernStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "adminNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolutionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concerns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notes" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warnings" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),

    CONSTRAINT "warnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspensions" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isPermanent" BOOLEAN NOT NULL DEFAULT false,
    "issuedBy" TEXT NOT NULL,
    "outcome" TEXT,
    "liftedAt" TIMESTAMP(3),
    "liftedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suspensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_accountStatus_idx" ON "users"("accountStatus");

-- CreateIndex
CREATE INDEX "users_city_idx" ON "users"("city");

-- CreateIndex
CREATE INDEX "otp_tokens_phone_idx" ON "otp_tokens"("phone");

-- CreateIndex
CREATE INDEX "otp_tokens_token_idx" ON "otp_tokens"("token");

-- CreateIndex
CREATE INDEX "otp_tokens_expiresAt_idx" ON "otp_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "elder_profiles_familyUserId_idx" ON "elder_profiles"("familyUserId");

-- CreateIndex
CREATE INDEX "elder_profiles_city_idx" ON "elder_profiles"("city");

-- CreateIndex
CREATE INDEX "elder_profiles_isActive_idx" ON "elder_profiles"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "provider_profiles_userId_key" ON "provider_profiles"("userId");

-- CreateIndex
CREATE INDEX "provider_profiles_userId_idx" ON "provider_profiles"("userId");

-- CreateIndex
CREATE INDEX "provider_profiles_city_idx" ON "provider_profiles"("city");

-- CreateIndex
CREATE INDEX "provider_profiles_trustLevel_idx" ON "provider_profiles"("trustLevel");

-- CreateIndex
CREATE INDEX "provider_profiles_accountStatus_idx" ON "provider_profiles"("accountStatus");

-- CreateIndex
CREATE INDEX "provider_profiles_applicationStage_idx" ON "provider_profiles"("applicationStage");

-- CreateIndex
CREATE INDEX "provider_profiles_providerType_idx" ON "provider_profiles"("providerType");

-- CreateIndex
CREATE UNIQUE INDEX "team_operators_providerProfileId_key" ON "team_operators"("providerProfileId");

-- CreateIndex
CREATE INDEX "character_references_providerProfileId_idx" ON "character_references"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_records_providerProfileId_key" ON "verification_records"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "interview_records_providerProfileId_key" ON "interview_records"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "orientation_records_providerProfileId_key" ON "orientation_records"("providerProfileId");

-- CreateIndex
CREATE INDEX "trust_level_history_providerProfileId_idx" ON "trust_level_history"("providerProfileId");

-- CreateIndex
CREATE INDEX "provider_credentials_providerProfileId_idx" ON "provider_credentials"("providerProfileId");

-- CreateIndex
CREATE INDEX "annual_reviews_providerProfileId_idx" ON "annual_reviews"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");

-- CreateIndex
CREATE INDEX "service_categories_cluster_idx" ON "service_categories"("cluster");

-- CreateIndex
CREATE INDEX "service_categories_isActive_idx" ON "service_categories"("isActive");

-- CreateIndex
CREATE INDEX "service_categories_minTrustLevel_idx" ON "service_categories"("minTrustLevel");

-- CreateIndex
CREATE INDEX "service_offerings_providerProfileId_idx" ON "service_offerings"("providerProfileId");

-- CreateIndex
CREATE INDEX "service_offerings_serviceCategoryId_idx" ON "service_offerings"("serviceCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "service_offerings_providerProfileId_serviceCategoryId_key" ON "service_offerings"("providerProfileId", "serviceCategoryId");

-- CreateIndex
CREATE INDEX "requests_userId_idx" ON "requests"("userId");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_serviceCity_idx" ON "requests"("serviceCity");

-- CreateIndex
CREATE INDEX "requests_createdAt_idx" ON "requests"("createdAt");

-- CreateIndex
CREATE INDEX "request_services_requestId_idx" ON "request_services"("requestId");

-- CreateIndex
CREATE INDEX "request_services_serviceCategoryId_idx" ON "request_services"("serviceCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "request_services_requestId_serviceCategoryId_key" ON "request_services"("requestId", "serviceCategoryId");

-- CreateIndex
CREATE INDEX "matches_requestId_idx" ON "matches"("requestId");

-- CreateIndex
CREATE INDEX "matches_providerProfileId_idx" ON "matches"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_requestId_key" ON "sessions"("requestId");

-- CreateIndex
CREATE INDEX "sessions_companionId_idx" ON "sessions"("companionId");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_scheduledDate_idx" ON "sessions"("scheduledDate");

-- CreateIndex
CREATE INDEX "sessions_serviceCity_idx" ON "sessions"("serviceCity");

-- CreateIndex
CREATE UNIQUE INDEX "session_notes_sessionId_key" ON "session_notes"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_sessionId_key" ON "feedback"("sessionId");

-- CreateIndex
CREATE INDEX "feedback_userId_idx" ON "feedback"("userId");

-- CreateIndex
CREATE INDEX "feedback_sessionId_idx" ON "feedback"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_requestId_key" ON "payments"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_sessionId_key" ON "payments"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpayOrderId_key" ON "payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpayPaymentId_key" ON "payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_razorpayOrderId_idx" ON "payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "earnings_sessionId_key" ON "earnings"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "earnings_paymentId_key" ON "earnings"("paymentId");

-- CreateIndex
CREATE INDEX "earnings_providerProfileId_idx" ON "earnings"("providerProfileId");

-- CreateIndex
CREATE INDEX "earnings_status_idx" ON "earnings"("status");

-- CreateIndex
CREATE INDEX "withdrawals_providerProfileId_idx" ON "withdrawals"("providerProfileId");

-- CreateIndex
CREATE INDEX "withdrawals_status_idx" ON "withdrawals"("status");

-- CreateIndex
CREATE INDEX "recurring_plans_userId_idx" ON "recurring_plans"("userId");

-- CreateIndex
CREATE INDEX "recurring_plans_providerProfileId_idx" ON "recurring_plans"("providerProfileId");

-- CreateIndex
CREATE INDEX "recurring_plans_isActive_idx" ON "recurring_plans"("isActive");

-- CreateIndex
CREATE INDEX "concerns_status_idx" ON "concerns"("status");

-- CreateIndex
CREATE INDEX "concerns_severity_idx" ON "concerns"("severity");

-- CreateIndex
CREATE INDEX "concerns_providerProfileId_idx" ON "concerns"("providerProfileId");

-- CreateIndex
CREATE INDEX "admin_notes_providerProfileId_idx" ON "admin_notes"("providerProfileId");

-- CreateIndex
CREATE INDEX "warnings_providerProfileId_idx" ON "warnings"("providerProfileId");

-- CreateIndex
CREATE INDEX "suspensions_providerProfileId_idx" ON "suspensions"("providerProfileId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "audit_log_actorId_idx" ON "audit_log"("actorId");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_entityType_idx" ON "audit_log"("entityType");

-- CreateIndex
CREATE INDEX "audit_log_createdAt_idx" ON "audit_log"("createdAt");

-- AddForeignKey
ALTER TABLE "otp_tokens" ADD CONSTRAINT "otp_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elder_profiles" ADD CONSTRAINT "elder_profiles_familyUserId_fkey" FOREIGN KEY ("familyUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_teamOperatorId_fkey" FOREIGN KEY ("teamOperatorId") REFERENCES "team_operators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_operators" ADD CONSTRAINT "team_operators_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_references" ADD CONSTRAINT "character_references_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_records" ADD CONSTRAINT "interview_records_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orientation_records" ADD CONSTRAINT "orientation_records_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_level_history" ADD CONSTRAINT "trust_level_history_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_credentials" ADD CONSTRAINT "provider_credentials_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_reviews" ADD CONSTRAINT "annual_reviews_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_elderProfileId_fkey" FOREIGN KEY ("elderProfileId") REFERENCES "elder_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_services" ADD CONSTRAINT "request_services_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_services" ADD CONSTRAINT "request_services_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_companionId_fkey" FOREIGN KEY ("companionId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_plans" ADD CONSTRAINT "recurring_plans_elderProfileId_fkey" FOREIGN KEY ("elderProfileId") REFERENCES "elder_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concerns" ADD CONSTRAINT "concerns_raisedById_fkey" FOREIGN KEY ("raisedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concerns" ADD CONSTRAINT "concerns_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concerns" ADD CONSTRAINT "concerns_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "warnings_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspensions" ADD CONSTRAINT "suspensions_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
