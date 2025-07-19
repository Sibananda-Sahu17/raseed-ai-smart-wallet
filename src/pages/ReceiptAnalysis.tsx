import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, ArrowLeft, Receipt, Wallet, ChefHat, Package, Bell, Edit3, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReceiptAnalysis = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock extracted data
  const receiptData = {
    store: "SuperMart Grocery Store",
    date: "2024-01-15",
    total: "₹3,247.50",
    tax: "₹487.50",
    items: [
      { id: 1, name: "Organic Bananas", quantity: "6 pcs", price: "₹120.00", category: "🍌 Groceries", impulse: false },
      { id: 2, name: "Premium Chocolate Bar", quantity: "2 pcs", price: "₹340.00", category: "🍫 Snacks", impulse: true },
      { id: 3, name: "Whole Wheat Bread", quantity: "1 pc", price: "₹80.00", category: "🍞 Groceries", impulse: false },
      { id: 4, name: "Almond Milk", quantity: "1 L", price: "₹180.00", category: "🥛 Dairy", impulse: false },
      { id: 5, name: "Energy Drink", quantity: "4 cans", price: "₹480.00", category: "🥤 Beverages", impulse: true },
      { id: 6, name: "Organic Quinoa", quantity: "500g", price: "₹450.00", category: "🌾 Groceries", impulse: false },
    ]
  };

  const insights = [
    "You've spent ₹3,200 on groceries this week.",
    "2 items might be cheaper elsewhere.",
    "Detected impulse purchases worth ₹820.00",
    "Your spending is 15% higher than last month."
  ];

  const handleGeneratePass = () => {
    toast({
      title: "Generating Google Wallet Pass...",
      description: "Creating your digital receipt pass",
    });
    setTimeout(() => navigate("/wallet-pass"), 2000);
  };

  const handleMealPlan = () => {
    toast({
      title: "Generating Meal Plan...",
      description: "Creating recipes based on your groceries",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Receipt Analysis</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Receipt Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Receipt Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6 mb-4">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-lg">{receiptData.store}</h3>
                    <p className="text-muted-foreground">{receiptData.date}</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {receiptData.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-sm">{item.name}</span>
                          {item.impulse && <Badge variant="destructive" className="ml-2 text-xs">Impulse</Badge>}
                        </div>
                        <span className="text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹2,760.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{receiptData.tax}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{receiptData.total}</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Re-upload Receipt
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Extracted Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  AI Extracted Details
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receiptData.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.name}</span>
                          {item.impulse && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Impulse
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.category} • {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  💡 Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                  
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-medium text-warning">❤️ Impulse Buy Alert</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You bought chocolate and energy drinks - total impulse purchases: ₹820.00
                    </p>
                  </div>
                  
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ChefHat className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">🥗 Meal Plan Available</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We found groceries that can make 6 healthy meals this week!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="gradient" onClick={handleGeneratePass}>
                <Wallet className="h-4 w-4" />
                🧾 Generate Wallet Pass
              </Button>
              <Button variant="success" onClick={handleMealPlan}>
                <ChefHat className="h-4 w-4" />
                🍳 Generate Meal Plan
              </Button>
              <Button variant="outline">
                <Package className="h-4 w-4" />
                📦 Add to Inventory
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4" />
                🔔 Set Return Reminder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptAnalysis;