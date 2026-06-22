"use client";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F8FA]">
            {Array.from({
              length: columns,
            }).map((_, index) => (
              <th
                key={index}
                className="px-4 py-4"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map(
            (_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-[#E2E4E6]"
              >
                {Array.from({
                  length: columns,
                }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-4"
                  >
                    <div className="h-4 w-full max-w-30 animate-pulse rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}