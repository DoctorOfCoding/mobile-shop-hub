import { useState, useEffect } from "react";
import {
  Store,
  User,
  Receipt,
  Percent,
  Tags,
  Save,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

export default function Settings() {
  const { settings, loading, updateSettings, uploadLogo } = useSettings();
  const [formData, setFormData] = useState({
    shop_name: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    receipt_show_logo: true,
    receipt_show_cashier: true,
    receipt_show_tax: true,
    receipt_footer: "",
    receipt_size: "pos",
    tax_enabled: false,
    tax_name: "Sales Tax",
    tax_rate: 17,
    tax_number: "",
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        shop_name: settings.shop_name || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        website: settings.website || "",
        receipt_show_logo: settings.receipt_show_logo,
        receipt_show_cashier: settings.receipt_show_cashier,
        receipt_show_tax: settings.receipt_show_tax,
        receipt_footer: settings.receipt_footer || "",
        receipt_size: settings.receipt_size || "pos",
        tax_enabled: settings.tax_enabled,
        tax_name: settings.tax_name || "Sales Tax",
        tax_rate: Number(settings.tax_rate) || 17,
        tax_number: settings.tax_number || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings(formData);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadLogo(file);
      if (url) {
        await updateSettings({ logo_url: url });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your shop and system preferences</p>
      </div>

      <Tabs defaultValue="shop" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Receipt</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            <span className="hidden sm:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tags className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
        </TabsList>

        {/* Shop Settings */}
        <TabsContent value="shop" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Shop Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" value={formData.shop_name} onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
          <Button variant="glow" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        {/* Receipt Settings */}
        <TabsContent value="receipt" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Receipt Customization</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Logo on Receipt</Label>
                  <p className="text-sm text-muted-foreground">Display shop logo at the top</p>
                </div>
                <Switch checked={formData.receipt_show_logo} onCheckedChange={(v) => setFormData({ ...formData, receipt_show_logo: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Print Cashier Name</Label>
                  <p className="text-sm text-muted-foreground">Include cashier info on receipt</p>
                </div>
                <Switch checked={formData.receipt_show_cashier} onCheckedChange={(v) => setFormData({ ...formData, receipt_show_cashier: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Tax Breakdown</Label>
                  <p className="text-sm text-muted-foreground">Display tax details separately</p>
                </div>
                <Switch checked={formData.receipt_show_tax} onCheckedChange={(v) => setFormData({ ...formData, receipt_show_tax: v })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer">Receipt Footer Message</Label>
                <Textarea id="footer" value={formData.receipt_footer} onChange={(e) => setFormData({ ...formData, receipt_footer: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Default Receipt Size</Label>
                <Select value={formData.receipt_size} onValueChange={(v) => setFormData({ ...formData, receipt_size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pos">POS (80mm)</SelectItem>
                    <SelectItem value="a4">A4 Full Size</SelectItem>
                    <SelectItem value="half">Half Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button variant="glow" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Tax Configuration</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Tax</Label>
                  <p className="text-sm text-muted-foreground">Apply tax to all sales</p>
                </div>
                <Switch checked={formData.tax_enabled} onCheckedChange={(v) => setFormData({ ...formData, tax_enabled: v })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input id="taxName" value={formData.tax_name} onChange={(e) => setFormData({ ...formData, tax_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Registration Number</Label>
                <Input id="taxNumber" value={formData.tax_number} onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })} placeholder="Enter tax registration number" />
              </div>
            </div>
          </div>
          <Button variant="glow" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Team Members</h2>
              <Button>
                <User className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Admin User", role: "admin", email: "admin@mobilepos.pk" },
                { name: "Ahmed Cashier", role: "cashier", email: "ahmed@mobilepos.pk" },
                { name: "Sara Cashier", role: "cashier", email: "sara@mobilepos.pk" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                      {user.role === "admin" ? "Administrator" : "Cashier"}
                    </span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Categories Settings */}
        <TabsContent value="categories" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Product Categories</h2>
              <Button>
                <Tags className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Accessories", count: 156 },
                { name: "Used Phones", count: 24 },
                { name: "Repair Services", count: 18 },
                { name: "New Phones", count: 8 },
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tags className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.count} products</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
