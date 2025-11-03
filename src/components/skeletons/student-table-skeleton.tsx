import React from "react";

// Skeleton component for reusable shimmer effect
const Skeleton = ({ className = "", width = "100%", height = "1rem" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ width, height }} />
);

// Table Components (copied from student-table.tsx for consistency)
const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
  </div>
);

const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;

const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;

const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <tr className={`border-b transition-colors hover:bg-gray-100/50 ${className}`}>{children}</tr>
);

const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 ${className}`}
  >
    {children}
  </th>
);

const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;

// Skeleton for avatar
const AvatarSkeleton = () => <Skeleton width="40px" height="40px" className="rounded-full" />;

// Skeleton row
const SkeletonRow = ({ columns }: { columns: string[] }) => (
  <TableRow>
    {columns.map((column, index) => (
      <TableCell key={column}>
        {index === 0 ? (
          <AvatarSkeleton />
        ) : (
          <Skeleton
            width={column === "Email" ? "200px" : column === "Adresse" ? "150px" : "100px"}
          />
        )}
      </TableCell>
    ))}
  </TableRow>
);

export function StudentTableSkeleton() {
  // Columns based on the internData structure
  const columns = [
    "Nom complet",
    "Email",
    "Adresse",
    "Pays",
    "Ville",
    "Date de naissance",
    "Formation",
    "Session",
    "Statut",
  ];

  return (
    <div className="my-4 border border-border rounded">
      <Skeleton width="300px" height="1.5rem" className="mx-auto my-2" />
      <div className="w-full space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-y">
              {columns.map((column) => (
                <TableHead key={column} className="text-foreground">
                  <Skeleton width="100px" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }, (_, index) => (
              <SkeletonRow key={index} columns={columns} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
