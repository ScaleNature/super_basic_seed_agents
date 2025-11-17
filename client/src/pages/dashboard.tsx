import { StatsCard } from "@/components/StatsCard";
import { DataSourceCard } from "@/components/DataSourceCard";
import { ActivityTable } from "@/components/ActivityTable";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { Database, FolderOpen, AlertCircle, Clock } from "lucide-react";

export default function Dashboard() {
  const mockActivities = [
    { id: "1", timestamp: "2024-11-17 14:23", action: "Sync Google Drive sources", status: "success" as const, recordsAffected: 234 },
    { id: "2", timestamp: "2024-11-17 13:45", action: "Run synthesis process", status: "success" as const, recordsAffected: 1847 },
    { id: "3", timestamp: "2024-11-17 12:10", action: "Export aggregated data", status: "success" as const, recordsAffected: 2847 },
    { id: "4", timestamp: "2024-11-17 11:30", action: "Validation check", status: "error" as const, recordsAffected: 12 },
    { id: "5", timestamp: "2024-11-17 10:15", action: "Column mapping update", status: "success" as const, recordsAffected: 156 },
    { id: "6", timestamp: "2024-11-17 09:45", action: "Data source connection", status: "success" as const, recordsAffected: 0 },
    { id: "7", timestamp: "2024-11-17 08:20", action: "Batch validation", status: "success" as const, recordsAffected: 2847 },
  ];

  const dataSources = [
    { name: "Seed Database 2024", status: "synced" as const, lastSync: "2 hours ago", recordCount: 1247, folderId: "folder-1" },
    { name: "Species Collection", status: "synced" as const, lastSync: "5 hours ago", recordCount: 892, folderId: "folder-2" },
    { name: "Botanical Archive", status: "error" as const, lastSync: "2 days ago", recordCount: 708, folderId: "folder-3" },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your seed and species data aggregation</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Species" value="2,847" icon={Database} description="Aggregated records" />
          <StatsCard title="Data Sources" value="5" icon={FolderOpen} description="Active connections" />
          <StatsCard title="Validation Errors" value="12" icon={AlertCircle} description="Require attention" />
          <StatsCard title="Last Sync" value="2h ago" icon={Clock} description="Auto-sync enabled" />
        </div>

        <QuickActionsPanel />

        <div>
          <h2 className="text-xl font-medium mb-4">Data Source Status</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataSources.map((source) => (
              <DataSourceCard key={source.folderId} {...source} />
            ))}
          </div>
        </div>

        <ActivityTable activities={mockActivities} />
      </div>
    </div>
  );
}
