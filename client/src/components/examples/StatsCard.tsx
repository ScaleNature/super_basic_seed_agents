import { StatsCard } from '../StatsCard';
import { Database, FolderOpen, AlertCircle, Clock } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      <StatsCard
        title="Total Species"
        value="2,847"
        icon={Database}
        description="Aggregated records"
      />
      <StatsCard
        title="Data Sources"
        value="5"
        icon={FolderOpen}
        description="Active connections"
      />
      <StatsCard
        title="Validation Errors"
        value="12"
        icon={AlertCircle}
        description="Require attention"
      />
      <StatsCard
        title="Last Sync"
        value="2h ago"
        icon={Clock}
        description="Auto-sync enabled"
      />
    </div>
  );
}
