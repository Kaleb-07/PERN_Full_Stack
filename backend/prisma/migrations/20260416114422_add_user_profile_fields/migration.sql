-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "backdropUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "trailerUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "fax" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "state" TEXT;
