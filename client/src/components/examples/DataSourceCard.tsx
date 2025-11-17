import { DataSourceCard } from '../DataSourceCard';

export default function DataSourceCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      <DataSourceCard
        name="Seed Database 2024"
        status="synced"
        lastSync="2 hours ago"
        recordCount={1247}
        folderId="folder-1"
      />
      <DataSourceCard
        name="Species Collection"
        status="synced"
        lastSync="5 hours ago"
        recordCount={892}
        folderId="folder-2"
      />
      <DataSourceCard
        name="Botanical Archive"
        status="error"
        lastSync="2 days ago"
        recordCount={708}
        folderId="folder-3"
      />
    </div>
  );
}
