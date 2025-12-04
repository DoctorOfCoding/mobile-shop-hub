import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Smartphone,
  TrendingUp,
  Tag,
  ShoppingBag,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUsedPhones, UsedPhone, UsedPhoneFormData } from "@/hooks/useUsedPhones";

const conditionConfig = {
  excellent: { label: "Excellent", color: "bg-success/10 text-success border-success/20" },
  good: { label: "Good", color: "bg-info/10 text-info border-info/20" },
  fair: { label: "Fair", color: "bg-warning/10 text-warning border-warning/20" },
  poor: { label: "Poor", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function UsedPhones() {
  const { usedPhones, loading, addUsedPhone, updateUsedPhone, sellPhone, deleteUsedPhone } = useUsedPhones();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<UsedPhone | null>(null);
  const [sellPrice, setSellPrice] = useState(0);
  const [formData, setFormData] = useState<UsedPhoneFormData>({
    model: "", imei: "", condition: "good", purchase_price: 0, expected_selling_price: 0, purchased_from: ""
  });

  const filteredPhones = usedPhones.filter((phone) => {
    const matchesSearch = phone.model.toLowerCase().includes(searchQuery.toLowerCase()) || phone.imei.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || phone.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const inStockPhones = usedPhones.filter((p) => p.status === "in_stock");
  const soldPhones = usedPhones.filter((p) => p.status === "sold");
  const totalProfit = soldPhones.reduce((sum, p) => sum + (Number(p.actual_selling_price || 0) - Number(p.purchase_price)), 0);
  const inventoryValue = inStockPhones.reduce((sum, p) => sum + Number(p.expected_selling_price), 0);

  const handleAdd = async () => {
    const success = await addUsedPhone(formData);
    if (success) {
      setIsAddDialogOpen(false);
      setFormData({ model: "", imei: "", condition: "good", purchase_price: 0, expected_selling_price: 0, purchased_from: "" });
    }
  };

  const handleEdit = async () => {
    if (!selectedPhone) return;
    const success = await updateUsedPhone(selectedPhone.id, formData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedPhone(null);
    }
  };

  const handleSell = async () => {
    if (!selectedPhone) return;
    const success = await sellPhone(selectedPhone.id, sellPrice);
    if (success) {
      setIsSellDialogOpen(false);
      setSelectedPhone(null);
      setSellPrice(0);
    }
  };

  const handleDelete = async () => {
    if (!selectedPhone) return;
    const success = await deleteUsedPhone(selectedPhone.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedPhone(null);
    }
  };

  const openEditDialog = (phone: UsedPhone) => {
    setSelectedPhone(phone);
    setFormData({
      model: phone.model,
      imei: phone.imei,
      condition: phone.condition,
      purchase_price: Number(phone.purchase_price),
      expected_selling_price: Number(phone.expected_selling_price),
      purchased_from: phone.purchased_from
    });
    setIsEditDialogOpen(true);
  };

  const openSellDialog = (phone: UsedPhone) => {
    setSelectedPhone(phone);
    setSellPrice(Number(phone.expected_selling_price));
    setIsSellDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

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
            <Button variant="glow" onClick={() => setFormData({ model: "", imei: "", condition: "good", purchase_price: 0, expected_selling_price: 0, purchased_from: "" })}>
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
                <Label>Phone Model</Label>
                <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. iPhone 14 Pro Max 256GB" />
              </div>
              <div className="space-y-2">
                <Label>IMEI Number</Label>
                <Input value={formData.imei} onChange={(e) => setFormData({ ...formData, imei: e.target.value })} placeholder="15 digit IMEI" />
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v as UsedPhoneFormData["condition"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Label>Purchase Price (Rs)</Label>
                  <Input type="number" value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Selling (Rs)</Label>
                  <Input type="number" value={formData.expected_selling_price} onChange={(e) => setFormData({ ...formData, expected_selling_price: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Purchased From</Label>
                <Input value={formData.purchased_from} onChange={(e) => setFormData({ ...formData, purchased_from: e.target.value })} placeholder="Customer name" />
              </div>
              <Button className="w-full" onClick={handleAdd}>Add to Inventory</Button>
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
          <Input placeholder="Search by model or IMEI..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
          const condition = conditionConfig[phone.condition];
          const profit = phone.status === "sold" ? Number(phone.actual_selling_price || 0) - Number(phone.purchase_price) : Number(phone.expected_selling_price) - Number(phone.purchase_price);

          return (
            <div key={phone.id} className={cn("bg-card rounded-xl border p-4 shadow-card hover:shadow-card-hover transition-all duration-200", phone.status === "sold" ? "border-success/30" : "border-border")}>
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
                <div className="flex items-center gap-1">
                  <Badge className={cn("border", condition.color)}>{condition.label}</Badge>
                  {phone.status === "in_stock" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(phone)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { setSelectedPhone(phone); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-medium">Rs {Number(phone.purchase_price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{phone.status === "sold" ? "Sold For" : "Expected Price"}</span>
                  <span className="font-medium text-primary">Rs {Number(phone.actual_selling_price || phone.expected_selling_price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">{phone.status === "sold" ? "Profit" : "Expected Profit"}</span>
                  <span className="font-semibold text-success">Rs {profit.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">From: {phone.purchased_from} • {phone.purchased_at}</p>
                {phone.status === "sold" && phone.sold_at && (
                  <p className="text-xs text-success mt-1">Sold on: {phone.sold_at}</p>
                )}
              </div>

              {phone.status === "in_stock" && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(phone)}>Edit</Button>
                  <Button variant="accent" size="sm" className="flex-1" onClick={() => openSellDialog(phone)}>Sell</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Used Phone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Phone Model</Label>
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>IMEI Number</Label>
              <Input value={formData.imei} onChange={(e) => setFormData({ ...formData, imei: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v as UsedPhoneFormData["condition"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Label>Purchase Price (Rs)</Label>
                <Input type="number" value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Expected Selling (Rs)</Label>
                <Input type="number" value={formData.expected_selling_price} onChange={(e) => setFormData({ ...formData, expected_selling_price: Number(e.target.value) })} />
              </div>
            </div>
            <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sell Phone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Selling: {selectedPhone?.model}</p>
            <div className="space-y-2">
              <Label>Selling Price (Rs)</Label>
              <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} />
            </div>
            <Button className="w-full" onClick={handleSell}>Confirm Sale</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Phone</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete {selectedPhone?.model}? This action cannot be undone.</AlertDialogDescription>
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
