import { useState } from "react";
import { useStudents } from "@/context/StudentContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  FileText,
  Download,
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { faculties, departments } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function StudentManagement() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFaculty = selectedFaculty
      ? student.faculty === selectedFaculty
      : true;
    const matchesStatus = selectedStatus
      ? student.clearanceStatus === selectedStatus
      : true;

    return matchesSearch && matchesFaculty && matchesStatus;
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

  const handleBulkApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Bulk Action Completed",
        description: `${selectedStudents.length} students have been approved`,
      });
      setSelectedStudents([]);
    }, 1000);
  };

  const handleBulkReject = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Bulk Action Completed",
        description: `${selectedStudents.length} students have been rejected`,
      });
      setSelectedStudents([]);
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Student data is being exported to Excel",
    });
  };

  const handleEmailSelected = () => {
    toast({
      title: "Email Notification",
      description: `Email will be sent to ${selectedStudents.length} students`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Cleared":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Cleared
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-500 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "In Progress":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Pending
          </Badge>
        );
      case "Waived":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Waived
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
          Student Management
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedStudents([])}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="cleared">Cleared</TabsTrigger>
          <TabsTrigger value="pending">In Progress</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Student Applications</CardTitle>
              <CardDescription>
                Manage and process student graduation applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, or email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedFaculty}
                      onValueChange={setSelectedFaculty}
                    >
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedFaculty || "Faculty"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Faculties</SelectItem>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedStatus || "Status"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Cleared">Cleared</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
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
                        onClick={handleEmailSelected}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                        onClick={handleBulkApprove}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleBulkReject}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserX className="mr-2 h-4 w-4" />
                        )}
                        Reject
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
                        <TableHead>Faculty/Department</TableHead>
                        <TableHead>Clearance Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Documents</TableHead>
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
                                  {student.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {student.studentId}
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
                                  {student.department}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(student.clearanceStatus)}
                            </TableCell>
                            <TableCell>
                              {getPaymentBadge(student.paymentStatus)}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    student.documents.transcript
                                      ? "border-green-500 text-green-500"
                                      : "border-red-500 text-red-500"
                                  )}
                                >
                                  TR
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    student.documents.idCard
                                      ? "border-green-500 text-green-500"
                                      : "border-red-500 text-red-500"
                                  )}
                                >
                                  ID
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    student.documents.clearanceForm
                                      ? "border-green-500 text-green-500"
                                      : "border-red-500 text-red-500"
                                  )}
                                >
                                  CF
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    student.documents.feeReceipt
                                      ? "border-green-500 text-green-500"
                                      : "border-red-500 text-red-500"
                                  )}
                                >
                                  FR
                                </Badge>
                              </div>
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
                                    onClick={() =>
                                      (window.location.href = `/students/${student.id}`)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Documents
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-green-500">
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500">
                                    <UserX className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
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

        <TabsContent value="cleared" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cleared Students</CardTitle>
              <CardDescription>
                Students who have completed all clearance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure but filtered for cleared students */}
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only cleared students
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Students</CardTitle>
              <CardDescription>
                Students with pending clearance requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure but filtered for in-progress students */}
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only students with in-progress status
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Students</CardTitle>
              <CardDescription>
                Students whose applications have been rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table structure but filtered for rejected students */}
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only rejected students
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
