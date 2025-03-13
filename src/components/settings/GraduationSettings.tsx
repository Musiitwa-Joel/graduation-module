import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Save,
  Settings,
  Plus,
  History,
  Eye,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import SessionPreview from "./SessionPreview";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SAVE_GRADUATION_SESSION } from "@/gql/mutations";
import {
  LOAD_ACTIVE_GRADUATION_SESSION,
  LOAD_GRADUATION_SESSIONS,
} from "@/gql/queries";
import convertTimestampToDate from "@/utils/convertTimestampToDate";

const LOAD_REQS = gql`
  query loadReqs {
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

// Mock graduation sessions history
const graduationSessions = [
  {
    id: "1",
    academicYear: "2023/2024",
    graduationDate: new Date(2024, 5, 15),
    venue: "University Grand Hall",
    maxAttendees: 1200,
    status: "Completed",
    totalGraduates: 856,
  },
  {
    id: "2",
    academicYear: "2022/2023",
    graduationDate: new Date(2023, 5, 16),
    venue: "University Grand Hall",
    maxAttendees: 1000,
    status: "Completed",
    totalGraduates: 789,
  },
];

export default function GraduationSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const { error, loading, data } = useQuery(LOAD_REQS);
  const [gradSessions, setGradSessions] = useState([]);
  const [
    saveGraduationSession,
    { error: saveErr, loading: savingGraduationSession },
  ] = useMutation(SAVE_GRADUATION_SESSION, {
    refetchQueries: ["graduation_sessions"],
  });
  const {
    error: loadErr,
    loading: loadingSessions,
    data: loadRes,
  } = useQuery(LOAD_GRADUATION_SESSIONS);

  const {
    error: loadActiveErr,
    loading: loadingActiveSession,
    data: activeSessionRes,
  } = useQuery(LOAD_ACTIVE_GRADUATION_SESSION);

  useEffect(() => {
    if (loadRes) {
      setGradSessions(loadRes.graduation_sessions);
    }
  }, [loadRes]);

  const [settings, setSettings] = useState({
    graduationDate: "2025-06-15",
    clearanceStartDate: "2025-03-01",
    clearanceDeadline: "2025-05-15",
    academicYear: "2024/2025",
    graduatingClass: "Class of 2025",
    allowLateSubmissions: true,
    requireDocumentVerification: true,
    automaticClearance: false,
    minimumGPA: "2.0",
    ceremonyVenue: "University Grand Hall",
    maxAttendees: "1200",
  });

  const [newSession, setNewSession] = useState({
    academicYear: "",
    graduationDate: "",
    clearanceStartDate: "",
    clearanceDeadline: "",
    ceremonyVenue: "",
    maxAttendees: "",
    minimumGPA: "2.0",
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching academic years",
        description: error.message,
      });
    }

    if (saveErr) {
      toast({
        variant: "destructive",
        title: "Error saving new session",
        description: saveErr.message,
      });
    }

    if (loadErr) {
      toast({
        variant: "destructive",
        title: "Error loading sessions",
        description: loadErr.message,
      });
    }

    if (loadActiveErr) {
      toast({
        variant: "destructive",
        title: "Error loading active session",
        description: loadActiveErr.message,
      });
    }
  }, [error, saveErr, loadErr, loadActiveErr]);

  // console.log("activeSessionRes", activeSessionRes);

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Graduation settings have been updated successfully.",
      });
    }, 1000);
  };

  const handleCreateSession = async () => {
    // console.log("newSession", newSession);

    const payload = {
      payload: {
        id: newSession?.id ? newSession?.id : null,
        acc_yr_id: newSession.academicYear,
        clearance_deadline: newSession.clearanceDeadline,
        clearance_start_date: newSession.clearanceStartDate,
        graduation_date: newSession.graduationDate,
        graduation_venue: newSession.ceremonyVenue,
        maximum_attendees: newSession.maxAttendees,
      },
    };

    const res = await saveGraduationSession({
      variables: payload,
    });

    // console.log("res", res.data);

    setShowNewSession(false);

    setNewSession({
      academicYear: "",
      graduationDate: "",
      clearanceStartDate: "",
      clearanceDeadline: "",
      ceremonyVenue: "",
      maxAttendees: "",
      minimumGPA: "2.0",
    });

    toast({
      title: "Graduation Session Created",
      description: res.data.saveGraduationSession.message,
    });
  };

  const handleEditSession = async (session: any) => {
    // console.log("newSession", newSession);
    setShowNewSession(true);

    setNewSession({
      id: session.id,
      academicYear: session.acc_yr_id,
      graduationDate: convertTimestampToDate(parseInt(session.graduation_date)),
      clearanceStartDate: convertTimestampToDate(
        parseInt(session.clearance_start_date)
      ),
      clearanceDeadline: convertTimestampToDate(
        parseInt(session.clearance_deadline)
      ),
      ceremonyVenue: session.graduation_venue,
      maxAttendees: session.maximum_attendees,
      minimumGPA: "2.0",
    });

    // const payload = {
    //   payload: {
    //     id: null,
    //     acc_yr_id: newSession.academicYear,
    //     clearance_deadline: newSession.clearanceDeadline,
    //     clearance_start_date: newSession.clearanceStartDate,
    //     graduation_date: newSession.graduationDate,
    //     graduation_venue: newSession.ceremonyVenue,
    //     maximum_attendees: newSession.maxAttendees,
    //   },
    // };

    // const res = await saveGraduationSession({
    //   variables: payload,
    // });

    // // console.log("res", res.data);

    // setShowNewSession(false);

    // toast({
    //   title: "Graduation Session Created",
    //   description: res.data.saveGraduationSession.message,
    // });
  };

  const handlePreviewSession = (session: any) => {
    setSelectedSession(session);
    setShowPreview(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Graduation Settings
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowNewSession(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Graduation Session
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <Clock className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Session</TabsTrigger>
          {/* <TabsTrigger value="configuration">Configuration</TabsTrigger> */}
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Current Session
                </CardTitle>
                <CardDescription>
                  Active graduation session details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <div className="font-medium">
                    {activeSessionRes
                      ? activeSessionRes?.active_graduation_session.acc_yr_title
                      : ""}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <div className="font-medium">
                    {activeSessionRes
                      ? format(
                          new Date(
                            convertTimestampToDate(
                              parseInt(
                                activeSessionRes?.active_graduation_session
                                  .graduation_date
                              )
                            )
                          ),
                          "MMMM d, yyyy"
                        )
                      : ""}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <div className="font-medium">
                    {" "}
                    {activeSessionRes
                      ? activeSessionRes?.active_graduation_session
                          .graduation_venue
                      : ""}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Maximum Attendees</Label>
                  <div className="font-medium">
                    {" "}
                    {activeSessionRes
                      ? activeSessionRes?.active_graduation_session
                          .maximum_attendees
                      : ""}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Important Dates
                </CardTitle>
                <CardDescription>Key deadlines and dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clearance Start</Label>
                  <div className="font-medium">
                    {activeSessionRes
                      ? format(
                          new Date(
                            convertTimestampToDate(
                              parseInt(
                                activeSessionRes?.active_graduation_session
                                  .clearance_start_date
                              )
                            )
                          ),
                          "MMMM d, yyyy"
                        )
                      : ""}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Clearance Deadline</Label>
                  <div className="font-medium">
                    {activeSessionRes
                      ? format(
                          new Date(
                            convertTimestampToDate(
                              parseInt(
                                activeSessionRes?.active_graduation_session
                                  .clearance_deadline
                              )
                            )
                          ),
                          "MMMM d, yyyy"
                        )
                      : ""}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Requirements
                </CardTitle>
                <CardDescription>Graduation requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum GPA</Label>
                  <div className="font-medium">{settings.minimumGPA}</div>
                </div>
                <div className="space-y-2">
                  <Label>Document Verification</Label>
                  <div className="font-medium">
                    {settings.requireDocumentVerification
                      ? "Required"
                      : "Optional"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
                <CardDescription>
                  Set key dates for the graduation process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="graduationDate">
                    Graduation Ceremony Date
                  </Label>
                  <Input
                    id="graduationDate"
                    type="date"
                    value={settings.graduationDate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        graduationDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clearanceStartDate">
                    Clearance Process Start Date
                  </Label>
                  <Input
                    id="clearanceStartDate"
                    type="date"
                    value={settings.clearanceStartDate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        clearanceStartDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clearanceDeadline">Clearance Deadline</Label>
                  <Input
                    id="clearanceDeadline"
                    type="date"
                    value={settings.clearanceDeadline}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        clearanceDeadline: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Graduation Class
                </CardTitle>
                <CardDescription>
                  Configure graduation class settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={settings.academicYear}
                    onValueChange={(value) =>
                      setSettings({ ...settings, academicYear: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2023/2024">2023/2024</SelectItem>
                      <SelectItem value="2022/2023">2022/2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduatingClass">Graduating Class</Label>
                  <Select
                    value={settings.graduatingClass}
                    onValueChange={(value) =>
                      setSettings({ ...settings, graduatingClass: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select graduating class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class of 2025">
                        Class of 2025
                      </SelectItem>
                      <SelectItem value="Class of 2024">
                        Class of 2024
                      </SelectItem>
                      <SelectItem value="Class of 2023">
                        Class of 2023
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumGPA">Minimum GPA Requirement</Label>
                  <Input
                    id="minimumGPA"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={settings.minimumGPA}
                    onChange={(e) =>
                      setSettings({ ...settings, minimumGPA: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Ceremony Settings
                </CardTitle>
                <CardDescription>
                  Configure ceremony and venue details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ceremonyVenue">Ceremony Venue</Label>
                  <Input
                    id="ceremonyVenue"
                    value={settings.ceremonyVenue}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        ceremonyVenue: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={settings.maxAttendees}
                    onChange={(e) =>
                      setSettings({ ...settings, maxAttendees: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Clearance Rules
                </CardTitle>
                <CardDescription>
                  Set rules for the clearance process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Late Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept clearance submissions after deadline
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowLateSubmissions}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        allowLateSubmissions: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require verification of submitted documents
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireDocumentVerification}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        requireDocumentVerification: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Clearance</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-clear students meeting all requirements
                    </p>
                  </div>
                  <Switch
                    checked={settings.automaticClearance}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, automaticClearance: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Graduation Sessions History</CardTitle>
              <CardDescription>
                Past graduation sessions and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Graduation Date</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Total Graduates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {session.acc_yr_title}
                        </TableCell>
                        <TableCell>
                          {format(
                            convertTimestampToDate(
                              parseInt(session.graduation_date)
                            ),
                            "MMMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell>{session.graduation_venue}</TableCell>
                        <TableCell>{session.maximum_attendees}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                            {session.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewSession(session)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Graduation Session Dialog */}
      <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Graduation Session</DialogTitle>
            <DialogDescription>
              Set up a new graduation session for the upcoming academic year
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newAcademicYear">Academic Year</Label>
                <Select
                  value={newSession.academicYear}
                  onValueChange={(value) =>
                    setNewSession({ ...newSession, academicYear: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {data ? (
                      data.acc_yrs.map((acc_yr: any) => (
                        <SelectItem value={acc_yr.id}>
                          {acc_yr.acc_yr_title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="_">_</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newGraduationDate">Graduation Date</Label>
                <Input
                  id="newGraduationDate"
                  type="date"
                  value={newSession.graduationDate}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      graduationDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newClearanceStart">Clearance Start Date</Label>
                <Input
                  id="newClearanceStart"
                  type="date"
                  value={newSession.clearanceStartDate}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      clearanceStartDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newClearanceDeadline">Clearance Deadline</Label>
                <Input
                  id="newClearanceDeadline"
                  type="date"
                  value={newSession.clearanceDeadline}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      clearanceDeadline: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newVenue">Ceremony Venue</Label>
                <Input
                  id="newVenue"
                  value={newSession.ceremonyVenue}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      ceremonyVenue: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMaxAttendees">Maximum Attendees</Label>
                <Input
                  id="newMaxAttendees"
                  type="number"
                  value={newSession.maxAttendees}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      maxAttendees: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSession(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={savingGraduationSession}
            >
              {savingGraduationSession ? (
                <Clock className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Preview Dialog */}
      {selectedSession && (
        <SessionPreview
          open={showPreview}
          onClose={() => setShowPreview(false)}
          session={selectedSession}
        />
      )}
    </div>
  );
}
