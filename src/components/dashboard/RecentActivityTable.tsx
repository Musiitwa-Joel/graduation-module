import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const recentActivities = [
  {
    id: 1,
    studentId: 'STU001',
    studentName: 'John Smith',
    action: 'Clearance Approved',
    department: 'Academic Registrar',
    timestamp: new Date(2025, 4, 15, 10, 30),
    status: 'approved'
  },
  {
    id: 2,
    studentId: 'STU045',
    studentName: 'Sarah Johnson',
    action: 'Payment Verified',
    department: 'Finance Department',
    timestamp: new Date(2025, 4, 15, 9, 45),
    status: 'approved'
  },
  {
    id: 3,
    studentId: 'STU078',
    studentName: 'Michael Brown',
    action: 'Clearance Rejected',
    department: 'Examinations Office',
    timestamp: new Date(2025, 4, 15, 9, 15),
    status: 'rejected'
  },
  {
    id: 4,
    studentId: 'STU023',
    studentName: 'Emily Davis',
    action: 'Document Submitted',
    department: 'Academic Faculty',
    timestamp: new Date(2025, 4, 15, 8, 50),
    status: 'pending'
  },
  {
    id: 5,
    studentId: 'STU112',
    studentName: 'David Wilson',
    action: 'Added to Alumni',
    department: 'Alumni Office',
    timestamp: new Date(2025, 4, 14, 16, 20),
    status: 'approved'
  }
];

export default function RecentActivityTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{activity.studentName}</span>
                  <span className="text-xs text-muted-foreground">{activity.studentId}</span>
                </div>
              </TableCell>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.department}</TableCell>
              <TableCell className="text-sm">
                {format(activity.timestamp, 'MMM d, h:mm a')}
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}