import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Package,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
}

const initialInventoryData: InventoryItem[] = [
  { id: "1", name: "iPhone 14 Pro Case", category: "Accessories", sku: "ACC-001", costPrice: 800, sellingPrice: 1500, stock: 45, minStock: 10, supplier: "TechHub" },
  { id: "2", name: "Samsung Charger 25W", category: "Accessories", sku: "ACC-002", costPrice: 1500, sellingPrice: 2500, stock: 5, minStock: 15, supplier: "SamsungPK" },
  { id: "3", name: "AirPods Pro", category: "Accessories", sku: "ACC-003", costPrice: 35000, sellingPrice: 45000, stock: 8, minStock: 5, supplier: "ApplePK" },
  { id: "4", name: "USB-C Cable 2m", category: "Accessories", sku: "ACC-004", costPrice: 250, sellingPrice: 500, stock: 120, minStock: 20, supplier: "CableCo" },
  { id: "5", name: "Screen Protector iPhone 15", category: "Accessories", sku: "ACC-005", costPrice: 400, sellingPrice: 800, stock: 3, minStock: 10, supplier: "ScreenGuard" },
  { id: "6", name: "Power Bank 20000mAh", category: "Accessories", sku: "ACC-006", costPrice: 2500, sellingPrice: 4500, stock: 15, minStock: 8, supplier: "PowerTech" },
  { id: "7", name: "Wireless Earbuds", category: "Accessories", sku: "ACC-007", costPrice: 2000, sellingPrice: 3500, stock: 34, minStock: 10, supplier: "AudioMax" },
  { id: "8", name: "Phone Stand Holder", category: "Accessories", sku: "ACC-008", costPrice: 350, sellingPrice: 750, stock: 56, minStock: 15, supplier: "TechHub" },
];

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editForm, setEditForm] = useState<InventoryItem | null>(null);

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventoryData.filter((item) => item.stock <= item.minStock).length;
  const totalValue = inventoryData.reduce((sum, item) => sum + item.sellingPrice * item.stock, 0);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditForm({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    
    setInventoryData((prev) =>
      prev.map((item) => (item.id === editForm.id ? editForm : item))
    );
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setEditForm(null);
    toast({
      title: "Product Updated",
      description: "The product has been updated successfully.",
    });
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;
    
    setInventoryData((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast({
      title: "Product Deleted",
      description: "The product has been removed from inventory.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Enter product name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="used_phone">Used Phone</SelectItem>
                      <SelectItem value="repair_service">Repair Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU/Barcode</Label>
                  <Input id="sku" placeholder="Auto-generate" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Price</Label>
                  <Input id="cost" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling">Selling Price</Label>
                  <Input id="selling" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Initial Stock</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock Level</Label>
                  <Input id="minStock" type="number" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" placeholder="Supplier name" />
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add Product
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
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl font-bold">{inventoryData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-xl font-bold text-warning">{lowStockCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Package className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-xl font-bold text-success">Rs {totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="used phone">Used Phones</SelectItem>
            <SelectItem value="repair service">Repair Services</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">
                <Button variant="ghost" size="sm" className="h-8 -ml-3">
                  Product <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{item.sku}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-right">Rs {item.costPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">Rs {item.sellingPrice.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={item.stock <= item.minStock ? "destructive" : "secondary"}
                    className={cn(
                      item.stock <= item.minStock && "animate-pulse-soft"
                    )}
                  >
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.supplier}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editForm.category.toLowerCase()}
                    onValueChange={(value) => setEditForm({ ...editForm, category: value.charAt(0).toUpperCase() + value.slice(1) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="used phone">Used Phone</SelectItem>
                      <SelectItem value="repair service">Repair Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU/Barcode</Label>
                  <Input
                    id="edit-sku"
                    value={editForm.sku}
                    onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cost">Cost Price</Label>
                  <Input
                    id="edit-cost"
                    type="number"
                    value={editForm.costPrice}
                    onChange={(e) => setEditForm({ ...editForm, costPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-selling">Selling Price</Label>
                  <Input
                    id="edit-selling"
                    type="number"
                    value={editForm.sellingPrice}
                    onChange={(e) => setEditForm({ ...editForm, sellingPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Min Stock Level</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={editForm.minStock}
                    onChange={(e) => setEditForm({ ...editForm, minStock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  value={editForm.supplier}
                  onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
