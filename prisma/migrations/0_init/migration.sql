-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "recruitedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkGroup" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "leaderTitle" VARCHAR(45) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "WorkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivateToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "ActivateToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "workLogEntryId" TEXT NOT NULL,
    "loggedDate" TIMESTAMP(0) NOT NULL,
    "expirationDate" TIMESTAMP(0) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherBuffer" (
    "userId" TEXT NOT NULL,
    "buffer" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "VoucherBuffer_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "VoucherLog" (
    "id" TEXT NOT NULL,
    "loggedFor" TEXT,
    "usedAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "description" VARCHAR(120) NOT NULL,
    "semesterId" INTEGER NOT NULL,

    CONSTRAINT "VoucherLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkLog" (
    "id" TEXT NOT NULL,
    "loggedBy" TEXT,
    "loggedFor" TEXT,
    "workedAt" TIMESTAMP(0),
    "createdAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "duration" DOUBLE PRECISION,
    "description" VARCHAR(120),
    "semesterId" INTEGER NOT NULL,
    "workGroup" TEXT,

    CONSTRAINT "WorkLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMembership" (
    "id" SERIAL NOT NULL,
    "lifetime" BOOLEAN NOT NULL DEFAULT false,
    "honorary" BOOLEAN NOT NULL DEFAULT false,
    "date_joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "seller_id" TEXT NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "user_id" VARCHAR(50),
    "uio_username" VARCHAR(15),
    "date_lifetime" TIMESTAMP(3),
    "comment" TEXT,
    "last_edited_by_id" INTEGER,

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" INTEGER NOT NULL,
    "semester" VARCHAR(45),
    "year" INTEGER,
    "semesterTitle" TEXT NOT NULL,
    "semesterStart" TIMESTAMP(3) NOT NULL,
    "semesterEnd" TIMESTAMP(3) NOT NULL,
    "voucherExpirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToWorkGroup" (
    "userId" TEXT NOT NULL,
    "workGroupId" TEXT NOT NULL,
    "groupLeader" BOOLEAN DEFAULT false,

    CONSTRAINT "UserToWorkGroup_pkey" PRIMARY KEY ("workGroupId","userId")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" VARCHAR(45) NOT NULL,
    "title" VARCHAR(45) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(120) NOT NULL,
    "location" VARCHAR(45),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftCafe" (
    "id" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shiftPosition" INTEGER NOT NULL,
    "comment" VARCHAR(120),
    "shiftManager" TEXT,
    "shiftWorker1" TEXT,
    "shiftWorker2" TEXT,

    CONSTRAINT "ShiftCafe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuProduct" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "price" INTEGER NOT NULL,
    "priceVolunteer" INTEGER NOT NULL,
    "glutenfree" BOOLEAN NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "category_id" INTEGER NOT NULL,
    "ordering" INTEGER,

    CONSTRAINT "MenuProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "recruitedBy" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "gid_UNIQUE" ON "WorkGroup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActivateToken_token_key" ON "ActivateToken"("token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "recruitedById" FOREIGN KEY ("recruitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivateToken" ADD CONSTRAINT "ActivateToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_workLogEntryId_fkey" FOREIGN KEY ("workLogEntryId") REFERENCES "WorkLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherBuffer" ADD CONSTRAINT "VoucherBuffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherLog" ADD CONSTRAINT "VoucherLog_Semester" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "VoucherLog" ADD CONSTRAINT "loggedFor0" FOREIGN KEY ("loggedFor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "WorkLog_Semester" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "loggedBy" FOREIGN KEY ("loggedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "loggedFor" FOREIGN KEY ("loggedFor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "workLog" FOREIGN KEY ("workGroup") REFERENCES "WorkGroup"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_semester" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserToWorkGroup" ADD CONSTRAINT "UserToWorkGroup_A_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToWorkGroup" ADD CONSTRAINT "UserToWorkGroup_B_fkey" FOREIGN KEY ("workGroupId") REFERENCES "WorkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftCafe" ADD CONSTRAINT "ShiftCafe_shiftManager_User" FOREIGN KEY ("shiftManager") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ShiftCafe" ADD CONSTRAINT "ShiftCafe_shiftWorker1_User" FOREIGN KEY ("shiftWorker1") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ShiftCafe" ADD CONSTRAINT "ShiftCafe_shiftWorker2_User" FOREIGN KEY ("shiftWorker2") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MenuProduct" ADD CONSTRAINT "MenuProduct_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

