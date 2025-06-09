import React, { ReactNode, MouseEventHandler } from "react";

// Props for Table
interface TableProps {
  children: ReactNode;
  className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

// ✅ Props for TableCell (updated with onClick)
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
  colSpan?: number;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// ✅ TableCell Component updated with onClick and colSpan
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  onClick,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={className} onClick={onClick} colSpan={colSpan}>
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
