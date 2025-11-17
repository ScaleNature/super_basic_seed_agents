import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, RefreshCw } from "lucide-react";
import { useState } from "react";

interface DataSourceCardProps {
  name: string;
  status: "synced" | "syncing" | "error";
  lastSync: string;
  recordCount: number;
  folderId: string;
}

const statusConfig = {
  synced: { label: "Synced", variant: "default" as const },
  syncing: { label: "Syncing", variant: "secondary" as const },
  error: { label: "Error", variant: "destructive" as const },
};

export function DataSourceCard({ name, status, lastSync, recordCount, folderId }: DataSourceCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const currentStatus = isSyncing ? "syncing" : status;
  const config = statusConfig[currentStatus];

  const handleSync = () => {
    console.log(`Syncing data source: ${folderId}`);
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <Card data-testid={`card-datasource-${folderId}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FolderOpen className="w-5 h-5 text-primary flex-shrink-0" />
          <CardTitle className="text-base truncate">{name}</CardTitle>
        </div>
        <Badge variant={config.variant} data-testid={`badge-status-${folderId}`}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Records:</span>
          <span className="font-medium" data-testid={`text-records-${folderId}`}>{recordCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Sync:</span>
          <span className="font-medium" data-testid={`text-lastsync-${folderId}`}>{lastSync}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSync}
          disabled={isSyncing}
          data-testid={`button-sync-${folderId}`}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
