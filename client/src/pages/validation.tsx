import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ValidationError {
  id: string;
  recordId: string;
  field: string;
  errorType: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export default function Validation() {
  const [searchQuery, setSearchQuery] = useState("");

  const validationErrors: ValidationError[] = [
    { id: "1", recordId: "SP-1247", field: "scientific_name", errorType: "Missing Value", description: "Required field is empty", severity: "high" },
    { id: "2", recordId: "SP-892", field: "seed_count", errorType: "Invalid Format", description: "Non-numeric value in numeric field", severity: "medium" },
    { id: "3", recordId: "SP-2103", field: "collection_date", errorType: "Invalid Date", description: "Date format does not match YYYY-MM-DD", severity: "medium" },
    { id: "4", recordId: "SP-445", field: "latin_name", errorType: "Duplicate Entry", description: "Record with same latin name exists", severity: "low" },
    { id: "5", recordId: "SP-1876", field: "habitat", errorType: "Missing Value", description: "Required field is empty", severity: "high" },
  ];

  const severityConfig = {
    high: { label: "High", variant: "destructive" as const },
    medium: { label: "Medium", variant: "secondary" as const },
    low: { label: "Low", variant: "default" as const },
  };

  const filteredErrors = validationErrors.filter((error) =>
    error.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    error.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
    error.errorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Validation Center</h1>
          <p className="text-muted-foreground">Review and fix data quality issues</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Errors</p>
                  <p className="text-2xl font-semibold" data-testid="text-total-errors">12</p>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valid Records</p>
                  <p className="text-2xl font-semibold" data-testid="text-valid-records">2,835</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Validation Rate</p>
                  <p className="text-2xl font-semibold" data-testid="text-validation-rate">99.6%</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Validation Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search errors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-errors"
                />
              </div>
              <Button variant="outline" data-testid="button-export-errors">Export Report</Button>
              <Button data-testid="button-run-validation">Run Validation</Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">Record ID</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">Field</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">Error Type</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">Description</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wide">Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErrors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No validation errors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredErrors.map((error) => (
                      <TableRow key={error.id} data-testid={`row-error-${error.id}`}>
                        <TableCell className="font-mono text-sm">{error.recordId}</TableCell>
                        <TableCell className="text-sm">{error.field}</TableCell>
                        <TableCell className="text-sm">{error.errorType}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{error.description}</TableCell>
                        <TableCell>
                          <Badge variant={severityConfig[error.severity].variant} data-testid={`badge-severity-${error.id}`}>
                            {severityConfig[error.severity].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
