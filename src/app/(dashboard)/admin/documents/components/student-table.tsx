import React from "react";
import Image from "next/image";

// Define the intern data structure type
export interface InternData {
  [key: string]: string | number;
}

// Props interface for the InternTable component
interface InternTableProps {
  data: InternData[];
  title?: string;
  baseData?: any[]; // To access full user data for avatar initials
}

// UI Component Types
type ComponentWithChildren = {
  children: React.ReactNode;
  className?: string;
};

// Table Components
const Table: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
  </div>
);

const TableHeader: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>
);

const TableBody: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>
);

const TableRow: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <tr className={`border-b transition-colors hover:bg-gray-100/50 ${className}`}>{children}</tr>
);

const TableHead: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0 ${className}`}
  >
    {children}
  </th>
);

const TableCell: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
);

// Main InternTable Component
export function StudentTable({ data = [], title, baseData = [] }: InternTableProps) {
  // Column headers - extract from first data item or use default
  const columns =
    data.length > 0
      ? Object.keys(data[0])
      : ["prénom", "nom", "email", "Téléphone", "Date de naissance", "Adresse"];

  // Show all columns including user information
  const displayColumns = columns;

  return (
    <div className="my-4 border border-border rounded">
      <p className="text-xl font-semibold text-center text-primary py-2">{title}</p>
      <div className="w-full space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-y">
              {displayColumns.map((column) => (
                <TableHead key={column} className="text-foreground">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {displayColumns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {column === "Avatar" ? (
                      baseData[rowIndex]?.user_avatar ? (
                        <Image
                          src={baseData[rowIndex].user_avatar}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {`${baseData[rowIndex]?.user_firstName?.[0] || ""}${baseData[rowIndex]?.user_lastName?.[0] || ""}`.toUpperCase()}
                        </div>
                      )
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
