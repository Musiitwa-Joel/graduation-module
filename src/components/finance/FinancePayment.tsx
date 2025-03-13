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
  DollarSign,
  ClipboardCheck,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  BarChart2,
  PieChart,
  TrendingUp,
  CreditCard,
  Receipt,
  AlertCircle,
  Eye,
  Edit2,
  Plus,
  Calendar,
  Printer,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import PaymentChart from "./PaymentChart";
import PaymentMethodChart from "./PaymentMethodChart";

// Mock payment data
const paymentHistory = [
  {
    id: "1",
    studentId: "STU001",
    studentName: "John Smith",
    amount: 250,
    paymentMethod: "Credit Card",
    transactionId: "TRX123456",
    status: "Completed",
    date: new Date(2025, 3, 15),
  },
  {
    id: "2",
    studentId: "STU002",
    studentName: "Sarah Johnson",
    amount: 250,
    paymentMethod: "Bank Transfer",
    transactionId: "TRX123457",
    status: "Completed",
    date: new Date(2025, 3, 14),
  },
  {
    id: "3",
    studentId: "STU003",
    studentName: "Michael Brown",
    amount: 250,
    paymentMethod: "Mobile Money",
    transactionId: "TRX123458",
    status: "Pending",
    date: new Date(2025, 3, 13),
  },
  {
    id: "4",
    studentId: "STU004",
    studentName: "Emily Davis",
    amount: 250,
    paymentMethod: "Credit Card",
    transactionId: "TRX123459",
    status: "Failed",
    date: new Date(2025, 3, 12),
  },
  {
    id: "5",
    studentId: "STU005",
    studentName: "David Wilson",
    amount: 250,
    paymentMethod: "Mobile Money",
    transactionId: "TRX123460",
    status: "Completed",
    date: new Date(2025, 3, 11),
  },
];

// Mock payment methods
const paymentMethods = [
  { id: "1", name: "Credit Card", enabled: true, fee: "2.5%" },
  { id: "2", name: "Bank Transfer", enabled: true, fee: "1.0%" },
  { id: "3", name: "Mobile Money", enabled: true, fee: "1.8%" },
  { id: "4", name: "Cash", enabled: true, fee: "0%" },
  { id: "5", name: "PayPal", enabled: false, fee: "3.5%" },
];

export default function FinancePayment() {
  const { students } = useStudents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [manualPaymentData, setManualPaymentData] = useState({
    studentId: "",
    amount: "250",
    paymentMethod: "Cash",
    reference: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Filter payments based on search and filters
  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus
      ? payment.status === selectedStatus
      : true;
    const matchesPaymentMethod = selectedPaymentMethod
      ? payment.paymentMethod === selectedPaymentMethod
      : true;

    // Date range filtering
    let matchesDateRange = true;
    const today = new Date();
    if (dateRange === "today") {
      matchesDateRange =
        payment.date.getDate() === today.getDate() &&
        payment.date.getMonth() === today.getMonth() &&
        payment.date.getFullYear() === today.getFullYear();
    } else if (dateRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesDateRange = payment.date >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDateRange = payment.date >= monthAgo;
    }

    return (
      matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange
    );
  });

  const handleManualPaymentSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowManualPayment(false);
      toast({
        title: "Payment Recorded",
        description: `Manual payment for ${manualPaymentData.studentId} has been recorded successfully.`,
      });
      // Reset form
      setManualPaymentData({
        studentId: "",
        amount: "250",
        paymentMethod: "Cash",
        reference: "",
        notes: "",
      });
    }, 1000);
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Payment report is being exported to Excel",
    });
  };

  const handlePrintReceipt = (payment: any) => {
    toast({
      title: "Printing Receipt",
      description: `Receipt for ${payment.studentName} is being prepared for printing.`,
    });
  };

  const handleSendReceipt = (payment: any) => {
    toast({
      title: "Email Sent",
      description: `Receipt has been emailed to ${payment.studentName}.`,
    });
  };

  const handleViewPaymentDetails = (payment: any) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const totalRevenue = paymentHistory
    .filter((p) => p.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingRevenue = paymentHistory
    .filter((p) => p.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const completedPayments = paymentHistory.filter(
    (p) => p.status === "Completed"
  ).length;

  const pendingPayments = paymentHistory.filter(
    (p) => p.status === "Pending"
  ).length;

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
      case "Failed":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-500 flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            Failed
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
          Finance & Payment Verification
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => setShowManualPayment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {completedPayments} completed payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Revenue
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {pendingPayments} pending payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Completion
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (completedPayments / (completedPayments + pendingPayments)) *
                  100
              )}
              %
            </div>
            <Progress
              value={
                (completedPayments / (completedPayments + pendingPayments)) *
                100
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Payment
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250.00</div>
            <p className="text-xs text-muted-foreground">
              Standard graduation fee
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Payment Trends</CardTitle>
            <CardDescription>
              Monthly payment activity over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PaymentChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodChart />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, ID, or transaction..."
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
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>
                            {selectedPaymentMethod || "Payment Method"}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Mobile Money">
                          Mobile Money
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
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

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No payments found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {payment.studentName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {payment.studentId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{payment.transactionId}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.paymentMethod}</TableCell>
                            <TableCell>
                              {format(payment.date, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleViewPaymentDetails(payment)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handlePrintReceipt(payment)}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSendReceipt(payment)}
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

        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Payments</CardTitle>
              <CardDescription>
                Successfully processed payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only completed payments
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>
                Payments awaiting processing or verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only pending payments
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Payments</CardTitle>
              <CardDescription>
                Payments that were unsuccessful and require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                This tab will display only failed payments
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Configuration</CardTitle>
          <CardDescription>
            Configure available payment methods and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <div className="font-medium">{method.name}</div>
                    </TableCell>
                    <TableCell>
                      {method.enabled ? (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-500"
                        >
                          Enabled
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-500 text-red-500"
                        >
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{method.fee}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Payment Dialog */}
      <Dialog open={showManualPayment} onOpenChange={setShowManualPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Manual Payment</DialogTitle>
            <DialogDescription>
              Enter payment details to record a manual payment for a student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="studentId" className="text-right">
                Student ID
              </Label>
              <Input
                id="studentId"
                value={manualPaymentData.studentId}
                onChange={(e) =>
                  setManualPaymentData({
                    ...manualPaymentData,
                    studentId: e.target.value,
                  })
                }
                placeholder="e.g. STU001"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                value={manualPaymentData.amount}
                onChange={(e) =>
                  setManualPaymentData({
                    ...manualPaymentData,
                    amount: e.target.value,
                  })
                }
                placeholder="e.g. 250.00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Method
              </Label>
              <Select
                value={manualPaymentData.paymentMethod}
                onValueChange={(value) =>
                  setManualPaymentData({
                    ...manualPaymentData,
                    paymentMethod: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">
                Reference
              </Label>
              <Input
                id="reference"
                value={manualPaymentData.reference}
                onChange={(e) =>
                  setManualPaymentData({
                    ...manualPaymentData,
                    reference: e.target.value,
                  })
                }
                placeholder="e.g. Receipt number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={manualPaymentData.notes}
                onChange={(e) =>
                  setManualPaymentData({
                    ...manualPaymentData,
                    notes: e.target.value,
                  })
                }
                placeholder="Any additional information"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManualPayment(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleManualPaymentSubmit} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Transaction ID</span>
                <span>{selectedPayment.transactionId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Student</span>
                <span>{selectedPayment.studentName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Student ID</span>
                <span>{selectedPayment.studentId}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Amount</span>
                <span>${selectedPayment.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Payment Method</span>
                <span>{selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Date</span>
                <span>{format(selectedPayment.date, "PPP")}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Status</span>
                <span>{getStatusBadge(selectedPayment.status)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedPayment && handlePrintReceipt(selectedPayment)
                }
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedPayment && handleSendReceipt(selectedPayment)
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
            </div>
            <Button
              variant="default"
              onClick={() => setShowPaymentDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
