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
  UserPlus,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Calendar,
  MoreHorizontal,
  FileText,
  ExternalLink,
  Link as LinkIcon,
  Share2,
  Award,
  Briefcase,
  MapPin,
  Phone,
  AtSign,
  Globe,
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

// Mock alumni data
const alumniData = [
  {
    id: "1",
    studentId: "STU001",
    name: "John Smith",
    email: "john.smith@alumni.university.edu",
    phone: "+1234567890",
    faculty: "Engineering",
    program: "Computer Science",
    graduationYear: "2025",
    currentEmployer: "Tech Solutions Inc.",
    jobTitle: "Software Engineer",
    location: "New York, USA",
    linkedIn: "linkedin.com/in/johnsmith",
    isVerified: true,
    status: "Active",
    lastUpdated: new Date(2025, 4, 15),
  },
  {
    id: "2",
    studentId: "STU002",
    name: "Sarah Johnson",
    email: "sarah.johnson@alumni.university.edu",
    phone: "+1234567891",
    faculty: "Business",
    program: "Marketing",
    graduationYear: "2025",
    currentEmployer: "Global Marketing Group",
    jobTitle: "Marketing Specialist",
    location: "Chicago, USA",
    linkedIn: "linkedin.com/in/sarahjohnson",
    isVerified: true,
    status: "Active",
    lastUpdated: new Date(2025, 4, 14),
  },
  {
    id: "3",
    studentId: "STU003",
    name: "Michael Brown",
    email: "michael.brown@alumni.university.edu",
    phone: "+1234567892",
    faculty: "Science",
    program: "Physics",
    graduationYear: "2025",
    currentEmployer: "Research Labs",
    jobTitle: "Research Assistant",
    location: "Boston, USA",
    linkedIn: "linkedin.com/in/michaelbrown",
    isVerified: false,
    status: "Pending",
    lastUpdated: new Date(2025, 4, 13),
  },
  {
    id: "4",
    studentId: "STU004",
    name: "Emily Davis",
    email: "emily.davis@alumni.university.edu",
    phone: "+1234567893",
    faculty: "Arts",
    program: "English Literature",
    graduationYear: "2025",
    currentEmployer: "Publishing House",
    jobTitle: "Editor",
    location: "San Francisco, USA",
    linkedIn: "linkedin.com/in/emilydavis",
    isVerified: true,
    status: "Active",
    lastUpdated: new Date(2025, 4, 12),
  },
  {
    id: "5",
    studentId: "STU005",
    name: "David Wilson",
    email: "david.wilson@alumni.university.edu",
    phone: "+1234567894",
    faculty: "Medicine",
    program: "Nursing",
    graduationYear: "2025",
    currentEmployer: "City Hospital",
    jobTitle: "Registered Nurse",
    location: "Los Angeles, USA",
    linkedIn: "linkedin.com/in/davidwilson",
    isVerified: true,
    status: "Active",
    lastUpdated: new Date(2025, 4, 11),
  },
];

// Mock eligible students for alumni integration
const eligibleStudents = [
  {
    id: "6",
    studentId: "STU006",
    name: "Jessica Martinez",
    email: "jessica.martinez@university.edu",
    faculty: "Engineering",
    program: "Civil Engineering",
    graduationYear: "2025",
    clearanceStatus: "Cleared",
    paymentStatus: "Paid",
  },
  {
    id: "7",
    studentId: "STU007",
    name: "James Taylor",
    email: "james.taylor@university.edu",
    faculty: "Business",
    program: "Finance",
    graduationYear: "2025",
    clearanceStatus: "Cleared",
    paymentStatus: "Paid",
  },
  {
    id: "8",
    studentId: "STU008",
    name: "Sophia Anderson",
    email: "sophia.anderson@university.edu",
    faculty: "Science",
    program: "Chemistry",
    graduationYear: "2025",
    clearanceStatus: "Cleared",
    paymentStatus: "Paid",
  },
];

export default function AlumniIntegration() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddAlumni, setShowAddAlumni] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showAlumniProfile, setShowAlumniProfile] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter alumni based on search and filters
  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumni.currentEmployer &&
        alumni.currentEmployer
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesFaculty = selectedFaculty
      ? alumni.faculty === selectedFaculty
      : true;
    const matchesYear = selectedYear
      ? alumni.graduationYear === selectedYear
      : true;
    const matchesStatus = selectedStatus
      ? alumni.status === selectedStatus
      : true;

    return matchesSearch && matchesFaculty && matchesYear && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(eligibleStudents.map((student) => student.id));
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

  const handleAddToAlumni = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAddAlumni(false);
      toast({
        title: "Alumni Added",
        description: `${selectedStudents.length} students have been added to the Alumni Directory.`,
      });
      setSelectedStudents([]);
    }, 1500);
  };

  const handleExportAlumni = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowExportOptions(false);
      toast({
        title: "Export Started",
        description: "Alumni data is being exported to the selected format.",
      });
    }, 1000);
  };

  const handleViewProfile = (alumni: any) => {
    setSelectedAlumni(alumni);
    setShowAlumniProfile(true);
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Campaign Started",
      description: "Email will be sent to selected alumni.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-500 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Inactive
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Alumni Integration
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportOptions(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Alumni
          </Button>
          <Button size="sm" onClick={() => setShowAddAlumni(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add to Alumni
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alumni</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alumniData.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered alumni in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Profiles
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alumniData.filter((a) => a.isVerified).length}
            </div>
            <Progress
              value={
                (alumniData.filter((a) => a.isVerified).length /
                  alumniData.length) *
                100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eligible Students
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eligibleStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to be added to alumni
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Latest Graduation
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2025</div>
            <p className="text-xs text-muted-foreground">
              {alumniData.filter((a) => a.graduationYear === "2025").length} new
              alumni
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
          <TabsTrigger value="integration">Integration Queue</TabsTrigger>
          <TabsTrigger value="engagement">Alumni Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Alumni Directory</CardTitle>
              <CardDescription>
                Manage and view all alumni in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, email, or employer..."
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
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedYear || "Graduation Year"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedStatus || "Status"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alumni</TableHead>
                        <TableHead>Faculty/Program</TableHead>
                        <TableHead>Graduation</TableHead>
                        <TableHead>Employment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlumni.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No alumni found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAlumni.map((alumni) => (
                          <TableRow key={alumni.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {alumni.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {alumni.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{alumni.faculty}</span>
                                <span className="text-xs text-muted-foreground">
                                  {alumni.program}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{alumni.graduationYear}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{alumni.currentEmployer}</span>
                                <span className="text-xs text-muted-foreground">
                                  {alumni.jobTitle}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(alumni.status)}
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
                                  <DropdownMenuItem
                                    onClick={() => handleViewProfile(alumni)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    LinkedIn Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
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

        <TabsContent value="integration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Queue</CardTitle>
              <CardDescription>
                Add cleared graduates to the alumni directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Eligible Students</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddAlumni(true)}
                    disabled={eligibleStudents.length === 0}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Selected to Alumni
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedStudents.length ===
                                eligibleStudents.length &&
                              eligibleStudents.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Faculty/Program</TableHead>
                        <TableHead>Graduation Year</TableHead>
                        <TableHead>Clearance Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleStudents.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No eligible students found
                          </TableCell>
                        </TableRow>
                      ) : (
                        eligibleStudents.map((student) => (
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
                                  {student.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {student.email}
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
                            <TableCell>{student.graduationYear}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-500 flex items-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                {student.clearanceStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-500"
                              >
                                {student.paymentStatus}
                              </Badge>
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

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Alumni Engagement</CardTitle>
              <CardDescription>
                Manage alumni engagement activities and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Email Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={handleSendEmail}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Newsletter
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={handleSendEmail}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Event Invitations
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={handleSendEmail}
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Job Opportunities
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Alumni Network
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Networking Directory
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Globe className="mr-2 h-4 w-4" />
                          Alumni Portal
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Share2 className="mr-2 h-4 w-4" />
                          Social Media Integration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Reports & Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Employment Statistics
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <MapPin className="mr-2 h-4 w-4" />
                          Geographic Distribution
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Award className="mr-2 h-4 w-4" />
                          Alumni Achievements
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Upcoming Alumni Events
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event Name</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Registrations</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">
                              Annual Alumni Reunion
                            </div>
                          </TableCell>
                          <TableCell>June 25, 2025</TableCell>
                          <TableCell>University Grand Hall</TableCell>
                          <TableCell>120/200</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">
                              Career Networking Event
                            </div>
                          </TableCell>
                          <TableCell>July 15, 2025</TableCell>
                          <TableCell>Business School Auditorium</TableCell>
                          <TableCell>85/150</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">
                              Alumni Webinar Series
                            </div>
                          </TableCell>
                          <TableCell>August 5, 2025</TableCell>
                          <TableCell>Online</TableCell>
                          <TableCell>210/500</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add to Alumni Dialog */}
      <Dialog open={showAddAlumni} onOpenChange={setShowAddAlumni}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Alumni Directory</DialogTitle>
            <DialogDescription>
              Add selected graduates to the alumni directory.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Selected Students:</span>
                <span className="text-sm">{selectedStudents.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Graduation Year:</span>
                <span className="text-sm">2025</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="createAccounts" defaultChecked />
                <label
                  htmlFor="createAccounts"
                  className="text-sm font-medium leading-none"
                >
                  Create alumni portal accounts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sendWelcome" defaultChecked />
                <label
                  htmlFor="sendWelcome"
                  className="text-sm font-medium leading-none"
                >
                  Send welcome email with login details
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="alumniEmail" defaultChecked />
                <label
                  htmlFor="alumniEmail"
                  className="text-sm font-medium leading-none"
                >
                  Create alumni email addresses
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="addNetwork" />
                <label
                  htmlFor="addNetwork"
                  className="text-sm font-medium leading-none"
                >
                  Add to alumni networking directory
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAlumni(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToAlumni} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Add to Alumni
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Alumni Data</DialogTitle>
            <DialogDescription>
              Select export options for alumni data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="exportFormat" className="mb-2 block">
                Export Format
              </Label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="dataScope" className="mb-2 block">
                Data Scope
              </Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alumni</SelectItem>
                  <SelectItem value="filtered">Filtered Results</SelectItem>
                  <SelectItem value="selected">Selected Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Include Fields:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeBasic" defaultChecked />
                  <label
                    htmlFor="includeBasic"
                    className="text-sm leading-none"
                  >
                    Basic Information
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeContact" defaultChecked />
                  <label
                    htmlFor="includeContact"
                    className="text-sm leading-none"
                  >
                    Contact Details
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeEducation" defaultChecked />
                  <label
                    htmlFor="includeEducation"
                    className="text-sm leading-none"
                  >
                    Education History
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeEmployment" defaultChecked />
                  <label
                    htmlFor="includeEmployment"
                    className="text-sm leading-none"
                  >
                    Employment Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeSocial" />
                  <label
                    htmlFor="includeSocial"
                    className="text-sm leading-none"
                  >
                    Social Media Links
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeActivity" />
                  <label
                    htmlFor="includeActivity"
                    className="text-sm leading-none"
                  >
                    Activity History
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportOptions(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleExportAlumni} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alumni Profile Dialog */}
      <Dialog open={showAlumniProfile} onOpenChange={setShowAlumniProfile}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Alumni Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the alumni.
            </DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-2">
                    {selectedAlumni.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      selectedAlumni.isVerified
                        ? "border-green-500 text-green-500"
                        : "border-yellow-500 text-yellow-500"
                    }
                  >
                    {selectedAlumni.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedAlumni.name}</h3>
                  <p className="text-muted-foreground mb-2">
                    {selectedAlumni.faculty} - {selectedAlumni.program}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Class of {selectedAlumni.graduationYear}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAlumni.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Employment Information
                  </h4>
                  <div className="rounded-md border p-3">
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {selectedAlumni.jobTitle}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Current
                        </span>
                      </div>
                      <span>{selectedAlumni.currentEmployer}</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedAlumni.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Social Media</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LinkIcon className="h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Activity History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm p-2 rounded-md bg-muted">
                      <span>Attended Alumni Reunion 2024</span>
                      <span className="text-xs text-muted-foreground">
                        Dec 15, 2024
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-md bg-muted">
                      <span>Updated Employment Information</span>
                      <span className="text-xs text-muted-foreground">
                        Nov 3, 2024
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-md bg-muted">
                      <span>Joined Alumni Network</span>
                      <span className="text-xs text-muted-foreground">
                        Jun 20, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <Button onClick={() => setShowAlumniProfile(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
