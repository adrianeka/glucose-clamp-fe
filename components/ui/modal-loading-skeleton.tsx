import { Skeleton } from "@/components/ui/skeleton";

interface ModalLoadingSkeletonProps {
  rows?: number;
}

export default function ModalLoadingSkeleton({
  rows = 8,
}: ModalLoadingSkeletonProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-[#F1F9FA]">
          <tr>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-16" />
            </th>

            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-12" />
            </th>

            <th className="px-4 py-3 text-left">
              <Skeleton className="h-4 w-14" />
            </th>

            <th className="px-4 py-3 text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </th>

            <th className="px-4 py-3 text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
            </th>

            <th className="px-4 py-3 text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map(
            (_, index) => (
              <tr
                key={index}
                className="border-t"
              >
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>

                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-12" />
                </td>

                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}