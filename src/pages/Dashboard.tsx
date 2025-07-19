import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Calendar,
  Target,
  PieChart,
  BarChart3,
  Lightbulb,
  Package,
  ChefHat,
  Brain
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const spendingData = {
    thisMonth: 18500,
    lastMonth: 16200,
    categories: [
      { name: "Groceries", amount: 12400, percentage: 67, color: "bg-primary" },
      { name: "Dining", amount: 3200, percentage: 17, color: "bg-finance" },
      { name: "Shopping", amount: 2100, percentage: 11, color: "bg-success" },
      { name: "Transport", amount: 800, percentage: 5, color: "bg-warning" }
    ],
    weeklyTrend: [4200, 3800, 4500, 5000, 4100]
  };

  const insights = [
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Budget Alert",
      message: "You're 15% over your monthly grocery budget",
      action: "View suggestions"
    },
    {
      type: "success",
      icon: TrendingDown,
      title: "Great Progress!",
      message: "Impulse purchases down 25% this month",
      action: "Keep it up"
    },
    {
      type: "info",
      icon: Lightbulb,
      title: "Savings Opportunity",
      message: "Switch to store brands for ₹340 monthly savings",
      action: "See options"
    }
  ];

  const upcomingReturns = [
    { item: "Premium Headphones", store: "ElectroMart", deadline: "Jan 25, 2024", days: 3 },
    { item: "Winter Jacket", store: "FashionHub", deadline: "Jan 30, 2024", days: 8 },
    { item: "Smartphone Case", store: "TechStore", deadline: "Feb 5, 2024", days: 14 }
  ];

  const mealPlans = [
    { title: "Mediterranean Bowl", ingredients: "Quinoa, Tomatoes, Olives", savings: "₹120" },
    { title: "Banana Smoothie", ingredients: "Bananas, Almond Milk", savings: "₹80" },
    { title: "Healthy Sandwich", ingredients: "Whole Wheat Bread, Vegetables", savings: "₹60" }
  ];

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
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Smart Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/voice")}>
              <Brain className="h-4 w-4" />
              Voice Assistant
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Upload Receipt
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₹{spendingData.thisMonth.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-success">+14% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-finance" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-sm text-success">-8% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impulse Purchases</p>
                  <p className="text-2xl font-bold">₹2,340</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-4 w-4 text-success" />
                <span className="text-sm text-success">-25% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Progress</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <Target className="h-8 w-8 text-success" />
              </div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Spending Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Spending Overview (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingData.categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm">₹{category.amount.toLocaleString()}</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-32">
                    {spendingData.weeklyTrend.map((amount, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary rounded-t"
                          style={{ height: `${(amount / 5000) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          W{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Average weekly spending: ₹4,320
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Return Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Return Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingReturns.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.store}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.deadline}</p>
                        <Badge variant={item.days <= 5 ? "destructive" : "secondary"}>
                          {item.days} days left
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {spendingData.categories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="secondary">₹{category.amount.toLocaleString()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={category.percentage} className="mb-4" />
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• {category.percentage}% of total spending</p>
                      <p>• Average transaction: ₹{Math.round(category.amount / 8).toLocaleString()}</p>
                      <p>• Most frequent: {category.name === "Groceries" ? "SuperMart" : "Various"}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        insight.type === "warning" ? "bg-warning/10" :
                        insight.type === "success" ? "bg-success/10" : "bg-finance/10"
                      }`}>
                        <insight.icon className={`h-5 w-5 ${
                          insight.type === "warning" ? "text-warning" :
                          insight.type === "success" ? "text-success" : "text-finance"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p className="text-muted-foreground mb-3">{insight.message}</p>
                        <Button variant="outline" size="sm">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  🥗 Recipe Suggestions from Your Groceries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {mealPlans.map((meal, index) => (
                    <Card key={index} className="border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2">{meal.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{meal.ingredients}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="success">Save {meal.savings}</Badge>
                          <Button size="sm" variant="ghost">
                            View Recipe
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Home Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div>
                      <p className="font-medium">Almond Milk</p>
                      <p className="text-sm text-muted-foreground">Running low - expires in 3 days</p>
                    </div>
                    <Button size="sm" variant="warning">
                      Add to List
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Quinoa</p>
                      <p className="text-sm text-muted-foreground">Good stock - 2 weeks remaining</p>
                    </div>
                    <Badge variant="success">In Stock</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;