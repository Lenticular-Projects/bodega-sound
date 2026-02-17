-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "locationUrl" TEXT,
    "flyerImage" TEXT,
    "capacity" INTEGER,
    "ticketPrice" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "collectInstagram" BOOLEAN NOT NULL DEFAULT false,
    "collectPhone" BOOLEAN NOT NULL DEFAULT false,
    "allowPlusOnes" BOOLEAN NOT NULL DEFAULT false,
    "showGuestList" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RSVP" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GOING',
    "plusOnes" INTEGER NOT NULL DEFAULT 0,
    "plusOneNames" TEXT,
    "customAnswers" TEXT,
    "referralSource" TEXT NOT NULL DEFAULT 'DIRECT',
    "qrCode" TEXT NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "checkedInBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_eventDate_idx" ON "Event"("eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "RSVP_qrCode_key" ON "RSVP"("qrCode");

-- CreateIndex
CREATE INDEX "RSVP_eventId_idx" ON "RSVP"("eventId");

-- CreateIndex
CREATE INDEX "RSVP_email_idx" ON "RSVP"("email");

-- CreateIndex
CREATE INDEX "RSVP_qrCode_idx" ON "RSVP"("qrCode");

-- CreateIndex
CREATE INDEX "RSVP_checkedIn_idx" ON "RSVP"("checkedIn");

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
