import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-5 md:gap-20 p-6 rounded-xl border justify-center">
        {/* Left Side - Avatar and Actions */}
        <div className="flex flex-col items-center w-full md:w-fit">
          {/* Avatar Skeleton */}
          <Skeleton className="w-40 h-40 rounded-full" />

          {/* Name Skeleton */}
          <Skeleton className="mt-4 h-5 w-32" />

          <div className="flex flex-col gap-4 mt-2 w-full md:w-auto">
            {/* Email Skeleton */}
            <Skeleton className="h-4 w-48" />

            {/* Update Profile Button Skeleton */}
            <Skeleton className="h-10 w-full md:w-48 rounded-md" />

            {/* QR Scanner Button Skeleton (for students) */}
            <Skeleton className="h-10 w-full md:w-48 rounded-md" />
          </div>
        </div>

        {/* Right Side - Profile Information */}
        <div className="flex flex-col gap-4 text-sm md:w-fit mx-auto md:mx-0 w-full">
          {/* Email Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <div className="space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Other Details Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <div className="space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
