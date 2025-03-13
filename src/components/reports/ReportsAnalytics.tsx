import { useState } from "react";
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
  BarChart2,
  PieChart,
  TrendingUp,
  FileText,
  RefreshCw,
  Calendar,
  Save,
  Share2,
  Printer,
  Mail,
  Plus,
  Settings,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CheckCircle,
  DollarSign,
  GraduationCap,
  BookOpen,
  Edit2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Mock data for charts
const graduationTrendsData = [
  { year: "2020", graduates: 850, applications: 920, clearanceRate: 92 },
  { year: "2021", graduates: 880, applications: 950, clearanceRate: 93 },
  { year: "2022", graduates: 910, applications: 990, clearanceRate: 92 },
  { year: "2023", graduates: 950, applications: 1020, clearanceRate: 93 },
  { year: "2024", graduates: 980, applications: 1050, clearanceRate: 93 },
  { year: "2025", graduates: 1020, applications: 1100, clearanceRate: 93 },
];

const facultyDistributionData = [
  { name: "Engineering", value: 35 },
  { name: "Business", value: 25 },
  { name: "Science", value: 20 },
  { name: "Arts", value: 15 },
  { name: "Medicine", value: 5 },
];

const clearanceProgressData = [
  {
    month: "Jan",
    completed: 65,
    pending: 35,
  },
  {
    month: "Feb",
    completed: 70,
    pending: 30,
  },
  {
    month: "Mar",
    completed: 75,
    pending: 25,
  },
  {
    month: "Apr",
    completed: 80,
    pending: 20,
  },
  {
    month: "May",
    completed: 85,
    pending: 15,
  },
  {
    month: "Jun",
    completed: 90,
    pending: 10,
  },
];

const financialReportData = [
  {
    month: "Jan",
    revenue: 25000,
    expenses: 18000,
  },
  {
    month: "Feb",
    revenue: 27000,
    expenses: 19000,
  },
  {
    month: "Mar",
    revenue: 29000,
    expenses: 20000,
  },
  {
    month: "Apr",
    revenue: 31000,
    expenses: 21000,
  },
  {
    month: "May",
    revenue: 33000,
    expenses: 22000,
  },
  {
    month: "Jun",
    revenue: 35000,
    expenses: 23000,
  },
];

// Mock saved reports
const savedReports = [
  {
    id: "1",
    name: "Annual Graduation Report 2025",
    type: "Graduation",
    createdBy: "Admin User",
    createdAt: new Date(2025, 4, 15),
    lastRun: new Date(2025, 4, 15),
  },
  {
    id: "2",
    name: "Financial Summary Q2 2025",
    type: "Financial",
    createdBy: "Finance Officer",
    createdAt: new Date(2025, 4, 10),
    lastRun: new Date(2025, 4, 14),
  },
  {
    id: "3",
    name: "Clearance Progress Report",
    type: "Clearance",
    createdBy: "Registrar",
    createdAt: new Date(2025, 4, 5),
    lastRun: new Date(2025, 4, 13),
  },
  {
    id: "4",
    name: "Faculty Distribution Analysis",
    type: "Analytics",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 28),
    lastRun: new Date(2025, 4, 12),
  },
  {
    id: "5",
    name: "Graduation Trends 2020-2025",
    type: "Graduation",
    createdBy: "Admin User",
    createdAt: new Date(2025, 3, 20),
    lastRun: new Date(2025, 4, 10),
  },
];

// Mock scheduled reports
const scheduledReports = [
  {
    id: "1",
    name: "Weekly Clearance Progress",
    type: "Clearance",
    frequency: "Weekly",
    nextRun: new Date(2025, 4, 22),
    recipients: "registrar@university.edu",
    status: "Active",
  },
  {
    id: "2",
    name: "Monthly Financial Summary",
    type: "Financial",
    frequency: "Monthly",
    nextRun: new Date(2025, 5, 1),
    recipients: "finance@university.edu, admin@university.edu",
    status: "Active",
  },
  {
    id: "3",
    name: "Quarterly Graduation Forecast",
    type: "Graduation",
    frequency: "Quarterly",
    nextRun: new Date(2025, 6, 1),
    recipients: "admin@university.edu",
    status: "Active",
  },
];

const COLORS = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7", "#ef4444"];

export default function ReportsAnalytics() {
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showScheduleReport, setShowScheduleReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [dateRange, setDateRange] = useState("year");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "graduationTrends"
  );

  const handleCreateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCreateReport(false);
      toast({
        title: "Report Created",
        description: "Your custom report has been created successfully.",
      });
    }, 1000);
  };

  const handleScheduleReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowScheduleReport(false);
      toast({
        title: "Report Scheduled",
        description:
          "Your report has been scheduled and will be sent automatically.",
      });
    }, 1000);
  };

  const handleRunReport = (report: any) => {
    setIsLoading(true);
    setSelectedReport(report);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Report Generated",
        description: `${report.name} has been generated successfully.`,
      });
    }, 1500);
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Report is being exported to ${format.toUpperCase()} format.`,
    });
  };

  const handlePrintReport = () => {
    toast({
      title: "Print Job Started",
      description: "Report is being prepared for printing.",
    });
  };

  const handleEmailReport = () => {
    toast({
      title: "Email Sent",
      description: "Report has been emailed to selected recipients.",
    });
  };

  const toggleSectionExpand = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  // Filter saved reports based on selected type
  const filteredReports = savedReports.filter((report) => {
    return selectedReportType === "all" || report.type === selectedReportType;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScheduleReport(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button size="sm" onClick={() => setShowCreateReport(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Graduates
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,020</div>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500 text-green-500"
              >
                <ArrowUpRight className="h-3 w-3" />
                +4.1%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clearance Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">93%</div>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500 text-green-500"
              >
                <ArrowUpRight className="h-3 w-3" />
                +0.5%
              </Badge>
            </div>
            <Progress value={93} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Generated
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$255,000</div>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-green-500 text-green-500"
              >
                <ArrowUpRight className="h-3 w-3" />
                +6.2%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              From graduation fees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Count</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-blue-500 text-blue-500"
              >
                Stable
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              All faculties represented
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Dashboard</CardTitle>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {dateRange === "year"
                        ? "Last Year"
                        : dateRange === "quarter"
                        ? "Last Quarter"
                        : "Last Month"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              Key metrics and trends for graduation management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Graduation Trends Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Graduation Trends</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionExpand("graduationTrends")}
                  >
                    {expandedSection === "graduationTrends" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Historical graduation data and forecasts
                </CardDescription>
              </CardHeader>
              {expandedSection === "graduationTrends" && (
                <CardContent className="pt-0">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={graduationTrendsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="graduates"
                          stroke="#f97316"
                          activeDot={{ r: 8 }}
                          name="Graduates"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="applications"
                          stroke="#0ea5e9"
                          name="Applications"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="clearanceRate"
                          stroke="#22c55e"
                          name="Clearance Rate (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Average Growth Rate
                      </div>
                      <div className="text-2xl font-bold">3.7%</div>
                      <div className="text-xs text-muted-foreground">
                        Year over year
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Projected 2026
                      </div>
                      <div className="text-2xl font-bold">1,060</div>
                      <div className="text-xs text-muted-foreground">
                        Estimated graduates
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Completion Rate
                      </div>
                      <div className="text-2xl font-bold">92.7%</div>
                      <div className="text-xs text-muted-foreground">
                        Applications to graduates
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Faculty Distribution Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Faculty Distribution
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionExpand("facultyDistribution")}
                  >
                    {expandedSection === "facultyDistribution" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Graduate distribution across faculties
                </CardDescription>
              </CardHeader>
              {expandedSection === "facultyDistribution" && (
                <CardContent className="pt-0">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={facultyDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {facultyDistributionData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {facultyDistributionData.map((faculty, index) => (
                      <div
                        key={faculty.name}
                        className="rounded-md border p-2 text-center"
                      >
                        <div
                          className="h-3 w-full rounded-full mb-2"
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <div className="text-xs font-medium">
                          {faculty.name}
                        </div>
                        <div className="text-lg font-bold">
                          {faculty.value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Clearance Progress Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Clearance Progress
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionExpand("clearanceProgress")}
                  >
                    {expandedSection === "clearanceProgress" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Monthly clearance completion rates
                </CardDescription>
              </CardHeader>
              {expandedSection === "clearanceProgress" && (
                <CardContent className="pt-0">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={clearanceProgressData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stackId="1"
                          stroke="#22c55e"
                          fill="#22c55e"
                          name="Completed"
                        />
                        <Area
                          type="monotone"
                          dataKey="pending"
                          stackId="1"
                          stroke="#f97316"
                          fill="#f97316"
                          name="Pending"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Current Completion Rate
                      </div>
                      <div className="text-2xl font-bold">90%</div>
                      <Progress value={90} className="h-2 mt-2" />
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Monthly Improvement
                      </div>
                      <div className="text-2xl font-bold">+5%</div>
                      <div className="text-xs text-muted-foreground">
                        Average monthly increase
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Financial Report Section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Financial Report</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionExpand("financialReport")}
                  >
                    {expandedSection === "financialReport" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>
                  Revenue and expenses from graduation process
                </CardDescription>
              </CardHeader>
              {expandedSection === "financialReport" && (
                <CardContent className="pt-0">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={financialReportData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                        <Bar
                          dataKey="expenses"
                          fill="#ef4444"
                          name="Expenses"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Total Revenue
                      </div>
                      <div className="text-2xl font-bold">$180,000</div>
                      <div className="text-xs text-muted-foreground">
                        Last 6 months
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Total Expenses
                      </div>
                      <div className="text-2xl font-bold">$123,000</div>
                      <div className="text-xs text-muted-foreground">
                        Last 6 months
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Net Profit
                      </div>
                      <div className="text-2xl font-bold">$57,000</div>
                      <div className="text-xs text-muted-foreground">
                        31.7% margin
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>
                Access and run previously created reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      className="pl-8"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={selectedReportType}
                      onValueChange={setSelectedReportType}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedReportType || "Report Type"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Graduation">Graduation</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Clearance">Clearance</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No reports found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="font-medium">{report.name}</div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  report.type === "Graduation"
                                    ? "border-blue-500 text-blue-500"
                                    : report.type === "Financial"
                                    ? "border-green-500 text-green-500"
                                    : report.type === "Clearance"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-purple-500 text-purple-500"
                                )}
                              >
                                {report.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.createdBy}</TableCell>
                            <TableCell>
                              {format(report.createdAt, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {format(report.lastRun, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRunReport(report)}
                                  disabled={isLoading}
                                >
                                  {isLoading &&
                                  selectedReport?.id === report.id ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <BarChart2 className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePrintReport()}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEmailReport()}
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </div>
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

        <TabsContent value="scheduled" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automatically generated and distributed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setShowScheduleReport(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New Report
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Run</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="font-medium">{report.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                report.type === "Graduation"
                                  ? "border-blue-500 text-blue-500"
                                  : report.type === "Financial"
                                  ? "border-green-500 text-green-500"
                                  : "border-yellow-500 text-yellow-500"
                              )}
                            >
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.frequency}</TableCell>
                          <TableCell>
                            {format(report.nextRun, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {report.recipients}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-500"
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <BarChart2 className="h-4 w-4" />
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

        <TabsContent value="custom" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Create and customize your own reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setShowCreateReport(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Custom Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Graduation Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Graduation Trends Report" })
                        }
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Graduation Trends
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({
                            name: "Faculty Distribution Report",
                          })
                        }
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        Faculty Distribution
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Program Completion Report" })
                        }
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Program Completion
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Financial Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Revenue Summary Report" })
                        }
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Revenue Summary
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Payment Status Report" })
                        }
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Payment Status
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Financial Forecast Report" })
                        }
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Financial Forecast
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Clearance Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Clearance Progress Report" })
                        }
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Clearance Progress
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({
                            name: "Department Bottlenecks Report",
                          })
                        }
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Department Bottlenecks
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() =>
                          handleRunReport({ name: "Clearance Timeline Report" })
                        }
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Clearance Timeline
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Report Dialog */}
      <Dialog open={showCreateReport} onOpenChange={setShowCreateReport}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Design a custom report with specific metrics and visualizations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="reportName" className="text-right">
                Report Name
              </Label>
              <Input
                id="reportName"
                placeholder="Enter report name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="reportType" className="text-right">
                Report Type
              </Label>
              <Select defaultValue="graduation">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="clearance">Clearance</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="dateRange" className="text-right">
                Date Range
              </Label>
              <Select defaultValue="year">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-3">Include Metrics</h3>
              <div className="space-y-2 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="totalGraduates" defaultChecked />
                    <label
                      htmlFor="totalGraduates"
                      className="text-sm leading-none"
                    >
                      Total Graduates
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="clearanceRate" defaultChecked />
                    <label
                      htmlFor="clearanceRate"
                      className="text-sm leading-none"
                    >
                      Clearance Rate
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="facultyDistribution" defaultChecked />
                    <label
                      htmlFor="facultyDistribution"
                      className="text-sm leading-none"
                    >
                      Faculty Distribution
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="revenueGenerated" defaultChecked />
                    <label
                      htmlFor="revenueGenerated"
                      className="text-sm leading-none"
                    >
                      Revenue Generated
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="yearOverYear" />
                    <label
                      htmlFor="yearOverYear"
                      className="text-sm leading-none"
                    >
                      Year-over-Year Comparison
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="projections" />
                    <label
                      htmlFor="projections"
                      className="text-sm leading-none"
                    >
                      Future Projections
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-3">Visualizations</h3>
              <div className="space-y-2 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="barChart" defaultChecked />
                    <label htmlFor="barChart" className="text-sm leading-none">
                      Bar Charts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="lineChart" defaultChecked />
                    <label htmlFor="lineChart" className="text-sm leading-none">
                      Line Charts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pieChart" defaultChecked />
                    <label htmlFor="pieChart" className="text-sm leading-none">
                      Pie Charts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tables" defaultChecked />
                    <label htmlFor="tables" className="text-sm leading-none">
                      Data Tables
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="saveReport" defaultChecked />
                <label
                  htmlFor="saveReport"
                  className="text-sm font-medium leading-none"
                >
                  Save report for future use
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="scheduleReport" />
                <label
                  htmlFor="scheduleReport"
                  className="text-sm font-medium leading-none"
                >
                  Schedule this report to run automatically
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateReport(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateReport} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BarChart2 className="mr-2 h-4 w-4" />
              )}
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog open={showScheduleReport} onOpenChange={setShowScheduleReport}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up automatic report generation and distribution.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="scheduleReportName" className="text-right">
                Report Name
              </Label>
              <Input
                id="scheduleReportName"
                placeholder="Enter report name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="scheduleReportType" className="text-right">
                Report Type
              </Label>
              <Select defaultValue="clearance">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graduation">Graduation</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="clearance">Clearance</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="recipients" className="text-right">
                Recipients
              </Label>
              <Input
                id="recipients"
                placeholder="Enter email addresses (comma separated)"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="format" className="text-right">
                Format
              </Label>
              <Select defaultValue="pdf">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeCharts" defaultChecked />
                <label
                  htmlFor="includeCharts"
                  className="text-sm font-medium leading-none"
                >
                  Include charts and visualizations
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="includeRawData" defaultChecked />
                <label
                  htmlFor="includeRawData"
                  className="text-sm font-medium leading-none"
                >
                  Include raw data tables
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="saveReportCopy" defaultChecked />
                <label
                  htmlFor="saveReportCopy"
                  className="text-sm font-medium leading-none"
                >
                  Save a copy in the system
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleReport(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleReport} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
