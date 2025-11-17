import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  timestamp: string;
  action: string;
  status: "success" | "error" | "pending";
  recordsAffected: number;
}

interface ActivityTableProps {
  activities: Activity[];
}

const statusConfig = {
  success: { label: "Success", variant: "default" as const },
  error: { label: "Error", variant: "destructive" as const },
  pending: { label: "Pending", variant: "secondary" as const },
};

export function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">Action</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No recent activity
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => {
                  const config = statusConfig[activity.status];
                  return (
                    <TableRow key={activity.id} data-testid={`row-activity-${activity.id}`}>
                      <TableCell className="text-sm font-mono">{activity.timestamp}</TableCell>
                      <TableCell className="text-sm">{activity.action}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant} data-testid={`badge-status-${activity.id}`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium" data-testid={`text-records-${activity.id}`}>
                        {activity.recordsAffected.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
