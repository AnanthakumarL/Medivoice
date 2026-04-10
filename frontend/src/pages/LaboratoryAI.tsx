import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft,
  Sparkles,
  Settings,
  MessageSquare,
  TrendingUp,
  Volume2,
  VolumeX,
  TestTube,
  Microscope,
  FlaskConical,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Beaker,
  Activity,
  Target,
  Lightbulb,
  ShieldCheck,
  Database,
  ScanLine,
  AlertCircle,
  Bot,
  Zap,
  Filter,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LaboratoryAI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: "Hello! I'm LabAI, your intelligent laboratory assistant. I can help you with test result analysis, quality control monitoring, equipment diagnostics, sample processing optimization, and research insights. How can I assist with your laboratory operations today?",
      timestamp: new Date(),
      avatar: "🔬",
      isTyping: false
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      avatar: "👤",
      isTyping: false
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    // Simulate AI response with typing effect
    setTimeout(() => {
      const aiResponse = generateLabAIResponse(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiResponse,
        timestamp: new Date(),
        avatar: "🔬",
        isTyping: false
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateLabAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('test') || input.includes('result')) {
      return "I can see you have 47 pending test results. Based on current processing patterns, I recommend prioritizing the 3 critical cardiac enzyme tests. The automated analyzer #3 needs calibration which may affect turnaround times. Would you like me to generate a priority processing schedule?";
    } else if (input.includes('equipment') || input.includes('maintenance')) {
      return "Equipment status overview: 95% operational efficiency. Analyzer #3 requires calibration (medium priority), and Microscope #7 has low reagent levels (low priority). I predict optimal maintenance windows during 2-4 PM based on historical workload patterns. Shall I schedule maintenance alerts?";
    } else if (input.includes('quality') || input.includes('control')) {
      return "Quality metrics are excellent! Temperature control at 98.9% (target: 99%), sample integrity at 99.2%, but result accuracy has declined to 97.8%. I recommend investigating the accuracy trend - it may be related to the pending calibration on Analyzer #3. Want me to run a detailed QC analysis?";
    } else if (input.includes('efficiency') || input.includes('workflow')) {
      return "Current lab efficiency is 87% with 324 tests processed today (target: 450). Processing time averages 2.3 hours. I've identified bottlenecks in sample preparation and suggest reorganizing workstations. The AI can optimize scheduling to improve throughput by 15-20%. Shall I create an optimization plan?";
    } else if (input.includes('critical') || input.includes('urgent')) {
      return "Critical alerts: 3 urgent results pending review, 2 STAT orders in queue. Patient PT-2024-002 has critical cardiac enzymes requiring immediate attention. I recommend immediate notification to attending physician Dr. Martinez. Auto-escalation protocols are active. Need assistance with prioritization?";
    } else {
      return "I understand you're asking about: '" + userInput + "'. As your Laboratory AI, I can assist with test result interpretation, equipment monitoring, quality control analysis, workflow optimization, inventory management, and research data mining. I'm continuously learning from lab patterns to improve operations. How can I help optimize your laboratory today?";
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice recording stopped",
        description: "Lab voice assistant disabled.",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Voice recording started",
        description: "Speak your laboratory query...",
      });
      
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Analyze quality control metrics for today");
        toast({
          title: "Voice input received",
          description: "Processing: 'Analyze quality control metrics for today'",
        });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/laboratory-dashboard')}
                className="flex items-center space-x-2 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Lab Dashboard</span>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Microscope className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    LabAI Assistant
                  </h1>
                  <p className="text-sm text-gray-600">Intelligent Laboratory Operations</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Lab AI Online</span>
              </div>
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main AI Chat Interface */}
          <div className="">
            <Card className="h-[700px] flex flex-col shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Brain className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">Laboratory AI Assistant</CardTitle>
                      <p className="text-blue-100 text-sm">Advanced lab operations AI</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white">Processing</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarFallback className="text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white">
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-2xl px-5 py-3 shadow-sm ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                          <AvatarFallback className="text-sm bg-gradient-to-r from-green-500 to-blue-500 text-white">🔬</AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">LabAI analyzing...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isListening ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={`flex items-center space-x-2 transition-all ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'hover:bg-green-50 border-green-200'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      <span>{isListening ? 'Stop' : 'Voice'}</span>
                    </Button>
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about test results, equipment status, quality control, or lab workflows..."
                      className="flex-1 h-12 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isAnalyzing}
                      className="h-12 px-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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

export default LaboratoryAI;
