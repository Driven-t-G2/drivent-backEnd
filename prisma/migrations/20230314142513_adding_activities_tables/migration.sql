-- CreateTable
CREATE TABLE "Dates" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "duration" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chosen_Activities" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chosen_Activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "Dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chosen_Activities" ADD CONSTRAINT "Chosen_Activities_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chosen_Activities" ADD CONSTRAINT "Chosen_Activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
