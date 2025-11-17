import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataSourceCard } from "@/components/DataSourceCard";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function DataSources() {
  const [searchQuery, setSearchQuery] = useState("");

  const dataSources = [
    { name: "Seed Database 2024", status: "synced" as const, lastSync: "2 hours ago", recordCount: 1247, folderId: "folder-1" },
    { name: "Species Collection", status: "synced" as const, lastSync: "5 hours ago", recordCount: 892, folderId: "folder-2" },
    { name: "Botanical Archive", status: "error" as const, lastSync: "2 days ago", recordCount: 708, folderId: "folder-3" },
    { name: "Heritage Seeds DB", status: "synced" as const, lastSync: "1 day ago", recordCount: 543, folderId: "folder-4" },
    { name: "Research Data 2023", status: "syncing" as const, lastSync: "Just now", recordCount: 1156, folderId: "folder-5" },
  ];

  const filteredSources = dataSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Data Sources</h1>
            <p className="text-muted-foreground">Manage your Google Drive folder connections</p>
          </div>
          <Button data-testid="button-add-source">
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Connected Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search data sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-sources"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSources.map((source) => (
                <DataSourceCard key={source.folderId} {...source} />
              ))}
            </div>

            {filteredSources.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No data sources found matching "{searchQuery}"
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
