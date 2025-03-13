import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { GraduationCap, Users, MapPin, Calendar } from "lucide-react";
import convertTimestampToDate from "@/utils/convertTimestampToDate";

interface SessionPreviewProps {
  open: boolean;
  onClose: () => void;
  session: {
    id: string;
    academicYear: string;
    graduationDate: Date;
    venue: string;
    maxAttendees: number;
    status: string;
    totalGraduates: number;
  };
}

export default function SessionPreview({
  open,
  onClose,
  session,
}: SessionPreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] sm:max-h-[500px]"
        style={{
          overflow: "scroll",
        }}
      >
        <DialogHeader>
          <DialogTitle>Graduation Session Details</DialogTitle>
          <DialogDescription>
            Comprehensive overview of the graduation session
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Academic Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{session.acc_yr_title}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Total Graduates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {session.maximum_attendees}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Venue Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">
                    {session.graduation_venue}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">
                    {session.maxAttendees} attendees
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {format(
                      convertTimestampToDate(parseInt(session.graduation_date)),
                      "PPP"
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Session Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-500"
                  >
                    {session.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Venue Utilization
                  </span>
                  <span className="font-medium">
                    {Math.round(
                      (session.maximum_attendees / session.maximum_attendees) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>Print Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
