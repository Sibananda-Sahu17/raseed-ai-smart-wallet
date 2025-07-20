import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Zap, Brain, Wallet, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCaptureUpload = () => {
    navigate("/capture");
  };

  const scrollToProcess = () => {
    document.getElementById("process-flow")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-finance flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Raseed AI</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-finance bg-clip-text text-transparent">
            Welcome to Raseed AI
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            Your Smart Assistant for Receipts, Budgeting & Google Wallet Integration
          </p>
          
          <p className="text-lg text-muted-foreground mb-12">
            Capture receipts, get savings tips, meal ideas, and smart expense tracking – all in one app.
          </p>

          {/* Upload Options */}
          <div className="flex justify-center mb-12">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group max-w-md" onClick={handleCaptureUpload}>
              <CardHeader className="text-center">
                <Camera className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>📸 Capture / Upload Photo</CardTitle>
                <CardDescription>Take a photo or upload an image of your receipt</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="gradient" 
              size="lg" 
              onClick={handleCaptureUpload}
            >
              Try with a Receipt
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToProcess}>
              See How it Works
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section id="process-flow" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How Raseed AI Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload Receipt</h3>
              <p className="text-muted-foreground">Take a photo or upload your receipt</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-finance text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">Gemini AI extracts items and insights</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-success text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Smart Insights</h3>
              <p className="text-muted-foreground">Get spending tips and meal plans</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-warning text-black flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Save to Wallet</h3>
              <p className="text-muted-foreground">Generate Google Wallet passes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Extract every item, price, and category automatically with advanced AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-finance mb-2" />
                <CardTitle>Smart Insights</CardTitle>
                <CardDescription>
                  Get personalized spending tips, meal plans, and budget recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Wallet className="h-8 w-8 text-success mb-2" />
                <CardTitle>Google Wallet Integration</CardTitle>
                <CardDescription>
                  Save receipts as digital passes for easy access and tracking
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            "Receipts made smart. Track, save, and simplify with Raseed AI."
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
