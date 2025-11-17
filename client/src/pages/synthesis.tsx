import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Settings, FileText } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Synthesis() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunSynthesis = () => {
    console.log("Running synthesis process");
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Synthesis Tools</h1>
          <p className="text-muted-foreground">Aggregate and process data from multiple sources</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Synthesis Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={isProcessing ? "secondary" : "default"} data-testid="badge-synthesis-status">
                      {isProcessing ? "Processing" : "Ready"}
                    </Badge>
                  </div>
                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} data-testid="progress-synthesis" />
                      <p className="text-sm text-muted-foreground">Processing: {progress}%</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h3 className="font-medium">Process Steps</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Collect data from all connected sources
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Apply column mappings and transformations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Merge duplicate entries
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Generate aggregated dataset
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={handleRunSynthesis}
                  disabled={isProcessing}
                  data-testid="button-run-synthesis"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Run Synthesis"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" data-testid="button-mapping-rules">
                  <Settings className="w-4 h-4 mr-2" />
                  Mapping Rules
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-merge-settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Merge Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-view-logs">
                  <FileText className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Last Run</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">Nov 17, 13:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Records:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">2m 34s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
