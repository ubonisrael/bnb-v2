import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="mt-2 h-4 w-[350px]" />
      </div>

      <div className="h-[calc(100vh-220px)] overflow-hidden rounded-lg border bg-white shadow-card">
        <div className="grid h-full grid-cols-1 md:grid-cols-3">
          <div className="border-r p-4 md:col-span-1">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="mt-1 h-3 w-[80px]" />
                    <Skeleton className="mt-2 h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:col-span-2 md:block">
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-6 w-[250px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

