import { ActivityTable } from '../ActivityTable';

export default function ActivityTableExample() {
  const mockActivities = [
    { id: "1", timestamp: "2024-11-17 14:23", action: "Sync Google Drive sources", status: "success" as const, recordsAffected: 234 },
    { id: "2", timestamp: "2024-11-17 13:45", action: "Run synthesis process", status: "success" as const, recordsAffected: 1847 },
    { id: "3", timestamp: "2024-11-17 12:10", action: "Export aggregated data", status: "success" as const, recordsAffected: 2847 },
    { id: "4", timestamp: "2024-11-17 11:30", action: "Validation check", status: "error" as const, recordsAffected: 12 },
    { id: "5", timestamp: "2024-11-17 10:15", action: "Column mapping update", status: "success" as const, recordsAffected: 156 },
  ];

  return (
    <div className="p-6">
      <ActivityTable activities={mockActivities} />
    </div>
  );
}
