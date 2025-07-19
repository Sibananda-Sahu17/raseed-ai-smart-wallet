import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  MessageCircle, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Send,
  Bot,
  User,
  Headphones,
  Languages
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  language: string;
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [currentQuery, setCurrentQuery] = useState("");
  const [response, setResponse] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "नमस्ते! मैं आपका AI असिस्टेंट हूं। आप अपने खर्च, रसीदों और बजट के बारे में किसी भी भाषा में पूछ सकते हैं।",
      role: 'assistant',
      timestamp: new Date(),
      language: 'hindi'
    }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const languages = [
    { value: "english", label: "English", flag: "🇺🇸" },
    { value: "hindi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
    { value: "marathi", label: "मराठी (Marathi)", flag: "🇮🇳" },
    { value: "tamil", label: "தமிழ் (Tamil)", flag: "🇮🇳" }
  ];

  const suggestions = {
    english: [
      "Tell me my grocery spending last week.",
      "Do I have any return deadlines this week?",
      "Show me my impulse purchases this month.",
      "What's my average monthly grocery bill?"
    ],
    hindi: [
      "पिछले महीने कितनी खरीदारी की?",
      "इस हफ्ते कोई वापसी की तारीख है?",
      "मेरी impulse खरीदारी दिखाओ।",
      "मेरा औसत मासिक बिल क्या है?"
    ],
    marathi: [
      "गेल्या आठवड्यात किती खर्च केला?",
      "या आठवड्यात परत करण्याच्या तारखा आहेत का?",
      "माझी impulse खरेदी दाखवा।",
      "माझे सरासरी मासिक बिल काय आहे?"
    ],
    tamil: [
      "கடந்த வாரம் எவ்வளவு செலவு செய்தேன்?",
      "இந்த வாரம் திரும்ப கொடுக்க வேண்டிய தேதிகள் உள்ளதா?",
      "என் impulse வாங்கல்களை காட்டு।",
      "என் சராசரி மாத பில் என்ன?"
    ]
  };

  const mockResponses = {
    english: {
      spending: "You spent ₹5,612 on groceries last week. That's 15% more than your usual weekly average of ₹4,880.",
      returns: "Yes, you have 2 items with return deadlines: Premium headphones (return by Jan 25) and Winter jacket (return by Jan 30).",
      impulse: "This month you made 8 impulse purchases totaling ₹2,340. Most common categories: Chocolates (₹820) and Energy drinks (₹680).",
      average: "Your average monthly grocery bill is ₹18,500. You're tracking 12% below last year's average!"
    },
    hindi: {
      spending: "आपने पिछले महीने ₹18,200 खर्च किए। यह आपके सामान्य मासिक औसत से 8% अधिक है।",
      returns: "हाँ, आपके पास 2 चीजें हैं जिन्हें वापस करना है: हेडफोन (25 जनवरी तक) और जैकेट (30 जनवरी तक)।",
      impulse: "इस महीने आपने 8 impulse खरीदारी की है कुल ₹2,340 की। सबसे ज्यादा: चॉकलेट और एनर्जी ड्रिंक।",
      average: "आपका औसत मासिक बिल ₹18,500 है। आप पिछले साल से 12% कम खर्च कर रहे हैं!"
    },
    marathi: {
      spending: "तुम्ही गेल्या आठवड्यात ₹5,612 खर्च केलात। हे तुमच्या सामान्य साप्ताहिक सरासरीपेक्षा 15% जास्त आहे।",
      returns: "होय, तुमच्याकडे 2 वस्तू परत करायच्या आहेत: हेडफोन (25 जानेवारी पर्यंत) आणि जाकीट (30 जानेवारी पर्यंत)।",
      impulse: "या महिन्यात तुम्ही 8 impulse खरेदी केली आहे एकूण ₹2,340 ची। सर्वात जास्त: चॉकलेट आणि एनर्जी ड्रिंक।",
      average: "तुमचे सरासरी मासिक बिल ₹18,500 आहे। तुम्ही गेल्या वर्षापेक्षा 12% कमी खर्च करत आहात!"
    },
    tamil: {
      spending: "நீங்கள் கடந்த வாரம் ₹5,612 செலவு செய்தீர்கள். இது உங்கள் வழக்கமான வார சராசரியை விட 15% அதிகம்.",
      returns: "ஆம், உங்களிடம் திரும்ப கொடுக்க வேண்டிய 2 பொருட்கள் உள்ளன: ஹெட்ஃபோன் (ஜன 25 வரை) மற்றும் ஜாக்கெட் (ஜன 30 வரை).",
      impulse: "இந்த மாதம் நீங்கள் 8 impulse வாங்கல்கள் செய்துள்ளீர்கள் மொத்தம் ₹2,340. அதிகம்: சாக்லேட் மற்றும் எனர்ஜி ட்ரிங்க்ஸ்.",
      average: "உங்கள் சராசரி மாத பில் ₹18,500. நீங்கள் கடந்த ஆண்டை விட 12% குறைவாக செலவு செய்கிறீர்கள்!"
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Listening...",
        description: "Speak your query in your preferred language",
      });
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setCurrentQuery(suggestions[selectedLanguage as keyof typeof suggestions][0]);
        handleQuery(suggestions[selectedLanguage as keyof typeof suggestions][0], true);
      }, 3000);
    }
  };

  const handleQuery = (query: string, isVoice = false) => {
    setCurrentQuery(query);
    const lang = selectedLanguage as keyof typeof mockResponses;
    let responseKey = "spending";
    
    if (query.toLowerCase().includes("return") || query.includes("वापसी") || query.includes("परत") || query.includes("திரும்ப")) {
      responseKey = "returns";
    } else if (query.toLowerCase().includes("impulse") || query.includes("impulse")) {
      responseKey = "impulse";
    } else if (query.toLowerCase().includes("average") || query.includes("औसत") || query.includes("सरासरी") || query.includes("சராசரி")) {
      responseKey = "average";
    }
    
    if (!isVoice) {
      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        content: query,
        role: 'user',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    setTimeout(() => {
      const responseContent = mockResponses[lang][responseKey as keyof typeof mockResponses[typeof lang]];
      setResponse(responseContent);
      
      if (!isVoice) {
        // Add assistant response to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          role: 'assistant',
          timestamp: new Date(),
          language: selectedLanguage
        };
        setMessages(prev => [...prev, assistantMessage]);
        setChatInput("");
      }
    }, 1000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    handleQuery(chatInput, false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleQuery(suggestion, true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-finance flex items-center justify-center">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🎙️ AI Voice Assistant</h1>
              <p className="text-sm text-muted-foreground">Voice & chat support in multiple languages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              Multi-language
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="voice" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Mode
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Voice Interface */}
              <div className="lg:col-span-2 space-y-6">
                {/* Language Selector */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Language / भाषा चुनें</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Voice Input */}
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Input</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <Button
                        variant={isListening ? "destructive" : "gradient"}
                        size="lg"
                        className="h-24 w-24 rounded-full"
                        onClick={handleVoiceToggle}
                      >
                        {isListening ? (
                          <MicOff className="h-8 w-8" />
                        ) : (
                          <Mic className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {isListening ? "Listening... Speak now" : "Click to start voice input"}
                    </p>

                    {currentQuery && (
                      <div className="p-4 bg-muted/30 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">Your Query:</span>
                        </div>
                        <p className="text-sm">{currentQuery}</p>
                      </div>
                    )}

                    {response && (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm text-primary">AI Response:</span>
                        </div>
                        <p className="text-sm">{response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                {/* Quick Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>💡 Quick Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestions[selectedLanguage as keyof typeof suggestions].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full text-left h-auto p-3 justify-start"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="text-sm leading-relaxed">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>📊 Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="text-sm">This Week</span>
                      </div>
                      <Badge variant="secondary">₹5,612</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm">Monthly Avg</span>
                      </div>
                      <Badge variant="secondary">₹18,500</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-warning" />
                        <span className="text-sm">Return Items</span>
                      </div>
                      <Badge variant="warning">2 pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {/* Chat Interface */}
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Chat Assistant
                    </CardTitle>
                  </CardHeader>
                  
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
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {message.language}
                              </Badge>
                            </div>
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
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={`Type your message in ${languages.find(l => l.value === selectedLanguage)?.label}...`}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleChatSend}
                        disabled={!chatInput.trim()}
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Chat Suggestions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Language Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span className="text-xs">{lang.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Chat Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {suggestions[selectedLanguage as keyof typeof suggestions].slice(0, 3).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left h-auto p-2 justify-start text-xs"
                        onClick={() => {
                          setChatInput(suggestion);
                          handleChatSend();
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-finance/10 border-finance/20">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-finance" />
                        <span className="font-medium text-sm">Multi-language Support</span>
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Real-time translation</li>
                        <li>• Voice recognition</li>
                        <li>• Cultural context aware</li>
                        <li>• Local financial terms</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VoiceAssistant;