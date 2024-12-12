import { LoadingSpinner } from "./LoadingSpinner";

// src/components/ui/PageLoading.tsx
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}