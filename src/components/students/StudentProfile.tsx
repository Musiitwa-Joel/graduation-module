import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudents } from '@/context/StudentContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Building, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Download, 
  Printer, 
  Edit2, 
  AlertTriangle,
  Layers,
  FileLock,
  Archive,
  DollarSign,
  BookOpen,
  ClipboardCheck,
  History,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { students, updateClearanceStatus } = useStudents();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // For demo purposes, use the first student if no ID is provided
  const student = id ? students.find(s => s.id === id) : students[0];

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
        <p className="text-muted-foreground mb-4">The student you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Student List
          </Link>
        </Button>
      </div>
    );
  }

  // Calculate overall clearance progress
  const clearanceItems = Object.values(student.departmentalClearance);
  const completedItems = clearanceItems.filter(Boolean).length;
  const clearanceProgress = Math.round((completedItems / clearanceItems.length) * 100);

  // Calculate document completion
  const documentItems = Object.values(student.documents);
  const completedDocuments = documentItems.filter(Boolean).length;
  const documentProgress = Math.round((completedDocuments / documentItems.length) * 100);

  const handleApprove = (department: keyof typeof student.departmentalClearance) => {
    updateClearanceStatus(student.id, department, true);
    toast({
      title: "Clearance Updated",
      description: `${department} clearance has been approved for ${student.name}`,
    });
  };

  const handleReject = (department: keyof typeof student.departmentalClearance) => {
    updateClearanceStatus(student.id, department, false);
    toast({
      title: "Clearance Updated",
      description: `${department} clearance has been rejected for ${student.name}`,
    });
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <Badge variant="outline" className="border-green-500 text-green-500 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-red-500 text-red-500 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    }
  };

  const clearanceHistory = [
    {
      department: "Academic Faculty",
      status: "approved",
      date: new Date(2025, 3, 15),
      comment: "All academic requirements verified and approved.",
      approver: "Dr. James Wilson"
    },
    {
      department: "Registrar",
      status: "approved",
      date: new Date(2025, 3, 17),
      comment: "Student records verified. No outstanding issues.",
      approver: "Sarah Johnson"
    },
    {
      department: "Examinations",
      status: "approved",
      date: new Date(2025, 3, 20),
      comment: "All examination requirements met. No malpractice records.",
      approver: "Michael Brown"
    },
    {
      department: "Finance",
      status: "approved",
      date: new Date(2025, 3, 22),
      comment: "All financial obligations fulfilled. Graduation fee paid.",
      approver: "Robert Davis"
    },
    {
      department: "Alumni",
      status: "pending",
      date: new Date(2025, 3, 25),
      comment: "Pending alumni directory registration.",
      approver: "Pending"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/students">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>{student.studentId}</CardDescription>
              <Badge 
                variant="outline" 
                className={cn(
                  "mt-2",
                  student.clearanceStatus === 'Cleared' && "border-green-500 text-green-500",
                  student.clearanceStatus === 'In Progress' && "border-yellow-500 text-yellow-500",
                  student.clearanceStatus === 'Rejected' && "border-red-500 text-red-500"
                )}
              >
                {student.clearanceStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Graduation Year: {student.graduationYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{student.program}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{student.faculty} - {student.department}</span>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Clearance Progress</h4>
                <Progress value={clearanceProgress} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground text-right">{clearanceProgress}% Complete</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Document Submission</h4>
                <Progress value={documentProgress} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground text-right">{documentProgress}% Complete</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Payment Status</h4>
                <Badge 
                  className={cn(
                    "w-full justify-center py-1",
                    student.paymentStatus === 'Paid' && "bg-green-500",
                    student.paymentStatus === 'Pending' && "bg-yellow-500",
                    student.paymentStatus === 'Waived' && "bg-blue-500"
                  )}
                >
                  {student.paymentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clearance">Clearance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clearance Summary</CardTitle>
                  <CardDescription>Overall status of the student's graduation clearance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Academic Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Academic Requirements</span>
                          </div>
                          {getStatusBadge(student.departmentalClearance.academic)}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Financial Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Payment Status</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              student.paymentStatus === 'Paid' && "border-green-500 text-green-500",
                              student.paymentStatus === 'Pending' && "border-yellow-500 text-yellow-500",
                              student.paymentStatus === 'Waived' && "border-blue-500 text-blue-500"
                            )}
                          >
                            {student.paymentStatus}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Document Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Required Documents</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              documentProgress === 100 ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                            )}
                          >
                            {documentProgress === 100 ? "Complete" : "Incomplete"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Graduation Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Graduation Eligibility</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              clearanceProgress === 100 ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"
                            )}
                          >
                            {clearanceProgress === 100 ? "Eligible" : "Pending"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates on the student's clearance process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clearanceHistory.slice(0, 3).map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={cn(
                          "mt-1 h-8 w-8 rounded-full flex items-center justify-center",
                          activity.status === "approved" && "bg-green-100 text-green-500",
                          activity.status === "rejected" && "bg-red-100 text-red-500",
                          activity.status === "pending" && "bg-yellow-100 text-yellow-500"
                        )}>
                          {activity.status === "approved" && <CheckCircle className="h-4 w-4" />}
                          {activity.status === "rejected" && <XCircle className="h-4 w-4" />}
                          {activity.status === "pending" && <Clock className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{activity.department} Clearance</h4>
                            <span className="text-xs text-muted-foreground">
                              {format(activity.date, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity.comment}</p>
                          <div className="flex items-center mt-1">
                            <User className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{activity.approver}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('history')}>
                    View Full History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="clearance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clearance Workflow</CardTitle>
                  <CardDescription>Track and manage the student's clearance process across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="academic">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            student.departmentalClearance.academic ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"
                          )}>
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium">Academic Faculty</h4>
                            <p className="text-xs text-muted-foreground">Results & fee approval</p>
                          </div>
                        </div>
                        <div className="ml-auto mr-4">
                          {getStatusBadge(student.departmentalClearance.academic)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Requirements</h5>
                              <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Completed all required courses</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Minimum GPA requirements met</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Final project/thesis approved</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">
                                Student has successfully completed all academic requirements for graduation.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleReject('academic')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleApprove('academic')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="registrar">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            student.departmentalClearance.registrar ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"
                          )}>
                            <ClipboardCheck className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium">Academic Registrar</h4>
                            <p className="text-xs text-muted-foreground">Academic document verification</p>
                          </div>
                        </div>
                        <div className="ml-auto mr-4">
                          {getStatusBadge(student.departmentalClearance.registrar)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Requirements</h5>
                              <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Student records verified</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Admission documents complete</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>No outstanding registration issues</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">
                                All academic records have been verified and are in good standing.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleReject('registrar')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleApprove('registrar')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="examinations">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            student.departmentalClearance.examinations ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"
                          )}>
                            <FileLock className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium">Examinations Office</h4>
                            <p className="text-xs text-muted-foreground">Malpractice record check</p>
                          </div>
                        </div>
                        <div className="ml-auto mr-4">
                          {getStatusBadge(student.departmentalClearance.examinations)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Requirements</h5>
                              <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>No examination malpractice records</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>All examination results verified</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>No pending supplementary exams</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">
                                Student has a clean examination record with no instances of malpractice.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleReject('examinations')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleApprove('examinations')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="finance">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            student.departmentalClearance.finance ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"
                          )}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium">Finance Department</h4>
                            <p className="text-xs text-muted-foreground">Fee verification</p>
                          </div>
                        </div>
                        <div className="ml-auto mr-4">
                          {getStatusBadge(student.departmentalClearance.finance)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Requirements</h5>
                              <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Tuition fees fully paid</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>Graduation fee paid</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span>No outstanding financial obligations</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">
                                Student has cleared all financial obligations including graduation fees.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleReject('finance')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleApprove('finance')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="alumni">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            student.departmentalClearance.alumni ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"
                          )}>
                            <Archive className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium">Alumni Office</h4>
                            <p className="text-xs text-muted-foreground">Alumni directory registration</p>
                          </div>
                        </div>
                        <div className="ml-auto mr-4">
                          {getStatusBadge(student.departmentalClearance.alumni)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-10 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Requirements</h5>
                              <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-1">
                                  {student.departmentalClearance.alumni ? 
                                    <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                    <Clock className="h-3 w-3 text-yellow-500" />
                                  }
                                  <span>Alumni registration form completed</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  {student.departmentalClearance.alumni ? 
                                    <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                    <Clock className="h-3 w-3 text-yellow-500" />
                                  }
                                  <span>Contact information updated</span>
                                </li>
                                <li className="flex items-center gap-1">
                                  {student.departmentalClearance.alumni ? 
                                    <CheckCircle className="h-3 w-3 text-green-500" /> : 
                                    <Clock className="h-3 w-3 text-yellow-500" />
                                  }
                                  <span>Alumni directory entry created</span>
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium mb-1">Notes</h5>
                              <p className="text-sm text-muted-foreground">
                                {student.departmentalClearance.alumni ? 
                                  "Student has been successfully registered in the alumni directory." : 
                                  "Pending alumni registration and directory entry creation."}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleReject('alumni')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                              onClick={() => handleApprove('alumni')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Documents</CardTitle>
                  <CardDescription>View and verify submitted documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={cn(
                      "border-2",
                      student.documents.transcript ? "border-green-500" : "border-red-500"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Academic Transcript</CardTitle>
                          {student.documents.transcript ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">Submitted</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-500">Missing</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {student.documents.transcript ? (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-center">Official academic transcript showing all completed courses and grades</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                            <p className="text-sm text-center text-red-500">Academic transcript has not been submitted</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Upload className="mr-2 h-4 w-4" />
                              Request Document
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className={cn(
                      "border-2",
                      student.documents.idCard ? "border-green-500" : "border-red-500"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Student ID Card</CardTitle>
                          {student.documents.idCard ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">Submitted</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-500">Missing</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {student.documents.idCard ? (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-center">Copy of student identification card</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                            <p className="text-sm text-center text-red-500">Student ID card has not been submitted</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Upload className="mr-2 h-4 w-4" />
                              Request Document
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className={cn(
                      "border-2",
                      student.documents.clearanceForm ? "border-green-500" : "border-red-500"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Clearance Form</CardTitle>
                          {student.documents.clearanceForm ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">Submitted</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-500">Missing</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {student.documents.clearanceForm ? (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-center">Signed clearance form with departmental approvals</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                            <p className="text-sm text-center text-red-500">Clearance form has not been submitted</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Upload className="mr-2 h-4 w-4" />
                              Request Document
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className={cn(
                      "border-2",
                      student.documents.feeReceipt ? "border-green-500" : "border-red-500"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">Fee Receipt</CardTitle>
                          {student.documents.feeReceipt ? (
                            <Badge variant="outline" className="border-green-500 text-green-500">Submitted</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-500">Missing</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {student.documents.feeReceipt ? (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                            <p className="text-sm text-center">Proof of graduation fee payment</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                            <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
                            <p className="text-sm text-center text-red-500">Fee receipt has not been submitted</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Upload className="mr-2 h-4 w-4" />
                              Request Document
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Clearance History</CardTitle>
                  <CardDescription>Complete history of clearance activities and approvals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Approver</TableHead>
                          <TableHead>Comments</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clearanceHistory.map((activity, index) => (
                          <TableRow key={index}>
                            <TableCell>{activity.department}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "flex w-fit items-center gap-1",
                                  activity.status === 'approved' && "border-green-500 text-green-500",
                                  activity.status === 'rejected' && "border-red-500 text-red-500",
                                  activity.status === 'pending' && "border-yellow-500 text-yellow-500"
                                )}
                              >
                                {activity.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                                {activity.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                {activity.status === 'pending' && <Clock className="h-3 w-3" />}
                                <span className="capitalize">{activity.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell>{format(activity.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{activity.approver}</TableCell>
                            <TableCell>{activity.comment}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// This is a placeholder for the Upload component used in the document section
function Upload(props: any) {
  return <div {...props} />;
}