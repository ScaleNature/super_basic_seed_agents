import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Blend, Download, FileCheck } from "lucide-react";

export function QuickActionsPanel() {
  const actions = [
    {
      icon: RefreshCw,
      label: "Sync Google Drive",
      description: "Update from all sources",
      onClick: () => console.log("Sync initiated"),
      testId: "sync-drive"
    },
    {
      icon: Blend,
      label: "Run Synthesis",
      description: "Process aggregated data",
      onClick: () => console.log("Synthesis started"),
      testId: "run-synthesis"
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download CSV/JSON",
      onClick: () => console.log("Export initiated"),
      testId: "export-data"
    },
    {
      icon: FileCheck,
      label: "Validation Report",
      description: "View data quality",
      onClick: () => console.log("Opening validation report"),
      testId: "validation-report"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.testId}
              variant="outline"
              className="h-auto flex-col items-start p-4 gap-2"
              onClick={action.onClick}
              data-testid={`button-${action.testId}`}
            >
              <action.icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
