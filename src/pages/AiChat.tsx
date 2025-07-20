import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  Calendar,
  Lightbulb,
  Receipt,
  PieChart,
  Mic
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis';
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant for Raseed. I can help you analyze spending patterns, find savings opportunities, answer questions about your receipts, and provide personalized financial insights. What would you like to know?",
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickSuggestions = [
    { text: "Analyze my spending this month", icon: PieChart, category: "Analysis" },
    { text: "Find ways to save money", icon: DollarSign, category: "Savings" },
    { text: "Show my grocery trends", icon: ShoppingCart, category: "Trends" },
    { text: "What are my impulse purchases?", icon: TrendingUp, category: "Insights" },
    { text: "Plan meals from my receipts", icon: Calendar, category: "Planning" },
    { text: "Explain my latest receipt", icon: Receipt, category: "Analysis" }
  ];

  const mockResponses = {
    spending: "Based on your data, you've spent ₹18,500 this month across 47 transactions. Your top categories are: Groceries (67% - ₹12,400), Dining (17% - ₹3,200), Shopping (11% - ₹2,100), and Transport (5% - ₹800). You're 15% over your monthly budget, mainly due to increased grocery spending.",
    
    savings: "I found several ways you can save money: 1) Switch to store brands for groceries - potential saving of ₹340/month. 2) Reduce impulse purchases (you spent ₹2,340 on unplanned items this month). 3) Cook more at home - you spent ₹3,200 on dining out. 4) Use coupons and loyalty programs at SuperMart where you shop frequently.",
    
    grocery: "Your grocery spending shows interesting patterns: You shop primarily at SuperMart (78% of transactions), spend an average of ₹447 per grocery trip, and buy organic products 45% of the time. Your most frequent purchases are bananas, bread, and milk. Tip: Your spending peaks on weekends - consider meal planning to avoid overspending.",
    
    impulse: "You made 8 impulse purchases this month totaling ₹2,340. Main triggers: 1) Premium chocolate when stressed (₹820), 2) Energy drinks during busy days (₹680), 3) Convenience snacks (₹540), 4) Unnecessary gadgets (₹300). These purchases typically happen between 3-5 PM and on weekends.",
    
    meals: "Based on your recent receipts, I can suggest these meal plans: **Week 1**: Mediterranean Quinoa Bowl (using your quinoa, tomatoes, olives), Banana Almond Smoothies (bananas + almond milk), Whole Wheat Sandwiches. **Estimated savings**: ₹560 vs ordering out. Want me to create shopping lists for these meals?",
    
    receipt: "Your latest receipt from SuperMart shows ₹3,247 spent on 6 items. Key insights: 2 items were impulse purchases (chocolate & energy drinks), you saved ₹125 with your loyalty card, and 4 items can be used to make 3 healthy meals this week. The receipt also shows you qualified for a 5% cashback offer you might have missed.",
    
    default: "I understand you want to know more about your financial data. I can help you with spending analysis, budget optimization, receipt insights, meal planning, and finding savings opportunities. Could you be more specific about what you'd like to explore?"
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let responseContent = mockResponses.default;
      
      if (content.toLowerCase().includes('spending') || content.toLowerCase().includes('month')) {
        responseContent = mockResponses.spending;
      } else if (content.toLowerCase().includes('save') || content.toLowerCase().includes('money')) {
        responseContent = mockResponses.savings;
      } else if (content.toLowerCase().includes('grocery') || content.toLowerCase().includes('trends')) {
        responseContent = mockResponses.grocery;
      } else if (content.toLowerCase().includes('impulse')) {
        responseContent = mockResponses.impulse;
      } else if (content.toLowerCase().includes('meal') || content.toLowerCase().includes('plan')) {
        responseContent = mockResponses.meals;
      } else if (content.toLowerCase().includes('receipt') || content.toLowerCase().includes('explain')) {
        responseContent = mockResponses.receipt;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-finance flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Chat Assistant</h1>
                <p className="text-sm text-muted-foreground">Ask anything about your expenses and receipts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
            </div>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-finance text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 bg-card/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your spending, receipts, or get financial insights..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
              className="flex-1"
            />
            <Button 
              variant="outline"
              size="icon"
              onClick={() => {
                toast({
                  title: "Voice Input",
                  description: "Voice recognition would activate here in production",
                });
              }}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="w-80 border-l bg-card/30 p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Quick Questions
        </h3>
        
        <div className="space-y-3">
          {quickSuggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={() => handleSuggestionClick(suggestion.text)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <suggestion.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{suggestion.text}</p>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Quick Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate("/capture")}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Upload New Receipt
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate("/dashboard")}
            >
              <PieChart className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => navigate("/voice")}
            >
              <Bot className="h-4 w-4 mr-2" />
              Voice Assistant
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <Card className="bg-gradient-to-br from-primary/10 to-finance/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">AI Features</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Smart expense analysis</li>
              <li>• Personalized savings tips</li>
              <li>• Receipt insights</li>
              <li>• Budget optimization</li>
              <li>• Meal planning from groceries</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiChat;