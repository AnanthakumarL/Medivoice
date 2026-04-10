import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Package,
  Shield,
  Truck,
  Clock,
  Plus,
  Minus,
} from "lucide-react";

const ViewMedicine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { medicine, buyNow } = location.state || {};

  const [quantity, setQuantity] = useState(1);

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Pill className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Medicine Not Found</h2>
            <p className="text-slate-600 mb-6">The medicine you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const savedCart = localStorage.getItem('medicineCart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex((item: any) => item.id === medicine.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.push({
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: quantity,
        image: medicine.image,
        genericName: medicine.genericName,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
        prescription: medicine.prescription
      });
    }
    
    // Save to localStorage
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${medicine.name} added to your cart`,
    });
    
    navigate('/cart');
  };

  const handleBuyNow = () => {
    // Add to cart first
    const savedCart = localStorage.getItem('medicineCart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    // Clear cart and add only this item
    cart = [{
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      quantity: quantity,
      image: medicine.image,
      genericName: medicine.genericName,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      prescription: medicine.prescription
    }];
    
    localStorage.setItem('medicineCart', JSON.stringify(cart));
    
    toast({
      title: "Proceeding to Checkout",
      description: `Purchasing ${quantity} x ${medicine.name}`,
    });
    
    // Navigate to cart page
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Medicines
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-white">
                  <img
                    src={medicine.image}
                    alt={medicine.name}
                    className="w-full h-96 object-cover"
                  />
                  {medicine.discount > 0 && (
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-4 py-2">
                      {medicine.discount}% OFF
                    </Badge>
                  )}
                  {medicine.prescription && (
                    <Badge className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1">
                      Prescription Required
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-green-800">100% Genuine</p>
                </CardContent>
              </Card>
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-blue-800">Fast Delivery</p>
                </CardContent>
              </Card>
              <Card className="border border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-purple-800">Secure Package</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{medicine.name}</h1>
              <p className="text-lg text-slate-600 mb-3">{medicine.genericName}</p>
              <Badge variant="outline" className="border-green-200 text-green-700 text-sm px-3 py-1">
                {medicine.category}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(medicine.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-800">{medicine.rating}</span>
              <span className="text-sm text-slate-500">(2,450 reviews)</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {medicine.inStock ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Price */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-slate-900">₹{medicine.price}</span>
                  {medicine.discount > 0 && (
                    <>
                      <span className="text-2xl text-slate-400 line-through">₹{medicine.mrp}</span>
                      <span className="text-lg font-semibold text-green-600">
                        Save ₹{medicine.mrp - medicine.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-600">Inclusive of all taxes</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>Expected delivery in 2-3 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="border border-slate-200">
              <CardContent className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Manufacturer</p>
                    <p className="font-semibold text-slate-800">{medicine.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Pack Size</p>
                    <p className="font-semibold text-slate-800">{medicine.packSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dosage Form</p>
                    <p className="font-semibold text-slate-800">{medicine.dosageForm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Strength</p>
                    <p className="font-semibold text-slate-800">{medicine.strength}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-slate-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="px-3 py-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-slate-600">(Maximum 10 units)</span>
              </div>
              <p className="text-lg font-semibold text-slate-800">
                Total: ₹{medicine.price * quantity}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                disabled={!medicine.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
                disabled={!medicine.inStock}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {medicine.prescription && (
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">Prescription Required</p>
                      <p className="text-sm text-amber-800">
                        A valid prescription is required to purchase this medicine. Please upload your prescription during checkout.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12 space-y-6">
          {/* Description */}
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
              <p className="text-slate-700 leading-relaxed">{medicine.description}</p>
            </CardContent>
          </Card>

          {/* Uses */}
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Uses</h3>
              <p className="text-slate-700 leading-relaxed">{medicine.uses}</p>
            </CardContent>
          </Card>

          {/* Side Effects */}
          <Card className="border border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Side Effects
              </h3>
              <p className="text-red-800 leading-relaxed">{medicine.sideEffects}</p>
              <p className="text-sm text-red-700 mt-3 italic">
                Consult your doctor immediately if you experience severe side effects.
              </p>
            </CardContent>
          </Card>

          {/* Composition */}
          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Composition</h3>
              <p className="text-blue-800 leading-relaxed font-mono">{medicine.composition}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicine;
