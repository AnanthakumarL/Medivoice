import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  Tag,
  Truck,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get cart from localStorage
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    genericName?: string;
    dosageForm?: string;
    strength?: string;
    prescription?: boolean;
  }>>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('medicineCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  const updateLocalStorage = (items: typeof cartItems) => {
    localStorage.setItem('medicineCart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast({
        title: "Maximum Quantity Reached",
        description: "You can only order up to 10 units per item",
        variant: "destructive",
      });
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateLocalStorage(updatedCart);

    toast({
      title: "Cart Updated",
      description: "Quantity has been updated",
    });
  };

  const removeItem = (id: string, name: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateLocalStorage(updatedCart);

    toast({
      title: "Item Removed",
      description: `${name} has been removed from your cart`,
    });
  };

  const clearCart = () => {
    updateLocalStorage([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryCharge = () => {
    const subtotal = getSubtotal();
    return subtotal >= 500 ? 0 : 40;
  };

  const getTax = () => {
    return Math.round(getSubtotal() * 0.05); // 5% GST
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryCharge() + getTax();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    const prescriptionRequired = cartItems.some(item => item.prescription);
    
    if (prescriptionRequired) {
      toast({
        title: "Prescription Required",
        description: "Some items in your cart require a prescription. Please upload it during checkout.",
      });
    }

    toast({
      title: "Proceeding to Checkout",
      description: `Total: ₹${getTotal()}`,
    });

    // Navigate to payment or checkout page
    // navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="bg-slate-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-16 w-16 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Your Cart is Empty</h2>
              <p className="text-slate-600 mb-8">
                Looks like you haven't added any medicines to your cart yet.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
              <p className="text-sm text-slate-600">{getTotalItems()} items</p>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border border-slate-200"
                      />
                      {item.prescription && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5">
                          Rx
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                          {item.genericName && (
                            <p className="text-sm text-slate-600">{item.genericName}</p>
                          )}
                          {(item.dosageForm || item.strength) && (
                            <p className="text-xs text-slate-500 mt-1">
                              {item.dosageForm} • {item.strength}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id, item.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-slate-900">₹{item.price}</span>
                          <span className="text-sm text-slate-500">per unit</span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-slate-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 hover:bg-slate-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-4 py-1 font-semibold text-slate-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 10}
                              className="px-3 py-1 hover:bg-slate-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Item Total:</span>
                          <span className="text-xl font-bold text-green-600">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Delivery Info */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-900">Free Delivery</p>
                      <p className="text-xs text-blue-700">
                        {getSubtotal() >= 500 ? 'On this order' : `On orders above ₹500`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    Price Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Subtotal ({getTotalItems()} items)</span>
                      <span className="font-semibold">₹{getSubtotal()}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700">
                      <span>Delivery Charges</span>
                      <span className="font-semibold">
                        {getDeliveryCharge() === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `₹${getDeliveryCharge()}`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700">
                      <span>GST (5%)</span>
                      <span className="font-semibold">₹{getTax()}</span>
                    </div>

                    <div className="pt-3 border-t-2 border-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">₹{getTotal()}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-right">
                        You save ₹{Math.round(getSubtotal() * 0.1)} on this order
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prescription Alert */}
              {cartItems.some(item => item.prescription) && (
                <Card className="border-2 border-amber-300 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-900 text-sm mb-1">
                          Prescription Required
                        </p>
                        <p className="text-xs text-amber-800">
                          Some items require a valid prescription. Please upload it during checkout.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Benefits */}
              <Card className="border border-slate-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="h-5 w-5 text-green-600" />
                    <span className="text-slate-700">Safe and secure packaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-slate-700">Fast delivery in 2-3 days</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">Multiple payment options</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
