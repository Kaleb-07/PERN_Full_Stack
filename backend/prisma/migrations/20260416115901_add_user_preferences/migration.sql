-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoPlayPromos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriptionTier" TEXT NOT NULL DEFAULT 'Free',
ADD COLUMN     "themePreference" TEXT NOT NULL DEFAULT 'dark';
