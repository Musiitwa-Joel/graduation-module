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
  Shield,
  Lock,
  UserCog,
  Key,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Download,
  MoreHorizontal,
  AlertTriangle,
  Database,
  FileText,
  Settings,
  Users,
  Activity,
  LogOut,
  Save,
  RotateCcw,
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

// Mock user data
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@university.edu",
    role: "Administrator",
    department: "Academic Registry",
    lastLogin: new Date(2025, 4, 15, 10, 30),
    status: "Active",
  },
  {
    id: "2",
    name: "John Registrar",
    email: "registrar@university.edu",
    role: "Registrar",
    department: "Academic Registry",
    lastLogin: new Date(2025, 4, 14, 15, 45),
    status: "Active",
  },
  {
    id: "3",
    name: "Sarah Finance",
    email: "finance@university.edu",
    role: "Finance Officer",
    department: "Finance Department",
    lastLogin: new Date(2025, 4, 13, 9, 15),
    status: "Active",
  },
  {
    id: "4",
    name: "Michael Examiner",
    email: "examiner@university.edu",
    role: "Examinations Officer",
    department: "Examinations Office",
    lastLogin: new Date(2025, 4, 12, 14, 20),
    status: "Inactive",
  },
  {
    id: "5",
    name: "Emily Faculty",
    email: "faculty@university.edu",
    role: "Faculty Admin",
    department: "Engineering",
    lastLogin: new Date(2025, 4, 10, 11, 10),
    status: "Active",
  },
];

// Mock roles and permissions
const roles = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 1,
    permissions: [
      "user_management",
      "role_management",
      "system_settings",
      "audit_logs",
      "backup_restore",
      "student_management",
      "clearance_approval",
      "finance_management",
      "document_management",
      "reports_analytics",
    ],
  },
  {
    id: "2",
    name: "Registrar",
    description: "Manages student records and clearance processes",
    userCount: 3,
    permissions: [
      "student_management",
      "clearance_approval",
      "document_management",
      "reports_view",
    ],
  },
  {
    id: "3",
    name: "Finance Officer",
    description: "Manages payment verification and financial records",
    userCount: 2,
    permissions: ["finance_management", "payment_verification", "reports_view"],
  },
  {
    id: "4",
    name: "Examinations Officer",
    description: "Manages examination clearance and results",
    userCount: 2,
    permissions: [
      "examination_clearance",
      "results_management",
      "reports_view",
    ],
  },
  {
    id: "5",
    name: "Faculty Admin",
    description: "Manages faculty-specific clearance and approvals",
    userCount: 5,
    permissions: ["faculty_clearance", "student_view", "reports_view"],
  },
];

// Mock audit logs
const auditLogs = [
  {
    id: "1",
    user: "Admin User",
    action: "User Created",
    details: "Created new user: Emily Faculty",
    timestamp: new Date(2025, 4, 15, 10, 30),
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    user: "John Registrar",
    action: "Clearance Approved",
    details: "Approved clearance for student ID: STU001",
    timestamp: new Date(2025, 4, 14, 15, 45),
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    user: "Sarah Finance",
    action: "Payment Verified",
    details: "Verified payment for student ID: STU002",
    timestamp: new Date(2025, 4, 13, 9, 15),
    ipAddress: "192.168.1.3",
  },
  {
    id: "4",
    user: "Admin User",
    action: "Role Modified",
    details: "Updated permissions for role: Faculty Admin",
    timestamp: new Date(2025, 4, 12, 14, 20),
    ipAddress: "192.168.1.1",
  },
  {
    id: "5",
    user: "Michael Examiner",
    action: "Examination Cleared",
    details: "Cleared examination for student ID: STU003",
    timestamp: new Date(2025, 4, 10, 11, 10),
    ipAddress: "192.168.1.4",
  },
  {
    id: "6",
    user: "Admin User",
    action: "System Backup",
    details: "Initiated system backup",
    timestamp: new Date(2025, 4, 9, 8, 0),
    ipAddress: "192.168.1.1",
  },
  {
    id: "7",
    user: "Admin User",
    action: "Settings Changed",
    details: "Updated system encryption settings",
    timestamp: new Date(2025, 4, 8, 16, 30),
    ipAddress: "192.168.1.1",
  },
];

// Mock backup history
const backupHistory = [
  {
    id: "1",
    name: "Full System Backup",
    date: new Date(2025, 4, 15),
    size: "1.2 GB",
    status: "Completed",
    type: "Automatic",
  },
  {
    id: "2",
    name: "Database Backup",
    date: new Date(2025, 4, 8),
    size: "850 MB",
    status: "Completed",
    type: "Manual",
  },
  {
    id: "3",
    name: "Student Records Backup",
    date: new Date(2025, 4, 1),
    size: "450 MB",
    status: "Completed",
    type: "Automatic",
  },
  {
    id: "4",
    name: "Full System Backup",
    date: new Date(2025, 3, 24),
    size: "1.1 GB",
    status: "Completed",
    type: "Automatic",
  },
  {
    id: "5",
    name: "Emergency Backup",
    date: new Date(2025, 3, 20),
    size: "1.2 GB",
    status: "Completed",
    type: "Manual",
  },
];

export default function SystemAdministration() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [selectedRoleData, setSelectedRoleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "Registrar",
    department: "Academic Registry",
    password: "",
    confirmPassword: "",
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? user.role === selectedRole : true;
    const matchesStatus = selectedStatus
      ? user.status === selectedStatus
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAddUser(false);
      toast({
        title: "User Created",
        description: `New user ${newUserData.name} has been created successfully.`,
      });
      // Reset form
      setNewUserData({
        name: "",
        email: "",
        role: "Registrar",
        department: "Academic Registry",
        password: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  const handleEditRole = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowEditRole(false);
      toast({
        title: "Role Updated",
        description: `Role ${selectedRoleData?.name} has been updated successfully.`,
      });
    }, 1000);
  };

  const handleBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowBackupDialog(false);
      toast({
        title: "Backup Initiated",
        description: "System backup has been initiated successfully.",
      });
    }, 1500);
  };

  const handleExportLogs = () => {
    toast({
      title: "Export Started",
      description: "Audit logs are being exported to CSV",
    });
  };

  const handleRestoreBackup = (backup: any) => {
    toast({
      title: "Restore Initiated",
      description: `Restoring system from backup: ${backup.name}`,
    });
  };

  const handleDeleteUser = (user: any) => {
    toast({
      title: "User Deleted",
      description: `User ${user.name} has been deleted successfully.`,
    });
  };

  const handleEditUser = (user: any) => {
    toast({
      title: "Edit User",
      description: `Editing user ${user.name}`,
    });
  };

  const handleViewRole = (role: any) => {
    setSelectedRoleData(role);
    setShowEditRole(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          System Administration
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBackupDialog(true)}
          >
            <Database className="mr-2 h-4 w-4" />
            Backup System
          </Button>
          <Button size="sm" onClick={() => setShowAddUser(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Active system users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Defined access roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Status
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Secure</div>
            <p className="text-xs text-muted-foreground">
              Last security audit: 3 days ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(backupHistory[0].date, "MMM d, yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              Size: {backupHistory[0].size}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage system users and their access rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, email, or department..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>{selectedRole || "Role"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No users found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              {format(user.lastLogin, "MMM d, h:mm a")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  user.status === "Active"
                                    ? "border-green-500 text-green-500"
                                    : "border-red-500 text-red-500"
                                )}
                              >
                                {user.status}
                              </Badge>
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
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Key className="mr-2 h-4 w-4" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {user.status === "Active" ? (
                                      <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={() => handleDeleteUser(user)}
                                  >
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

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Manage system roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-end">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="font-medium">{role.name}</div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.userCount}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {role.permissions.length} permissions
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRole(role)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit Role
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

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Track and monitor user activities in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search logs..."
                      className="pl-8"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportLogs}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                log.action.includes("Created") ||
                                  log.action.includes("Approved") ||
                                  log.action.includes("Verified") ||
                                  log.action.includes("Cleared")
                                  ? "border-green-500 text-green-500"
                                  : log.action.includes("Modified") ||
                                    log.action.includes("Changed") ||
                                    log.action.includes("Backup")
                                  ? "border-blue-500 text-blue-500"
                                  : "border-yellow-500 text-yellow-500"
                              )}
                            >
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.details}</TableCell>
                          <TableCell>
                            {format(log.timestamp, "MMM d, h:mm a")}
                          </TableCell>
                          <TableCell>{log.ipAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>
                Manage system backups and data recovery options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Backup History</h3>
                  <Button size="sm" onClick={() => setShowBackupDialog(true)}>
                    <Database className="mr-2 h-4 w-4" />
                    Create Backup
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Backup Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell>
                            <div className="font-medium">{backup.name}</div>
                          </TableCell>
                          <TableCell>
                            {format(backup.date, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                backup.type === "Automatic"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-yellow-500 text-yellow-500"
                              }
                            >
                              {backup.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-500"
                            >
                              {backup.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRestoreBackup(backup)}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Backup Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Automatic Backups
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Status:</span>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-500"
                          >
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Frequency:</span>
                          <span className="text-sm font-medium">Weekly</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Day:</span>
                          <span className="text-sm font-medium">Sunday</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Time:</span>
                          <span className="text-sm font-medium">2:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Retention:</span>
                          <span className="text-sm font-medium">
                            Last 5 backups
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          Data Encryption
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Status:</span>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-500"
                          >
                            Enabled
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Algorithm:</span>
                          <span className="text-sm font-medium">AES-256</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Key Rotation:</span>
                          <span className="text-sm font-medium">90 days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Rotated:</span>
                          <span className="text-sm font-medium">
                            30 days ago
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">
                          <Key className="mr-2 h-4 w-4" />
                          Manage Keys
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    email: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUserData.role}
                onValueChange={(value) =>
                  setNewUserData({
                    ...newUserData,
                    role: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select
                value={newUserData.department}
                onValueChange={(value) =>
                  setNewUserData({
                    ...newUserData,
                    department: value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic Registry">
                    Academic Registry
                  </SelectItem>
                  <SelectItem value="Finance Department">
                    Finance Department
                  </SelectItem>
                  <SelectItem value="Examinations Office">
                    Examinations Office
                  </SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    password: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUserData.confirmPassword}
                onChange={(e) =>
                  setNewUserData({
                    ...newUserData,
                    confirmPassword: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Checkbox id="sendEmail" />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Send welcome email with login details
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={showEditRole} onOpenChange={setShowEditRole}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              {selectedRoleData &&
                `Modify permissions for the ${selectedRoleData.name} role.`}
            </DialogDescription>
          </DialogHeader>
          {selectedRoleData && (
            <div className="py-4">
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="roleName" className="text-right">
                  Role Name
                </Label>
                <Input
                  id="roleName"
                  value={selectedRoleData.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mb-4">
                <Label htmlFor="roleDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="roleDescription"
                  value={selectedRoleData.description}
                  className="col-span-3"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3">Permissions</h3>
                <div className="space-y-2 border rounded-md p-4">
                  <h4 className="font-medium mb-2">User Management</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="view_users"
                        checked={selectedRoleData.permissions.includes(
                          "user_management"
                        )}
                      />
                      <label
                        htmlFor="view_users"
                        className="text-sm leading-none"
                      >
                        View Users
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="create_users"
                        checked={selectedRoleData.permissions.includes(
                          "user_management"
                        )}
                      />
                      <label
                        htmlFor="create_users"
                        className="text-sm leading-none"
                      >
                        Create Users
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit_users"
                        checked={selectedRoleData.permissions.includes(
                          "user_management"
                        )}
                      />
                      <label
                        htmlFor="edit_users"
                        className="text-sm leading-none"
                      >
                        Edit Users
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="delete_users"
                        checked={selectedRoleData.permissions.includes(
                          "user_management"
                        )}
                      />
                      <label
                        htmlFor="delete_users"
                        className="text-sm leading-none"
                      >
                        Delete Users
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Student Management</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="view_students"
                          checked={selectedRoleData.permissions.includes(
                            "student_management"
                          )}
                        />
                        <label
                          htmlFor="view_students"
                          className="text-sm leading-none"
                        >
                          View Students
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit_students"
                          checked={selectedRoleData.permissions.includes(
                            "student_management"
                          )}
                        />
                        <label
                          htmlFor="edit_students"
                          className="text-sm leading-none"
                        >
                          Edit Students
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="clearance_approval"
                          checked={selectedRoleData.permissions.includes(
                            "clearance_approval"
                          )}
                        />
                        <label
                          htmlFor="clearance_approval"
                          className="text-sm leading-none"
                        >
                          Clearance Approval
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="graduation_list"
                          checked={selectedRoleData.permissions.includes(
                            "student_management"
                          )}
                        />
                        <label
                          htmlFor="graduation_list"
                          className="text-sm leading-none"
                        >
                          Graduation List
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">System Administration</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="system_settings"
                          checked={selectedRoleData.permissions.includes(
                            "system_settings"
                          )}
                        />
                        <label
                          htmlFor="system_settings"
                          className="text-sm leading-none"
                        >
                          System Settings
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="audit_logs"
                          checked={selectedRoleData.permissions.includes(
                            "audit_logs"
                          )}
                        />
                        <label
                          htmlFor="audit_logs"
                          className="text-sm leading-none"
                        >
                          Audit Logs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="backup_restore"
                          checked={selectedRoleData.permissions.includes(
                            "backup_restore"
                          )}
                        />
                        <label
                          htmlFor="backup_restore"
                          className="text-sm leading-none"
                        >
                          Backup & Restore
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="role_management"
                          checked={selectedRoleData.permissions.includes(
                            "role_management"
                          )}
                        />
                        <label
                          htmlFor="role_management"
                          className="text-sm leading-none"
                        >
                          Role Management
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRole(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create System Backup</DialogTitle>
            <DialogDescription>
              Create a new backup of the system data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="backupName" className="text-right">
                Backup Name
              </Label>
              <Input
                id="backupName"
                defaultValue="Manual Backup"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="backupType" className="text-right">
                Backup Type
              </Label>
              <Select defaultValue="full">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full System Backup</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="students">Student Records Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Important Note</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating a backup may temporarily affect system performance.
                Consider scheduling backups during off-peak hours.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="compressBackup" defaultChecked />
                <label
                  htmlFor="compressBackup"
                  className="text-sm font-medium leading-none"
                >
                  Compress backup files
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="encryptBackup" defaultChecked />
                <label
                  htmlFor="encryptBackup"
                  className="text-sm font-medium leading-none"
                >
                  Encrypt backup data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="downloadBackup" />
                <label
                  htmlFor="downloadBackup"
                  className="text-sm font-medium leading-none"
                >
                  Download backup after completion
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBackupDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBackup} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              Create Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
