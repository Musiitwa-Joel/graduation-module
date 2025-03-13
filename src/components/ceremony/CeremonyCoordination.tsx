import { useState } from "react";
import { useStudents } from "@/context/StudentContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  Flag,
  Bell,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Calendar,
  MapPin,
  Printer,
  MessageSquare,
  UserX,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Clipboard,
  ClipboardCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock ceremony data
const ceremonyData = {
  date: new Date(2025, 5, 15, 10, 0),
  venue: "University Grand Hall",
  capacity: 1200,
  registeredStudents: 850,
  confirmedAttendees: 780,
  gownsCollected: 650,
};

// Mock student attendance data
const studentAttendance = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "John Smith",
    faculty: "Engineering",
    program: "Computer Science",
    seatNumber: "A-101",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: false,
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "Sarah Johnson",
    faculty: "Business",
    program: "Marketing",
    seatNumber: "B-052",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: false,
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Michael Brown",
    faculty: "Science",
    program: "Physics",
    seatNumber: "C-023",
    gownCollected: false,
    attendance: "Pending",
    specialNeeds: false,
  },
  {
    id: "4",
    studentId: "STU004",
    studentName: "Emily Davis",
    faculty: "Arts",
    program: "English Literature",
    seatNumber: "D-115",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: true,
  },
  {
    id: "5",
    studentId: "STU005",
    studentName: "David Wilson",
    faculty: "Medicine",
    program: "Nursing",
    seatNumber: "A-205",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: false,
  },
  {
    id: "6",
    studentId: "STU006",
    studentName: "Jessica Martinez",
    faculty: "Engineering",
    program: "Civil Engineering",
    seatNumber: "B-118",
    gownCollected: false,
    attendance: "Declined",
    specialNeeds: false,
  },
  {
    id: "7",
    studentId: "STU007",
    studentName: "James Taylor",
    faculty: "Business",
    program: "Finance",
    seatNumber: "C-087",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: false,
  },
  {
    id: "8",
    studentId: "STU008",
    studentName: "Sophia Anderson",
    faculty: "Science",
    program: "Chemistry",
    seatNumber: "D-042",
    gownCollected: true,
    attendance: "Confirmed",
    specialNeeds: true,
  },
];

// Mock seating sections
const seatingSections = [
  { id: "A", name: "Section A", capacity: 300, assigned: 250 },
  { id: "B", name: "Section B", capacity: 300, assigned: 220 },
  { id: "C", name: "Section C", capacity: 300, assigned: 180 },
  { id: "D", name: "Section D", capacity: 300, assigned: 200 },
];

export default function CeremonyCoordination() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState("");
  const [selectedGownStatus, setSelectedGownStatus] = useState("");
  const [showSeatAssignment, setShowSeatAssignment] = useState(false);
  const [showSendReminders, setShowSendReminders] = useState(false);
  const [showGownCollection, setShowGownCollection] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Filter students based on search and filters
  const filteredStudents = studentAttendance.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = selectedFaculty
      ? student.faculty === selectedFaculty
      : true;
    const matchesAttendance = selectedAttendance
      ? student.attendance === selectedAttendance
      : true;
    const matchesGownStatus = selectedGownStatus
      ? (selectedGownStatus === "Collected" && student.gownCollected) ||
        (selectedGownStatus === "Not Collected" && !student.gownCollected)
      : true;

    return (
      matchesSearch && matchesFaculty && matchesAttendance && matchesGownStatus
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleSeatAssignment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSeatAssignment(false);
      toast({
        title: "Seats Assigned",
        description: `${selectedStudents.length} students have been assigned to seats.`,
      });
      setSelectedStudents([]);
    }, 1500);
  };

  const handleSendReminders = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSendReminders(false);
      toast({
        title: "Reminders Sent",
        description: `Reminders have been sent to ${selectedStudents.length} students.`,
      });
      setSelectedStudents([]);
    }, 1000);
  };

  const handleGownCollection = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowGownCollection(false);
      toast({
        title: "Gown Collection Updated",
        description: `Gown collection status updated for ${selectedStudents.length} students.`,
      });
      setSelectedStudents([]);
    }, 1000);
  };

  const handleExportAttendance = () => {
    toast({
      title: "Export Started",
      description: "Attendance list is being exported to Excel",
    });
  };

  const handlePrintSeatingChart = () => {
    toast({
      title: "Printing Started",
      description: "Seating chart is being prepared for printing",
    });
  };

  const toggleSectionExpand = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "Declined":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-500 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Declined
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const confirmedCount = studentAttendance.filter(
    (s) => s.attendance === "Confirmed"
  ).length;
  const pendingCount = studentAttendance.filter(
    (s) => s.attendance === "Pending"
  ).length;
  const declinedCount = studentAttendance.filter(
    (s) => s.attendance === "Declined"
  ).length;
  const gownCollectedCount = studentAttendance.filter(
    (s) => s.gownCollected
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Graduation Ceremony Coordination
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAttendance}>
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Button size="sm" onClick={() => setShowSendReminders(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Send Reminders
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ceremony Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(ceremonyData.date, "MMM d, yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(ceremonyData.date, "h:mm a")} at {ceremonyData.venue}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {confirmedCount}/{ceremonyData.registeredStudents}
            </div>
            <Progress
              value={(confirmedCount / ceremonyData.registeredStudents) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gowns Collected
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gownCollectedCount}/{confirmedCount}
            </div>
            <Progress
              value={(gownCollectedCount / confirmedCount) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Venue Capacity
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ceremonyData.confirmedAttendees}/{ceremonyData.capacity}
            </div>
            <Progress
              value={
                (ceremonyData.confirmedAttendees / ceremonyData.capacity) * 100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance Management</TabsTrigger>
          <TabsTrigger value="seating">Seating Arrangement</TabsTrigger>
          <TabsTrigger value="gowns">Gown Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Attendance Management</CardTitle>
              <CardDescription>
                Track and manage student attendance for the graduation ceremony
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, faculty, or program..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={selectedFaculty}
                      onValueChange={setSelectedFaculty}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedFaculty || "Faculty"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Faculties</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedAttendance}
                      onValueChange={setSelectedAttendance}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedAttendance || "Attendance"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedStudents.length > 0 && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">
                      {selectedStudents.length} students selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSeatAssignment(true)}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Assign Seats
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSendReminders(true)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedStudents.length ===
                                filteredStudents.length &&
                              filteredStudents.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Faculty/Program</TableHead>
                        <TableHead>Seat Number</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Special Needs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No students found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectStudent(student.id, !!checked)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {student.studentName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {student.studentId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{student.faculty}</span>
                                <span className="text-xs text-muted-foreground">
                                  {student.program}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{student.seatNumber}</TableCell>
                            <TableCell>
                              {getAttendanceBadge(student.attendance)}
                            </TableCell>
                            <TableCell>
                              {student.specialNeeds ? (
                                <Badge
                                  variant="outline"
                                  className="border-blue-500 text-blue-500"
                                >
                                  Yes
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">
                                  No
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Change Seat
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Bell className="mr-2 h-4 w-4" />
                                    Send Reminder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Contact Student
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-green-500">
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Mark as Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Mark as Declined
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seating" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Seating Arrangement</CardTitle>
              <CardDescription>
                Manage seating arrangements for the graduation ceremony
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Seating Sections</h3>
                    <Badge variant="outline" className="ml-2">
                      {seatingSections.reduce(
                        (acc, section) => acc + section.assigned,
                        0
                      )}
                      /
                      {seatingSections.reduce(
                        (acc, section) => acc + section.capacity,
                        0
                      )}{" "}
                      Seats Assigned
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrintSeatingChart}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print Chart
                    </Button>
                    <Button size="sm">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Layout
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seatingSections.map((section) => (
                    <Card key={section.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {section.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSectionExpand(section.id)}
                          >
                            {expandedSection === section.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <CardDescription>
                          {section.assigned}/{section.capacity} seats assigned
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <Progress
                          value={(section.assigned / section.capacity) * 100}
                          className="h-2"
                        />
                      </CardContent>
                      {expandedSection === section.id && (
                        <div className="px-6 pb-4">
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {Array.from({ length: 15 }, (_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-8 rounded-md flex items-center justify-center text-xs font-medium",
                                  i < section.assigned / 20
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {section.id}-
                                {(i + 1).toString().padStart(3, "0")}
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button size="sm" variant="outline">
                              View All Seats
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gowns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gown Collection</CardTitle>
              <CardDescription>
                Track and manage graduation gown collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name or ID..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={selectedGownStatus}
                      onValueChange={setSelectedGownStatus}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedGownStatus || "Gown Status"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Collected">Collected</SelectItem>
                        <SelectItem value="Not Collected">
                          Not Collected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Gown Collection Status: {gownCollectedCount}/
                      {confirmedCount} (
                      {Math.round((gownCollectedCount / confirmedCount) * 100)}
                      %)
                    </span>
                  </div>
                  <Button size="sm" onClick={() => setShowGownCollection(true)}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Record Collection
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Faculty/Program</TableHead>
                        <TableHead>Gown Status</TableHead>
                        <TableHead>Collection Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentAttendance.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {student.studentName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {student.studentId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{student.faculty}</span>
                              <span className="text-xs text-muted-foreground">
                                {student.program}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.gownCollected ? (
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-500 flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Collected
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-500 flex items-center gap-1"
                              >
                                <Clock className="h-3 w-3" />
                                Not Collected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {student.gownCollected
                              ? format(new Date(2025, 5, 10), "MMM d, yyyy")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={
                                student.gownCollected
                                  ? "text-red-500"
                                  : "text-green-500"
                              }
                            >
                              {student.gownCollected ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as Returned
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Collected
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Seat Assignment Dialog */}
      <Dialog open={showSeatAssignment} onOpenChange={setShowSeatAssignment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Seats</DialogTitle>
            <DialogDescription>
              Assign seats to selected students for the graduation ceremony.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="section" className="mb-2 block">
                Select Section
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="assignmentMethod" className="mb-2 block">
                Assignment Method
              </Label>
              <Select defaultValue="sequential">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="byFaculty">Group by Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Selected Students:</span>
                <span className="text-sm">{selectedStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Available Seats:</span>
                <span className="text-sm">120</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="specialNeeds" defaultChecked />
              <label
                htmlFor="specialNeeds"
                className="text-sm font-medium leading-none"
              >
                Prioritize students with special needs
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSeatAssignment(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSeatAssignment} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Assign Seats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminders Dialog */}
      <Dialog open={showSendReminders} onOpenChange={setShowSendReminders}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Reminders</DialogTitle>
            <DialogDescription>
              Send ceremony reminders to selected students.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="reminderType" className="mb-2 block">
                Reminder Type
              </Label>
              <Select defaultValue="ceremony">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceremony">Ceremony Details</SelectItem>
                  <SelectItem value="gown">Gown Collection</SelectItem>
                  <SelectItem value="attendance">
                    Attendance Confirmation
                  </SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="channel" className="mb-2 block">
                Notification Channel
              </Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="both">Both Email & SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="message" className="mb-2 block">
                Message Preview
              </Label>
              <div className="rounded-md border p-4 text-sm">
                <p>Dear Graduate,</p>
                <p className="mt-2">
                  This is a reminder about your upcoming graduation ceremony on{" "}
                  <strong>{format(ceremonyData.date, "MMMM d, yyyy")}</strong>{" "}
                  at <strong>{format(ceremonyData.date, "h:mm a")}</strong> in
                  the <strong>{ceremonyData.venue}</strong>.
                </p>
                <p className="mt-2">
                  Please arrive at least 1 hour before the ceremony starts and
                  bring your student ID.
                </p>
                <p className="mt-2">Congratulations on your achievement!</p>
                <p className="mt-2">University Graduation Office</p>
              </div>
            </div>
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Recipients:</span>
                <span className="text-sm">
                  {selectedStudents.length || "All pending students"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="scheduleReminder" />
              <label
                htmlFor="scheduleReminder"
                className="text-sm font-medium leading-none"
              >
                Schedule for later (24 hours before ceremony)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSendReminders(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendReminders} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bell className="mr-2 h-4 w-4" />
              )}
              Send Reminders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gown Collection Dialog */}
      <Dialog open={showGownCollection} onOpenChange={setShowGownCollection}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Gown Collection</DialogTitle>
            <DialogDescription>
              Update gown collection status for students.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="collectionAction" className="mb-2 block">
                Action
              </Label>
              <Select defaultValue="collect">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collect">Mark as Collected</SelectItem>
                  <SelectItem value="return">Mark as Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="collectionDate" className="mb-2 block">
                Collection Date
              </Label>
              <Input
                type="date"
                id="collectionDate"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Selected Students:</span>
                <span className="text-sm">{selectedStudents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Collection Location:
                </span>
                <span className="text-sm">Main Campus, Room 105</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sendConfirmation" defaultChecked />
              <label
                htmlFor="sendConfirmation"
                className="text-sm font-medium leading-none"
              >
                Send email confirmation to students
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGownCollection(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGownCollection} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ClipboardCheck className="mr-2 h-4 w-4" />
              )}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
