import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Activity,
  Users,
  Calendar,
  Brain,
  TestTube,
  Settings,
  HelpCircle,
  AlertTriangle,
  Bell,
  RefreshCw,
  MoreVertical,
  Mic,
  Send,
  User as UserIcon,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Search,
  Sparkles,
  MessageCircle,
  Zap,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Lightbulb,
  Star
} from "lucide-react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const DoctorAIChatbot = () => {
  const navigate = useNavigate();

  // Doctor profile pulled from demo storage for consistency
  const doctorProfile = useMemo(() => {
    const u = localStorage.getItem("demo.user");
    const user = u ? JSON.parse(u) : null;
    return {
      name: user?.role === "doctor" && user?.name ? user.name : "Dr. Sarah Smith",
      specialization: "Cardiology",
      avatar: "/placeholder.svg",
      licenseNumber: "MD-12345",
    };
  }, []);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content:
        "Hello Dr. Smith! 👋 I'm MediVoice AI, your intelligent clinical assistant. I'm here to help you with patient data analysis, clinical guidelines, drug interactions, and medical research. How can I assist you today?",
    },
    {
      id: "m2",
      role: "user",
      content: "What are the latest treatment guidelines for Type 2 Diabetes?",
    },
    {
      id: "m3",
      role: "assistant",
      content:
        "📋 **Latest ADA Type 2 Diabetes Guidelines (2024):**\n\n🔹 **First-line**: Metformin + comprehensive lifestyle modifications\n🔹 **High ASCVD risk**: Consider SGLT2 inhibitors or GLP-1 RA\n🔹 **HbA1c target**: <7% for most adults\n🔹 **BP target**: <130/80 mmHg\n\n💡 Would you like me to generate a treatment protocol or pull specific dosing information for your patient notes?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ 
        top: chatBodyRef.current.scrollHeight, 
        behavior: "smooth" 
      });
    }
  }, [messages]);

  // Quick action suggestions
  const quickActions = [
    { text: "Drug interactions with warfarin", icon: TestTube },
    { text: "Hypertension treatment protocol", icon: Activity },
    { text: "Generate SOAP note template", icon: FileText },
    { text: "Diabetes management guidelines", icon: BookOpen },
  ];

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsSending(true);
    setIsTyping(true);

    // Simulate AI response with more realistic content
    setTimeout(() => {
      const responses = [
        "📊 **Clinical Analysis Complete**\n\nBased on current medical literature and guidelines, here's a comprehensive summary with evidence-based recommendations. I can also generate structured documentation for your EMR system.\n\n🔬 **Key Points:**\n• Evidence level: Grade A recommendation\n• Clinical significance: High\n• Implementation timeline: Immediate\n\n💡 Would you like me to create a patient education handout or treatment protocol?",
        "🩺 **Medical Database Search Results**\n\nI've analyzed the latest research and clinical guidelines. Here are the key findings with proper citations and recommendations tailored to your clinical practice.\n\n📋 **Summary:**\n• Updated protocols available\n• Drug interaction alerts reviewed\n• Patient safety considerations included\n\n🎯 Shall I generate a clinical decision support tool or add this to your knowledge base?",
        "⚕️ **Clinical Decision Support**\n\nBased on evidence-based medicine and current best practices, I've compiled a comprehensive analysis. This includes risk stratification, treatment algorithms, and monitoring protocols.\n\n✅ **Recommendations:**\n• Follow current guidelines\n• Monitor key parameters\n• Consider patient-specific factors\n\n📝 Would you like me to draft clinical notes or create a treatment plan?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: randomResponse,
      };
      
      setMessages((m) => [...m, reply]);
      setIsSending(false);
      setIsTyping(false);
    }, 1500);
  };

  const handleRefresh = () => {
    // Simple refresh action for the demo
    setMessages((m) => m.slice(0, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 flex">
      {/* Sidebar - Matching Doctor Dashboard */}
      <div className="w-64 bg-gradient-to-b from-blue-50 to-blue-100/50 border-r border-blue-200/60 shadow-2xl flex flex-col fixed h-screen backdrop-blur-sm">
        {/* Logo/Brand */}
        <div className="p-5 border-b border-blue-200/60 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">MediVoice</h1>
              <p className="text-xs text-blue-600 font-medium">Doctor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: Activity, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "dashboard" } }) },
              { id: "critical", label: "Critical Alerts", icon: AlertTriangle, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "critical" } }) },
              { id: "patients", label: "Patient List", icon: Users, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "patients" } }) },
              { id: "appointments", label: "Appointments", icon: Calendar, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "appointments" } }) },
              { id: "ai", label: "AI Chatbot", icon: Brain, action: () => navigate("/doctor-ai-chatbot", { replace: true }) },
              { id: "reports", label: "Lab Results", icon: TestTube, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "reports" } }) },
              { id: "settings", label: "Profile & Settings", icon: Settings, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "profile" } }) },
              { id: "help", label: "Help & Support", icon: HelpCircle, action: () => navigate("/doctor-dashboard", { replace: true, state: { tab: "help" } }) },
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 text-sm font-medium group hover:scale-[1.01] hover:shadow-md ${
                  item.id === "ai"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-white/90 hover:to-blue-50/90 hover:text-blue-700 hover:shadow-md hover:border-blue-200/60 border border-transparent"
                }`}
              >
                <item.icon className={`h-5 w-5 transition-all duration-300 ${item.id === "ai" ? 'scale-110 text-blue-100' : 'group-hover:scale-110 group-hover:text-blue-600'}`} />
                <span className="font-medium transition-colors duration-300">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-blue-200/60 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => navigate("/doctor-dashboard", { replace: true, state: { tab: "profile" } })}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg hover:scale-[1.01]"
          >
            <Avatar className="h-10 w-10 ring-2 ring-blue-400/40 shadow-lg">
              <AvatarImage src="/placeholder.svg" alt="Doctor" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                DS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{doctorProfile.name}</p>
              <p className="text-xs text-blue-600">{doctorProfile.specialization}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation Bar with Enhanced Design */}
        <header className="relative bg-gradient-to-r from-white via-blue-50/40 to-purple-50/30 border-b border-blue-200/60 shadow-xl backdrop-blur-md z-[1000]">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between min-h-[70px]">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                      MediVoice AI
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/60 shadow-sm px-3 py-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        Online & Ready
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/60 shadow-sm px-3 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 font-medium ml-20">Welcome back, {doctorProfile.name} • Your intelligent clinical assistant is ready to help</p>
              </div>

              {/* Enhanced Top Right Actions */}
              <div className="flex items-center justify-end gap-4">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-blue-200/40">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Premium AI</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="hover:bg-blue-100/80 relative rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.05] group z-10 bg-white/60 backdrop-blur-sm"
                >
                  <Bell className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </Button>
                
                <Button
                  onClick={() => navigate("/doctor-dashboard", { replace: true, state: { tab: "dashboard" } })}
                  className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-2xl font-medium hover:scale-[1.02]"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Chat Surface */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50/30 via-blue-50/20 to-purple-50/10">
          <div className="max-w-6xl mx-auto">
            {/* AI Chat Interface */}
            <Card className="border border-blue-200/60 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 hover:shadow-3xl transition-all duration-700 rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-100/90 via-indigo-100/70 to-purple-100/60 border-b border-blue-200/60 p-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-4 text-2xl font-bold text-slate-800">
                    <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl shadow-xl animate-pulse">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span>MediVoice AI Assistant</span>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/60 shadow-sm">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 font-normal mt-1">Powered by advanced medical AI • Real-time assistance</p>
                    </div>
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-slate-700">Online</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-lg" 
                      className="hover:bg-white/80 hover:scale-[1.05] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl group bg-white/40 backdrop-blur-sm" 
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-180" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon-lg" 
                      className="hover:bg-white/80 hover:scale-[1.05] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl group bg-white/40 backdrop-blur-sm"
                    >
                      <MoreVertical className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Enhanced Messages Container */}
                <div ref={chatBodyRef} className="h-[65vh] overflow-y-auto px-8 py-8 bg-gradient-to-br from-slate-50/40 via-blue-50/20 to-purple-50/10">
                  <div className="space-y-8">
                    {messages.map((m, index) => (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} group`}>
                        {m.role === "assistant" && (
                          <div className="mr-4 mt-1">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] group-hover:rotate-3">
                              <Brain className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-3xl px-6 py-5 text-sm shadow-xl transition-all duration-500 hover:shadow-2xl animate-in fade-in-50 slide-in-from-bottom-2 ${
                            m.role === "user"
                              ? "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-br-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-blue-500/25"
                              : "bg-white text-slate-800 border border-blue-100/60 hover:border-blue-200/80 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30 shadow-blue-500/10"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="leading-relaxed whitespace-pre-line">
                            {m.content}
                          </div>
                          {m.role === "assistant" && (
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-blue-100/60">
                              <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-blue-50">
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-blue-50">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-blue-50">
                                <FileText className="h-3 w-3 mr-1" />
                                Add to Notes
                              </Button>
                            </div>
                          )}
                        </div>
                        {m.role === "user" && (
                          <div className="ml-4 mt-1">
                            <Avatar className="h-12 w-12 ring-2 ring-blue-400/40 shadow-xl hover:ring-blue-500/60 transition-all duration-300 hover:shadow-2xl hover:scale-[1.05] group-hover:-rotate-3">
                              <AvatarImage src="/placeholder.svg" alt="Doctor" />
                              <AvatarFallback className="bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 text-white font-bold">
                                <UserIcon className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                    ))}
                    {(isSending || isTyping) && (
                      <div className="flex justify-start animate-in fade-in-50 slide-in-from-bottom-4">
                        <div className="mr-4 mt-1">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl animate-pulse">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="bg-white text-slate-800 border border-blue-100/60 rounded-3xl px-6 py-5 shadow-xl">
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-2">
                              <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="h-3 w-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <span className="text-sm text-slate-600 font-medium">AI is thinking...</span>
                            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Composer */}
                <div className="p-8 border-t border-blue-200/60 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4 rounded-3xl border border-blue-200/60 px-6 py-4 bg-white/90 backdrop-blur-sm focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 focus-within:scale-[1.01]">
                    <Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Ask MediVoice AI about clinical guidelines, patient data, drug interactions, or medical research..."
                      className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-500 font-medium"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon-lg" 
                      className="hover:bg-gradient-to-br hover:from-amber-100 hover:to-orange-100 hover:scale-[1.05] transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg group"
                    >
                      <Mic className="h-5 w-5 text-slate-600 group-hover:text-amber-600 transition-colors duration-300" />
                    </Button>
                    <Button
                      size="icon-lg"
                      className="rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white disabled:opacity-60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] disabled:hover:scale-100"
                      onClick={handleSend}
                      disabled={isSending || !input.trim()}
                      aria-label="Send"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/60 shadow-md px-4 py-2">
                        <Brain className="h-4 w-4 mr-2" />
                        Claude Sonnet 4.0
                      </Badge>
                      <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/60 shadow-md px-4 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        Real-time
                      </Badge>
                      <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/60 shadow-md px-4 py-2">
                        <Star className="h-4 w-4 mr-2" />
                        Premium Medical AI
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">Press Enter to send • Shift+Enter for new line</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorAIChatbot;
