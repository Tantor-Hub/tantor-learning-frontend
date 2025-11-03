import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

export function CatalogueSkeleton() {
  return (
    <div className="overflow-x-auto my-4 rounded-md bg-white border">
      <div className="min-w-[1000px]">
        <div className="p-6">
          <Skeleton height="1.5rem" width="250px" className="mb-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton width="100px" />
                </TableHead>
                <TableHead>
                  <Skeleton width="150px" />
                </TableHead>
                <TableHead>
                  <Skeleton width="80px" />
                </TableHead>
                <TableHead>
                  <Skeleton width="120px" />
                </TableHead>
                <TableHead className="w-[200px]">
                  <Skeleton width="100px" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 4 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width="200px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="300px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="150px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="150px" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
