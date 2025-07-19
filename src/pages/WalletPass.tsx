import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, QrCode, CheckCircle, Download, Share, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletPass = () => {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const passData = {
    store: "SuperMart Grocery Store",
    date: "2024-01-15",
    total: "₹3,247.50",
    passId: "RSI-2024-0115-001",
    items: [
      { name: "Organic Bananas", link: "View Banana Recipes" },
      { name: "Premium Chocolate", link: "Dessert Ideas" },
      { name: "Whole Wheat Bread", link: "Sandwich Recipes" },
      { name: "Almond Milk", link: "Smoothie Recipes" },
      { name: "Quinoa", link: "Healthy Bowl Recipes" }
    ],
    insights: [
      "Budget Alert: 15% over monthly grocery limit",
      "Return by: Jan 30, 2024 (warranty items)",
      "Savings tip: Switch to store brand for 12% savings"
    ]
  };

  const handleAddToWallet = () => {
    setIsAdding(true);
    toast({
      title: "Adding to Google Wallet...",
      description: "Creating your digital receipt pass",
    });
    
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: "Success! 🎉",
        description: "Your receipt has been saved to your Wallet!",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/analysis")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Google Wallet Pass</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Digital Receipt Pass</h1>
          <p className="text-muted-foreground">
            Preview what will be added to your Google Wallet
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pass Preview */}
          <div>
            <Card className="bg-gradient-to-br from-primary via-finance to-success text-white shadow-xl">
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Wallet className="h-6 w-6" />
                </div>
                <CardTitle className="text-white">Raseed AI Receipt</CardTitle>
                <p className="text-white/80 text-sm">{passData.store}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total Amount</span>
                  <span className="text-2xl font-bold text-white">{passData.total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Date</span>
                  <span className="text-white">{passData.date}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Pass ID</span>
                  <span className="text-white text-sm">{passData.passId}</span>
                </div>

                <div className="flex justify-center py-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QrCode className="h-24 w-24 text-primary" />
                  </div>
                </div>

                <Badge variant="secondary" className="w-full justify-center py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  AI Verified Receipt
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Pass Details */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>🔗 Smart Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {passData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <span className="font-medium">{item.name}</span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        {item.link}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Insights */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Budget Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {passData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pass Features */}
            <Card>
              <CardHeader>
                <CardTitle>✨ Pass Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Return Reminders</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Store Location</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span className="text-sm">Digital Verification</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Warranty Tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full"
                onClick={handleAddToWallet}
                disabled={isAdding}
              >
                <Wallet className="h-5 w-5 mr-2" />
                {isAdding ? "Adding to Wallet..." : "Add to Google Wallet (Sandbox)"}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Pass
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share Pass
                </Button>
              </div>
            </div>

            {/* Demo Notice */}
            <Card className="bg-finance/10 border-finance/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-finance mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-finance mb-1">Demo Mode</p>
                    <p className="text-sm text-muted-foreground">
                      This is a demonstration of Google Wallet integration. In production, this would save to your actual Google Wallet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPass;