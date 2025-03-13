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
  FileText,
  FilePlus,
  FileCheck,
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Printer,
  QrCode,
  Copy,
  Upload,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  PlusIcon,
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

// Mock document requests
const documentRequests = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "John Smith",
    documentType: "Transcript",
    requestDate: new Date(2025, 3, 15),
    status: "Completed",
    deliveryMethod: "Email",
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "Sarah Johnson",
    documentType: "Certificate",
    requestDate: new Date(2025, 3, 14),
    status: "Processing",
    deliveryMethod: "Physical",
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Michael Brown",
    documentType: "Transcript",
    requestDate: new Date(2025, 3, 13),
    status: "Pending",
    deliveryMethod: "Email",
  },
  {
    id: "4",
    studentId: "STU004",
    studentName: "Emily Davis",
    documentType: "Certificate",
    requestDate: new Date(2025, 3, 12),
    status: "Completed",
    deliveryMethod: "Both",
  },
  {
    id: "5",
    studentId: "STU005",
    studentName: "David Wilson",
    documentType: "Transcript",
    requestDate: new Date(2025, 3, 11),
    status: "Rejected",
    deliveryMethod: "Email",
  },
];

// Mock document templates
const documentTemplates = [
  {
    id: "1",
    name: "Official Transcript",
    type: "Transcript",
    lastUpdated: new Date(2025, 2, 10),
    version: "2.1",
  },
  {
    id: "2",
    name: "Graduation Certificate",
    type: "Certificate",
    lastUpdated: new Date(2025, 1, 15),
    version: "1.3",
  },
  {
    id: "3",
    name: "Provisional Degree",
    type: "Certificate",
    lastUpdated: new Date(2025, 0, 20),
    version: "1.1",
  },
  {
    id: "4",
    name: "Academic Record",
    type: "Transcript",
    lastUpdated: new Date(2024, 11, 5),
    version: "3.0",
  },
];

export default function DocumentManagement() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showBulkGenerate, setShowBulkGenerate] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    studentId: "",
    documentType: "Transcript",
    deliveryMethod: "Email",
    urgent: false,
    notes: "",
  });

  // Filter document requests based on search and filters
  const filteredRequests = documentRequests.filter((request) => {
    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.documentType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? request.status === selectedStatus
      : true;
    const matchesType = selectedType
      ? request.documentType === selectedType
      : true;

    // Date range filtering
    let matchesDateRange = true;
    const today = new Date();
    if (dateRange === "today") {
      matchesDateRange =
        request.requestDate.getDate() === today.getDate() &&
        request.requestDate.getMonth() === today.getMonth() &&
        request.requestDate.getFullYear() === today.getFullYear();
    } else if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesDateRange = request.requestDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDateRange = request.requestDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredRequests.map((request) => request.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, requestId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== requestId));
    }
  };

  const handleNewRequestSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowNewRequest(false);
      toast({
        title: "Request Submitted",
        description: `Document request for ${newRequestData.documentType} has been submitted successfully.`,
      });
      // Reset form
      setNewRequestData({
        studentId: "",
        documentType: "Transcript",
        deliveryMethod: "Email",
        urgent: false,
        notes: "",
      });
    }, 1000);
  };

  const handleBulkGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBulkGenerate(false);
      toast({
        title: "Bulk Generation Started",
        description: `${selectedStudents.length} documents are being generated.`,
      });
      setSelectedStudents([]);
    }, 1500);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateEditor(true);
  };

  const handleSaveTemplate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowTemplateEditor(false);
      toast({
        title: "Template Updated",
        description: `${selectedTemplate.name} template has been updated successfully.`,
      });
    }, 1000);
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Document report is being exported to Excel",
    });
  };

  const handlePrintDocument = (request: any) => {
    toast({
      title: "Printing Document",
      description: `${request.documentType} for ${request.studentName} is being prepared for printing.`,
    });
  };

  const handleSendDocument = (request: any) => {
    toast({
      title: "Email Sent",
      description: `${request.documentType} has been emailed to ${request.studentName}.`,
    });
  };

  const handleGenerateQR = (request: any) => {
    toast({
      title: "QR Code Generated",
      description: `Verification QR code for ${request.studentName}'s ${request.documentType} has been generated.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge
            variant="outline"
            className="border-green-500 text-green-500 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Completed
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
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-500 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const completedRequests = documentRequests.filter(
    (r) => r.status === "Completed"
  ).length;
  const pendingRequests = documentRequests.filter(
    (r) => r.status === "Pending" || r.status === "Processing"
  ).length;
  const rejectedRequests = documentRequests.filter(
    (r) => r.status === "Rejected"
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Document Management
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => setShowNewRequest(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Document requests this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRequests}</div>
            <Progress
              value={(completedRequests / documentRequests.length) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <Progress
              value={(pendingRequests / documentRequests.length) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests}</div>
            <Progress
              value={(rejectedRequests / documentRequests.length) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Document Requests</TabsTrigger>
          <TabsTrigger value="templates">Document Templates</TabsTrigger>
          <TabsTrigger value="archive">Document Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Document Request Management</CardTitle>
              <CardDescription>
                Process and manage document requests from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, or document type..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedType || "Document Type"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Transcript">Transcript</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {dateRange === "all"
                              ? "All Time"
                              : dateRange === "today"
                              ? "Today"
                              : dateRange === "week"
                              ? "This Week"
                              : "This Month"}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedStudents.length > 0 && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">
                      {selectedStudents.length} requests selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowBulkGenerate(true)}
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Bulk Generate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Bulk Email Sent",
                            description: `Documents have been emailed to ${selectedStudents.length} students.`,
                          });
                          setSelectedStudents([]);
                        }}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Bulk Email
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
                                filteredRequests.length &&
                              filteredRequests.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Delivery Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No document requests found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedStudents.includes(request.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectRequest(request.id, !!checked)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {request.studentName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {request.studentId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{request.documentType}</TableCell>
                            <TableCell>
                              {format(request.requestDate, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{request.deliveryMethod}</TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
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
                                    onClick={() => handlePrintDocument(request)}
                                  >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Document
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleSendDocument(request)}
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email Document
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleGenerateQR(request)}
                                  >
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generate QR Code
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit Request
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Request
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

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>
                Manage and customize document templates for certificates and
                transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button size="sm">
                    <FilePlus className="mr-2 h-4 w-4" />
                    New Template
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="font-medium">{template.name}</div>
                          </TableCell>
                          <TableCell>{template.type}</TableCell>
                          <TableCell>
                            {format(template.lastUpdated, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>v{template.version}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Template Preview",
                                    description: `Previewing ${template.name} template.`,
                                  });
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  toast({
                                    title: "Template Duplicated",
                                    description: `${template.name} has been duplicated.`,
                                  });
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
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

        <TabsContent value="archive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Archive</CardTitle>
              <CardDescription>
                Access and manage archived documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                This tab will display the document archive system
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Document Request Dialog */}
      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Document Request</DialogTitle>
            <DialogDescription>
              Create a new document request for a student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentId" className="text-right">
                Student ID
              </Label>
              <Input
                id="studentId"
                value={newRequestData.studentId}
                onChange={(e) =>
                  setNewRequestData({
                    ...newRequestData,
                    studentId: e.target.value,
                  })
                }
                placeholder="e.g. STU001"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="documentType" className="text-right">
                Document Type
              </Label>
              <Select
                value={newRequestData.documentType}
                onValueChange={(value) =>
                  setNewRequestData({
                    ...newRequestData,
                    documentType: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transcript">Transcript</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Provisional Degree">
                    Provisional Degree
                  </SelectItem>
                  <SelectItem value="Academic Record">
                    Academic Record
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryMethod" className="text-right">
                Delivery Method
              </Label>
              <Select
                value={newRequestData.deliveryMethod}
                onValueChange={(value) =>
                  setNewRequestData({
                    ...newRequestData,
                    deliveryMethod: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Physical">Physical</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Urgent</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="urgent"
                  checked={newRequestData.urgent}
                  onCheckedChange={(checked) =>
                    setNewRequestData({
                      ...newRequestData,
                      urgent: !!checked,
                    })
                  }
                />
                <label
                  htmlFor="urgent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as urgent request
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={newRequestData.notes}
                onChange={(e) =>
                  setNewRequestData({
                    ...newRequestData,
                    notes: e.target.value,
                  })
                }
                placeholder="Any additional information"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewRequestSubmit} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileCheck className="mr-2 h-4 w-4" />
              )}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Generate Dialog */}
      <Dialog open={showBulkGenerate} onOpenChange={setShowBulkGenerate}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Document Generation</DialogTitle>
            <DialogDescription>
              Generate documents for multiple students at once.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Selected Requests:</span>
                <span className="text-sm">{selectedStudents.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Estimated Time:</span>
                <span className="text-sm">
                  ~{selectedStudents.length * 2} minutes
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeQR" />
                <label
                  htmlFor="includeQR"
                  className="text-sm font-medium leading-none"
                >
                  Include QR verification codes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sendEmail" defaultChecked />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium leading-none"
                >
                  Send email notifications when complete
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="highQuality" />
                <label
                  htmlFor="highQuality"
                  className="text-sm font-medium leading-none"
                >
                  Use high-quality print settings
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkGenerate(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkGenerate} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileCheck className="mr-2 h-4 w-4" />
              )}
              Generate Documents
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Editor Dialog */}
      <Dialog open={showTemplateEditor} onOpenChange={setShowTemplateEditor}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              {selectedTemplate &&
                `Customize the ${selectedTemplate.name} template.`}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="py-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="templateName" className="text-right">
                  Template Name
                </Label>
                <Input
                  id="templateName"
                  value={selectedTemplate.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="templateVersion" className="text-right">
                  Version
                </Label>
                <Input
                  id="templateVersion"
                  value={selectedTemplate.version}
                  className="col-span-3"
                />
              </div>
              <div className="mb-4">
                <Label className="mb-2 block">Template Preview</Label>
                <div className="border rounded-md p-4 h-[200px] flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Template preview would appear here
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Template Elements</span>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Element
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>Header</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>Student Information</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>Content</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>Signature</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTemplateEditor(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
