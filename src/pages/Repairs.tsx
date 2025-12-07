import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Wrench,
  Clock,
  CheckCircle,
  Phone,
  User,
  Calendar,
  Pencil,
  Trash2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRepairs, Repair, RepairFormData } from "@/hooks/useRepairs";
import { CustomerSelector } from "@/components/CustomerSelector";
import { Customer } from "@/hooks/useCustomers";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-info/10 text-info border-info/20", icon: Wrench },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/20", icon: CheckCircle },
  delivered: { label: "Delivered", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

export default function Repairs() {
  const { repairs, loading, addRepair, updateRepair, deleteRepair } = useRepairs();
  const { isAdmin } = useIsAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<RepairFormData>({
    customer_name: "", customer_phone: "", device_model: "", imei: "", problem: "", estimated_cost: 0, advance_payment: 0, technician: ""
  });

  // Auto-populate date when dialog opens
  const currentDateTime = new Date().toLocaleString();

  const filteredJobs = repairs.filter((job) => {
    const matchesSearch =
      job.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.device_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: repairs.filter((j) => j.status === "pending").length,
    inProgress: repairs.filter((j) => j.status === "in_progress").length,
    completed: repairs.filter((j) => j.status === "completed").length,
    delivered: repairs.filter((j) => j.status === "delivered").length,
  };

  const handleAdd = async () => {
    // Use selected customer data if available
    const customerData = selectedCustomer 
      ? { customer_name: selectedCustomer.name, customer_phone: selectedCustomer.phone }
      : { customer_name: formData.customer_name, customer_phone: formData.customer_phone };
    
    const success = await addRepair({ ...formData, ...customerData });
    if (success) {
      setIsAddDialogOpen(false);
      setSelectedCustomer(null);
      setFormData({ customer_name: "", customer_phone: "", device_model: "", imei: "", problem: "", estimated_cost: 0, advance_payment: 0, technician: "" });
    }
  };

  const handleUpdateStatus = async (repair: Repair, newStatus: Repair["status"]) => {
    await updateRepair(repair.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (!selectedRepair) return;
    const success = await deleteRepair(selectedRepair.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedRepair(null);
    }
  };

  const openEditDialog = (repair: Repair) => {
    setSelectedRepair(repair);
    setFormData({
      customer_name: repair.customer_name,
      customer_phone: repair.customer_phone,
      device_model: repair.device_model,
      imei: repair.imei || "",
      problem: repair.problem,
      estimated_cost: Number(repair.estimated_cost),
      advance_payment: Number(repair.advance_payment),
      technician: repair.technician || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedRepair) return;
    const success = await updateRepair(selectedRepair.id, formData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedRepair(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

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
            <Button variant="glow" onClick={() => { setSelectedCustomer(null); setFormData({ customer_name: "", customer_phone: "", device_model: "", imei: "", problem: "", estimated_cost: 0, advance_payment: 0, technician: "" }); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Repair Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Register New Repair Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              {/* Date/Time Display */}
              <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created: {currentDateTime}</span>
              </div>

              {/* Customer Selection */}
              <div className="space-y-2">
                <Label>Select Existing Customer</Label>
                <CustomerSelector
                  value={selectedCustomer}
                  onSelect={(customer) => {
                    setSelectedCustomer(customer);
                    if (customer) {
                      setFormData({ ...formData, customer_name: customer.name, customer_phone: customer.phone });
                    }
                  }}
                  placeholder="Select or add customer..."
                  className="w-full"
                />
              </div>

              {!selectedCustomer && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} placeholder="Enter name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} placeholder="03XX-XXXXXXX" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Device Model</Label>
                  <Input value={formData.device_model} onChange={(e) => setFormData({ ...formData, device_model: e.target.value })} placeholder="e.g. iPhone 14 Pro" />
                </div>
                <div className="space-y-2">
                  <Label>IMEI (Optional)</Label>
                  <Input value={formData.imei || ""} onChange={(e) => setFormData({ ...formData, imei: e.target.value })} placeholder="15 digit IMEI" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Problem Description</Label>
                <Textarea value={formData.problem} onChange={(e) => setFormData({ ...formData, problem: e.target.value })} placeholder="Describe the issue..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estimated Cost (Rs)</Label>
                  <Input type="number" value={formData.estimated_cost} onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Advance Payment (Rs)</Label>
                  <Input type="number" value={formData.advance_payment} onChange={(e) => setFormData({ ...formData, advance_payment: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Technician</Label>
                <Select value={formData.technician || ""} onValueChange={(v) => setFormData({ ...formData, technician: v })}>
                  <SelectTrigger><SelectValue placeholder="Select technician" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Usman">Usman</SelectItem>
                    <SelectItem value="Ali">Ali</SelectItem>
                    <SelectItem value="Hassan">Hassan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAdd}>Create Repair Job</Button>
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
          <Input placeholder="Search by customer, device or job ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
          const status = statusConfig[job.status];
          const StatusIcon = status.icon;

          return (
            <div key={job.id} className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-sm text-muted-foreground">{job.job_id}</span>
                  <h3 className="font-semibold">{job.device_model}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("border", status.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(job)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setSelectedRepair(job); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.problem}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{job.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{job.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated</p>
                  <p className="font-semibold">Rs {Number(job.estimated_cost).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Advance</p>
                  <p className="font-semibold text-success">Rs {Number(job.advance_payment).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Select value={job.status} onValueChange={(v) => handleUpdateStatus(job, v as Repair["status"])}>
                  <SelectTrigger className="flex-1 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Repair Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Device Model</Label>
                <Input value={formData.device_model} onChange={(e) => setFormData({ ...formData, device_model: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>IMEI</Label>
                <Input value={formData.imei || ""} onChange={(e) => setFormData({ ...formData, imei: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Problem Description</Label>
              <Textarea value={formData.problem} onChange={(e) => setFormData({ ...formData, problem: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Cost (Rs)</Label>
                <Input type="number" value={formData.estimated_cost} onChange={(e) => setFormData({ ...formData, estimated_cost: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Advance Payment (Rs)</Label>
                <Input type="number" value={formData.advance_payment} onChange={(e) => setFormData({ ...formData, advance_payment: Number(e.target.value) })} />
              </div>
            </div>
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repair Job</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete repair job {selectedRepair?.job_id}? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
