import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
  PieChart,
  TrendingUp,
  Download,
  RefreshCw,
  ArrowRight,
  Calendar,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockStudents } from "@/data/mockData";
import RecentActivityTable from "@/components/dashboard/RecentActivityTable";
import ClearanceProgressChart from "@/components/dashboard/ClearanceProgressChart";
import DepartmentProgressChart from "@/components/dashboard/DepartmentProgressChart";
import FinancialSummaryChart from "@/components/dashboard/FinancialSummaryChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function Dashboard() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<string | null>(null);

  const totalStudents = mockStudents.length;
  const clearedStudents = mockStudents.filter(
    (s) => s.clearanceStatus === "Cleared"
  ).length;
  const pendingStudents = mockStudents.filter(
    (s) => s.clearanceStatus === "In Progress"
  ).length;
  const rejectedStudents = mockStudents.filter(
    (s) => s.clearanceStatus === "Rejected"
  ).length;
  const paidStudents = mockStudents.filter(
    (s) => s.paymentStatus === "Paid"
  ).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Dashboard data is being exported to Excel",
    });
  };

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportDialog(false);
      toast({
        title: "Report Generated",
        description: `${selectedReport} report has been generated successfully`,
      });
      setSelectedReport(null);
    }, 1500);
  };

  const handleCardClick = (cardId: string) => {
    setShowCardDetails(cardId);
  };

  const closeCardDetails = () => {
    setShowCardDetails(null);
  };

  const getCardDetailsContent = () => {
    switch (showCardDetails) {
      case "totalApplicants":
        return {
          title: "Total Applicants Details",
          description: "Detailed breakdown of all graduation applicants",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Faculty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engineering</span>
                        <span className="font-medium">32</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Business</span>
                        <span className="font-medium">28</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Science</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Arts</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medicine</span>
                        <span className="font-medium">8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          Cleared
                        </span>
                        <span className="font-medium">{clearedStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                          In Progress
                        </span>
                        <span className="font-medium">{pendingStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                          Rejected
                        </span>
                        <span className="font-medium">{rejectedStudents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart2 className="h-16 w-16 mx-auto mb-2" />
                    <p>Monthly application trend would appear here</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button asChild>
                  <Link to="/students">
                    View All Students
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ),
        };
      case "clearedStudents":
        return {
          title: "Cleared Students Details",
          description: "Students who have completed all clearance requirements",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Faculty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engineering</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Business</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Science</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Arts</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medicine</span>
                        <span className="font-medium">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Payment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Paid</span>
                        <span className="font-medium">52</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Waived</span>
                        <span className="font-medium">6</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Clearance Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-2" />
                    <p>Clearance completion timeline would appear here</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button asChild>
                  <Link to="/graduation-list">
                    View Graduation List
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ),
        };
      case "pendingApprovals":
        return {
          title: "Pending Approvals Details",
          description: "Students with pending clearance requirements",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Academic</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Registrar</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Examinations</span>
                        <span className="font-medium">6</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Finance</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Alumni</span>
                        <span className="font-medium">10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                          High
                        </span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                          Medium
                        </span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <AlertCircle className="h-3 w-3 text-blue-500 mr-1" />
                          Low
                        </span>
                        <span className="font-medium">21</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transcripts</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ID Cards</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Clearance Forms</span>
                      <span className="font-medium">22</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fee Receipts</span>
                      <span className="font-medium">18</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button asChild>
                  <Link to="/clearance">
                    View Clearance Workflow
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ),
        };
      case "feePayments":
        return {
          title: "Fee Payments Details",
          description: "Detailed breakdown of graduation fee payments",
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      By Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credit Card</span>
                        <span className="font-medium">28</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bank Transfer</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mobile Money</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cash</span>
                        <span className="font-medium">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Payment Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          Paid
                        </span>
                        <span className="font-medium">{paidStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                          Pending
                        </span>
                        <span className="font-medium">
                          {
                            mockStudents.filter(
                              (s) => s.paymentStatus === "Pending"
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 text-blue-500 mr-1" />
                          Waived
                        </span>
                        <span className="font-medium">
                          {
                            mockStudents.filter(
                              (s) => s.paymentStatus === "Waived"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <DollarSign className="h-16 w-16 mx-auto mb-2" />
                    <p>Revenue summary chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button asChild>
                  <Link to="/finance">
                    View Finance Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ),
        };
      default:
        return {
          title: "",
          description: "",
          content: null,
        };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick("totalApplicants")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Elligible Students
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 10)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick("clearedStudents")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cleared Students
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clearedStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((clearedStudents / totalStudents) * 100)}% of total
              applicants
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick("pendingApprovals")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((pendingStudents / totalStudents) * 100)}% of total
              applicants
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => handleCardClick("feePayments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((paidStudents / totalStudents) * 100)}% payment rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Clearance Progress Overview</CardTitle>
            <CardDescription>
              Track student clearance progress across departments
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ClearanceProgressChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Department Completion</CardTitle>
            <CardDescription>
              Clearance completion rate by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentProgressChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest clearance actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityTable />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Graduation fee payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialSummaryChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Clearance Status by Faculty</CardTitle>
            <CardDescription>
              Overall clearance progress for each faculty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Faculty of Engineering</span>
                  </div>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Faculty of Business</span>
                  </div>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Faculty of Science</span>
                  </div>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Faculty of Arts</span>
                  </div>
                  <span className="font-medium">54%</span>
                </div>
                <Progress value={54} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span>Faculty of Medicine</span>
                  </div>
                  <span className="font-medium">81%</span>
                </div>
                <Progress value={81} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                setSelectedReport("Graduation List");
                setShowReportDialog(true);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Graduation List
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                setSelectedReport("Payment Verification");
                setShowReportDialog(true);
              }}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Payment Verification
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                setSelectedReport("Bulk Clearance");
                setShowReportDialog(true);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Bulk Clearance Approval
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                setSelectedReport("Rejected Applications");
                setShowReportDialog(true);
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Review Rejected Applications
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => {
                setSelectedReport("Summary Report");
                setShowReportDialog(true);
              }}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate {selectedReport} Report</DialogTitle>
            <DialogDescription>
              Configure options for the {selectedReport} report generation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedReport === "Graduation List" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Format</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Excel
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Word
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group By</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Faculty
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Program
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Level
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Include</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-gpa" />
                        <label htmlFor="include-gpa" className="text-sm">
                          GPA
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-honors" defaultChecked />
                        <label htmlFor="include-honors" className="text-sm">
                          Honors Status
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-photo" />
                        <label htmlFor="include-photo" className="text-sm">
                          Student Photo
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === "Payment Verification" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Status
                    </label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        All
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Paid
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Pending
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Waived
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        This Week
                      </Button>
                      <Button variant="outline" className="flex-1">
                        This Month
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Custom
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === "Bulk Clearance" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Academic
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Finance
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Library
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Criteria</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-docs" defaultChecked />
                        <label htmlFor="criteria-docs" className="text-sm">
                          All documents submitted
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-fees" defaultChecked />
                        <label htmlFor="criteria-fees" className="text-sm">
                          All fees paid
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="criteria-gpa" />
                        <label htmlFor="criteria-gpa" className="text-sm">
                          GPA above 2.0
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === "Rejected Applications" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Rejection Reason
                    </label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        All
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Missing Docs
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Unpaid Fees
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Academic
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        This Week
                      </Button>
                      <Button variant="outline" className="flex-1">
                        This Month
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Custom
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {selectedReport === "Summary Report" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Clearance
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Financial
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Academic
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Excel
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Dashboard
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Include</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-charts" defaultChecked />
                        <label htmlFor="include-charts" className="text-sm">
                          Charts and Graphs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-tables" defaultChecked />
                        <label htmlFor="include-tables" className="text-sm">
                          Data Tables
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="include-summary" defaultChecked />
                        <label htmlFor="include-summary" className="text-sm">
                          Executive Summary
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Details Dialog */}
      {showCardDetails && (
        <Dialog open={!!showCardDetails} onOpenChange={closeCardDetails}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{getCardDetailsContent().title}</DialogTitle>
              <DialogDescription>
                {getCardDetailsContent().description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{getCardDetailsContent().content}</div>
            <DialogFooter>
              <Button onClick={closeCardDetails}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
