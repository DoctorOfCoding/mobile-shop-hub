import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const repairJobs = [
  {
    id: "REP-001",
    customerName: "Ahmed Khan",
    customerPhone: "0300-1234567",
    deviceModel: "iPhone 14 Pro Max",
    imei: "123456789012345",
    problem: "Screen cracked, touch not working",
    estimatedCost: 15000,
    advancePayment: 5000,
    technician: "Usman",
    status: "in_progress",
    createdAt: "2024-01-15",
  },
  {
    id: "REP-002",
    customerName: "Sara Ali",
    customerPhone: "0321-9876543",
    deviceModel: "Samsung S23 Ultra",
    imei: "987654321098765",
    problem: "Battery draining fast, needs replacement",
    estimatedCost: 8000,
    advancePayment: 3000,
    technician: "Ali",
    status: "pending",
    createdAt: "2024-01-16",
  },
  {
    id: "REP-003",
    customerName: "Hassan Raza",
    customerPhone: "0333-5551234",
    deviceModel: "OnePlus 11",
    imei: "456789012345678",
    problem: "Charging port damaged",
    estimatedCost: 3500,
    advancePayment: 1500,
    technician: "Usman",
    status: "completed",
    createdAt: "2024-01-14",
  },
  {
    id: "REP-004",
    customerName: "Fatima Zahra",
    customerPhone: "0345-6789012",
    deviceModel: "iPhone 13",
    imei: "789012345678901",
    problem: "Water damage, not turning on",
    estimatedCost: 25000,
    advancePayment: 10000,
    technician: "Ali",
    status: "in_progress",
    createdAt: "2024-01-15",
  },
  {
    id: "REP-005",
    customerName: "Bilal Ahmed",
    customerPhone: "0312-3456789",
    deviceModel: "Xiaomi 13 Pro",
    imei: "234567890123456",
    problem: "Back camera not working",
    estimatedCost: 6000,
    advancePayment: 2000,
    technician: "Usman",
    status: "delivered",
    createdAt: "2024-01-12",
  },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-info/10 text-info border-info/20", icon: Wrench },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  delivered: { label: "Delivered", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

export default function Repairs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredJobs = repairJobs.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: repairJobs.filter((j) => j.status === "pending").length,
    inProgress: repairJobs.filter((j) => j.status === "in_progress").length,
    completed: repairJobs.filter((j) => j.status === "completed").length,
    delivered: repairJobs.filter((j) => j.status === "delivered").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Repair Jobs</h1>
          <p className="text-muted-foreground">Track and manage device repairs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              New Repair Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Register New Repair Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input id="customerPhone" placeholder="03XX-XXXXXXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Device Model</Label>
                  <Input id="deviceModel" placeholder="e.g. iPhone 14 Pro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI (Optional)</Label>
                  <Input id="imei" placeholder="15 digit IMEI" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Description</Label>
                <Textarea id="problem" placeholder="Describe the issue..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (Rs)</Label>
                  <Input id="estimatedCost" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advancePayment">Advance Payment (Rs)</Label>
                  <Input id="advancePayment" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Assign Technician</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usman">Usman</SelectItem>
                    <SelectItem value="ali">Ali</SelectItem>
                    <SelectItem value="hassan">Hassan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Create Repair Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-warning">Pending</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pending}</p>
        </div>
        <div className="bg-info/10 border border-info/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-info" />
            <span className="text-sm font-medium text-info">In Progress</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">Completed</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.completed}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Delivered</span>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, device or job ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => {
          const status = statusConfig[job.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={job.id}
              className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm text-muted-foreground">{job.id}</span>
                  <h3 className="font-semibold">{job.deviceModel}</h3>
                </div>
                <Badge className={cn("border", status.color)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.problem}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{job.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{job.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{job.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated</p>
                  <p className="font-semibold">Rs {job.estimatedCost.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Advance</p>
                  <p className="font-semibold text-success">Rs {job.advancePayment.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Update Status
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
