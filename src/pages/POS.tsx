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
      <div className="w-[400px] bg-card rounded-xl border border-border flex flex-col shadow-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-lg">Current Sale</h2>
          <div className="flex items-center gap-2 mt-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Cart is empty</p>
              <p className="text-sm">Add products to start a sale</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-secondary/50 rounded-lg p-3 animate-scale-in">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-semibold">Rs {item.price.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-border space-y-4">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Discount %"
              value={globalDiscount || ""}
              onChange={(e) => setGlobalDiscount(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            {globalDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({globalDiscount}%)</span>
                <span>-Rs {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">Rs {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-4 gap-2">
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
                  "p-2 rounded-lg border transition-all flex flex-col items-center gap-1",
                  paymentMethod === method.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                <method.icon className="w-4 h-4" />
                <span className="text-xs font-medium">{method.label}</span>
              </button>
            ))}
          </div>

          {/* Complete Sale Button */}
          <Button
            variant="glow"
            size="xl"
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
