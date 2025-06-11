import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

// Define the intern data structure type
export interface InternData {
  [key: string]: string | number;
}

// Props interface for the InternTable component
interface InternTableProps {
  data: InternData[];
  itemsPerPage?: number;
  title?: string;
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

// Checkbox Component
interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  className = "",
}) => (
  <div
    className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-gray-300 shadow ${checked ? "bg-blue-600 border-blue-600" : "bg-white"} ${className}`}
  >
    {checked && <Check className="h-3 w-3 text-white" />}
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className="absolute h-full w-full opacity-0 cursor-pointer"
    />
  </div>
);

// Pagination Components
const Pagination: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <nav className={`mx-auto flex w-full justify-center ${className}`} aria-label="pagination">
    {children}
  </nav>
);

const PaginationContent: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <div className={`flex flex-row items-center gap-1 ${className}`}>{children}</div>
);

const PaginationItem: React.FC<ComponentWithChildren> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

interface PaginationLinkProps extends ComponentWithChildren {
  isActive?: boolean;
  onClick?: () => void;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({
  children,
  isActive = false,
  className = "",
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
    } ${className}`}
  >
    {children}
  </button>
);

interface PaginationControlProps {
  className?: string;
  onClick?: () => void;
}

const PaginationPrevious: React.FC<PaginationControlProps> = ({ className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`flex h-8 items-center gap-1 rounded-md px-2 text-sm ${className}`}
    aria-label="Go to previous page"
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </button>
);

const PaginationNext: React.FC<PaginationControlProps> = ({ className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`flex h-8 items-center gap-1 rounded-md px-2 text-sm ${className}`}
    aria-label="Go to next page"
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </button>
);

// Main InternTable Component
export function StudentTable({ data = [], itemsPerPage = 5, title }: InternTableProps) {
  const [page, setPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const maxPage = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Column headers - extract from first data item or use default
  const columns =
    data.length > 0
      ? Object.keys(data[0])
      : [
          "Numéro du stagiaire",
          "prénom",
          "nom",
          "email",
          "Téléphone",
          "Date de naissance",
          "Adresse",
        ];

  const handleSelectAll = (checked: boolean): void => {
    setAllSelected(checked);
    const newSelected: Record<number, boolean> = {};
    if (checked) {
      currentData.forEach((_, index) => {
        newSelected[(page - 1) * itemsPerPage + index] = true;
      });
    }
    setSelectedRows(newSelected);
  };

  const handleSelectRow = (index: number, checked: boolean): void => {
    setSelectedRows((prev) => ({
      ...prev,
      [(page - 1) * itemsPerPage + index]: checked,
    }));

    // Check if all rows on current page are selected
    const allCurrentSelected = currentData.every((_, idx) =>
      idx === index ? checked : selectedRows[(page - 1) * itemsPerPage + idx]
    );
    setAllSelected(allCurrentSelected);
  };

  return (
    <div className="my-4 border border-border rounded-md">
      <p className="text-xl font-semibold text-center text-primary py-2">{title}</p>
      <div className="w-full space-y-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted border-y">
              <TableHead className="w-12 text-foreground">
                <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column} className="text-foreground">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Checkbox
                    checked={!!selectedRows[(page - 1) * itemsPerPage + rowIndex]}
                    onCheckedChange={(checked) => handleSelectRow(rowIndex, checked)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {maxPage > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: maxPage }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => setPage(i + 1)} isActive={page === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className={page === maxPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
