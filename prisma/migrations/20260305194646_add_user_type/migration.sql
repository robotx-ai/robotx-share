-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'PROVIDER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'CUSTOMER';
