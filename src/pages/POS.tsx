import { useState } from "react";
import {
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Percent,
  Receipt,
  User,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useSales, CartItem } from "@/hooks/useSales";

export default function POS() {
  const { products, loading: productsLoading } = useProducts();
  const { completeSale } = useSales();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "easypaisa" | "jazzcash" | "">("");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToCart = (product: typeof products[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, product_id: product.id, name: product.name, price: Number(product.selling_price), quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * globalDiscount) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = async () => {
    if (cart.length === 0 || !paymentMethod) return;
    setIsProcessing(true);
    const success = await completeSale(cart, customerName || null, globalDiscount, paymentMethod);
    if (success) {
      setCart([]);
      setCustomerName("");
      setGlobalDiscount(0);
      setPaymentMethod("");
    }
    setIsProcessing(false);
  };

  if (productsLoading) {
    return (
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <Skeleton key={i} className="h-40" />)}
          </div>
        </div>
        <Skeleton className="w-[400px] h-full" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Barcode className="w-4 h-4" />
          </Button>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-card p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-card-hover transition-all duration-200 text-left group"
              >
                <div className="w-full aspect-square bg-secondary/50 rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Smartphone className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>
                <h3 className="font-medium text-sm truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-primary">Rs {Number(product.selling_price).toLocaleString()}</span>
                  <Badge variant="secondary" className="text-xs">{product.stock} left</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-[420px] bg-card rounded-xl border border-border flex flex-col shadow-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <h2 className="font-display font-semibold text-lg whitespace-nowrap">Sale</h2>
          <div className="flex items-center gap-2 flex-1">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Customer (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-7 text-sm"
            />
          </div>
          <Badge variant="secondary" className="shrink-0">{cart.length} items</Badge>
        </div>

        {/* Cart Items - Compact List */}
        <div className="flex-1 overflow-auto min-h-0 max-h-[calc(100vh-26rem)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Receipt className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <div key={item.id} className="px-4 py-2 flex items-center gap-3 hover:bg-secondary/30 transition-colors animate-scale-in">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <span className="text-xs text-muted-foreground">Rs {item.price.toLocaleString()} each</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-sm w-20 text-right">Rs {(item.price * item.quantity).toLocaleString()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive/70 hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="p-3 border-t border-border space-y-3">
          {/* Totals Row */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-1 flex items-center gap-2">
              <Percent className="w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Discount %"
                value={globalDiscount || ""}
                onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                className="h-7 text-sm w-20"
              />
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-xs">Subtotal: Rs {subtotal.toLocaleString()}</div>
              {globalDiscount > 0 && (
                <div className="text-success text-xs">-{globalDiscount}% = Rs {discountAmount.toLocaleString()}</div>
              )}
            </div>
          </div>

          {/* Total + Payment Methods Row */}
          <div className="flex items-center gap-3">
            <div className="text-xl font-bold text-primary">Rs {total.toLocaleString()}</div>
            <div className="flex-1 flex gap-1.5 justify-end">
              {[
                { value: "cash" as const, icon: Banknote, label: "Cash" },
                { value: "card" as const, icon: CreditCard, label: "Card" },
                { value: "easypaisa" as const, icon: Smartphone, label: "Easy" },
                { value: "jazzcash" as const, icon: Smartphone, label: "Jazz" },
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1.5 text-xs",
                    paymentMethod === method.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <method.icon className="w-3.5 h-3.5" />
                  <span className="font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complete Sale Button */}
          <Button
            variant="glow"
            size="lg"
            className="w-full"
            disabled={cart.length === 0 || !paymentMethod || isProcessing}
            onClick={handleCompleteSale}
          >
            <Receipt className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : "Complete Sale"}
          </Button>
        </div>
      </div>
    </div>
  );
}
