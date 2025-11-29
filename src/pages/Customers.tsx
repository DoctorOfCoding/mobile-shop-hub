import { useState } from "react";
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  ShoppingBag,
  Wrench,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const customers = [
  {
    id: "1",
    name: "Ahmed Khan",
    phone: "0300-1234567",
    email: "ahmed@email.com",
    totalPurchases: 12,
    totalSpent: 125000,
    totalRepairs: 3,
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "Sara Ali",
    phone: "0321-9876543",
    email: "sara.ali@email.com",
    totalPurchases: 8,
    totalSpent: 85000,
    totalRepairs: 1,
    lastVisit: "2024-01-14",
  },
  {
    id: "3",
    name: "Hassan Raza",
    phone: "0333-5551234",
    email: null,
    totalPurchases: 25,
    totalSpent: 245000,
    totalRepairs: 5,
    lastVisit: "2024-01-16",
  },
  {
    id: "4",
    name: "Fatima Zahra",
    phone: "0345-6789012",
    email: "fatima.z@email.com",
    totalPurchases: 6,
    totalSpent: 52000,
    totalRepairs: 2,
    lastVisit: "2024-01-13",
  },
  {
    id: "5",
    name: "Bilal Ahmed",
    phone: "0312-3456789",
    email: "bilal.ahmed@email.com",
    totalPurchases: 15,
    totalSpent: 180000,
    totalRepairs: 0,
    lastVisit: "2024-01-16",
  },
  {
    id: "6",
    name: "Ayesha Malik",
    phone: "0301-1112233",
    email: null,
    totalPurchases: 3,
    totalSpent: 28000,
    totalRepairs: 1,
    lastVisit: "2024-01-10",
  },
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpent = Math.round(totalRevenue / totalCustomers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="03XX-XXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-xl font-bold">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <ShoppingBag className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-success">Rs {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <User className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Spending</p>
              <p className="text-xl font-bold">Rs {avgSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {customer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{customer.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <ShoppingBag className="w-3 h-3" />
                  <span className="text-xs">Purchases</span>
                </div>
                <p className="font-bold">{customer.totalPurchases}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Wrench className="w-3 h-3" />
                  <span className="text-xs">Repairs</span>
                </div>
                <p className="font-bold">{customer.totalRepairs}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm border-t border-border pt-3">
              <div>
                <p className="text-muted-foreground text-xs">Total Spent</p>
                <p className="font-semibold text-success">Rs {customer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                <span>Last: {customer.lastVisit}</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-3">
              View History
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
