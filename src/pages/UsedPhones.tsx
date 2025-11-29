import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Smartphone,
  DollarSign,
  TrendingUp,
  Tag,
  ShoppingBag,
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
import { cn } from "@/lib/utils";

const usedPhones = [
  {
    id: "UP-001",
    model: "iPhone 14 Pro Max 256GB",
    imei: "123456789012345",
    condition: "excellent",
    purchasePrice: 150000,
    expectedSellingPrice: 175000,
    purchasedFrom: "Ahmed Khan",
    purchasedAt: "2024-01-10",
    status: "in_stock",
  },
  {
    id: "UP-002",
    model: "Samsung S23 Ultra 512GB",
    imei: "987654321098765",
    condition: "good",
    purchasePrice: 120000,
    expectedSellingPrice: 145000,
    purchasedFrom: "Ali Hassan",
    purchasedAt: "2024-01-12",
    status: "in_stock",
  },
  {
    id: "UP-003",
    model: "iPhone 13 Pro 128GB",
    imei: "456789012345678",
    condition: "fair",
    purchasePrice: 80000,
    expectedSellingPrice: 95000,
    actualSellingPrice: 92000,
    purchasedFrom: "Sara Ahmed",
    purchasedAt: "2024-01-05",
    soldAt: "2024-01-14",
    status: "sold",
  },
  {
    id: "UP-004",
    model: "Google Pixel 8 Pro 256GB",
    imei: "789012345678901",
    condition: "excellent",
    purchasePrice: 100000,
    expectedSellingPrice: 120000,
    purchasedFrom: "Bilal Raza",
    purchasedAt: "2024-01-14",
    status: "in_stock",
  },
  {
    id: "UP-005",
    model: "OnePlus 11 256GB",
    imei: "234567890123456",
    condition: "good",
    purchasePrice: 65000,
    expectedSellingPrice: 78000,
    actualSellingPrice: 75000,
    purchasedFrom: "Fatima Ali",
    purchasedAt: "2024-01-08",
    soldAt: "2024-01-15",
    status: "sold",
  },
];

const conditionConfig = {
  excellent: { label: "Excellent", color: "bg-success/10 text-success border-success/20" },
  good: { label: "Good", color: "bg-info/10 text-info border-info/20" },
  fair: { label: "Fair", color: "bg-warning/10 text-warning border-warning/20" },
  poor: { label: "Poor", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function UsedPhones() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPhones = usedPhones.filter((phone) => {
    const matchesSearch = phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.imei.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || phone.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const inStockPhones = usedPhones.filter((p) => p.status === "in_stock");
  const soldPhones = usedPhones.filter((p) => p.status === "sold");
  const totalProfit = soldPhones.reduce((sum, p) => sum + ((p.actualSellingPrice || 0) - p.purchasePrice), 0);
  const inventoryValue = inStockPhones.reduce((sum, p) => sum + p.expectedSellingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Used Phones</h1>
          <p className="text-muted-foreground">Buy and sell pre-owned devices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              Buy Used Phone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase Used Phone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="model">Phone Model</Label>
                <Input id="model" placeholder="e.g. iPhone 14 Pro Max 256GB" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imei">IMEI Number</Label>
                <Input id="imei" placeholder="15 digit IMEI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (Rs)</Label>
                  <Input id="purchasePrice" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedPrice">Expected Selling (Rs)</Label>
                  <Input id="expectedPrice" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchasedFrom">Purchased From</Label>
                <Input id="purchasedFrom" placeholder="Customer name" />
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add to Inventory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm">In Stock</span>
          </div>
          <p className="text-2xl font-bold">{inStockPhones.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm">Sold</span>
          </div>
          <p className="text-2xl font-bold">{soldPhones.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Tag className="w-4 h-4" />
            <span className="text-sm">Inventory Value</span>
          </div>
          <p className="text-2xl font-bold text-primary">Rs {inventoryValue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total Profit</span>
          </div>
          <p className="text-2xl font-bold text-success">Rs {totalProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by model or IMEI..."
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
            <SelectItem value="all">All Phones</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Phones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhones.map((phone) => {
          const condition = conditionConfig[phone.condition as keyof typeof conditionConfig];
          const profit = phone.status === "sold" ? (phone.actualSellingPrice || 0) - phone.purchasePrice : phone.expectedSellingPrice - phone.purchasePrice;

          return (
            <div
              key={phone.id}
              className={cn(
                "bg-card rounded-xl border p-4 shadow-card hover:shadow-card-hover transition-all duration-200",
                phone.status === "sold" ? "border-success/30" : "border-border"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{phone.model}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{phone.imei}</p>
                  </div>
                </div>
                <Badge className={cn("border", condition.color)}>
                  {condition.label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-medium">Rs {phone.purchasePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {phone.status === "sold" ? "Sold For" : "Expected Price"}
                  </span>
                  <span className="font-medium text-primary">
                    Rs {(phone.actualSellingPrice || phone.expectedSellingPrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">
                    {phone.status === "sold" ? "Profit" : "Expected Profit"}
                  </span>
                  <span className="font-semibold text-success">
                    Rs {profit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  From: {phone.purchasedFrom} • {phone.purchasedAt}
                </p>
                {phone.status === "sold" && (
                  <p className="text-xs text-success mt-1">
                    Sold on: {phone.soldAt}
                  </p>
                )}
              </div>

              {phone.status === "in_stock" && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="accent" size="sm" className="flex-1">
                    Sell
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
