import { useState } from "react";
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

export default function Settings() {
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
                <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center border-2 border-dashed border-border">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input id="shopName" defaultValue="MobilePOS Shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input id="phone" defaultValue="0300-1234567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  defaultValue="Shop #123, Mobile Market, Main Boulevard, Lahore"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="info@mobilepos.pk" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.mobilepos.pk" />
                </div>
              </div>
            </div>
          </div>
          <Button variant="glow">
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
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Print Cashier Name</Label>
                  <p className="text-sm text-muted-foreground">Include cashier info on receipt</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Tax Breakdown</Label>
                  <p className="text-sm text-muted-foreground">Display tax details separately</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer">Receipt Footer Message</Label>
                <Textarea
                  id="footer"
                  defaultValue="Thank you for shopping with us! Visit again."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Receipt Size</Label>
                <Select defaultValue="pos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pos">POS (80mm)</SelectItem>
                    <SelectItem value="a4">A4 Full Size</SelectItem>
                    <SelectItem value="half">Half Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button variant="glow">
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
                <Switch />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxName">Tax Name</Label>
                  <Input id="taxName" defaultValue="Sales Tax" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" defaultValue="17" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Registration Number</Label>
                <Input id="taxNumber" placeholder="Enter tax registration number" />
              </div>
            </div>
          </div>
          <Button variant="glow">
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {user.role === "admin" ? "Administrator" : "Cashier"}
                    </span>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
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
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Delete
                    </Button>
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
