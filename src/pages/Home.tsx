import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Handshake, 
  FileCheck, 
  Calculator, 
  Shield, 
  FileText, 
  Server, 
  Cpu,
  ArrowRight,
  Zap,
  Target,
  Users,
  Gift,
  Award,
  Bot,
  CheckCircle,
  TrendingUp,
  Clock
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: MessageSquare, title: "Conversational AI Chatbot", description: "Natural language interaction for seamless loan inquiries" },
    { icon: Handshake, title: "Negotiates Just Like Humans", description: "Smart negotiation capabilities for personalized offers" },
    { icon: FileCheck, title: "PAN & Salary Slip Verification", description: "Automated document verification and validation" },
    { icon: Calculator, title: "Automated EMI & Offer Calculation", description: "Instant EMI computation with best rates" },
    { icon: Shield, title: "Loan Underwriting & Risk Engine", description: "AI-powered credit assessment and risk scoring" },
    { icon: FileText, title: "Instant Sanction Letter PDF", description: "Generate loan sanction documents instantly" },
    { icon: Server, title: "Fully Tested Backend APIs", description: "Robust and reliable FastAPI backend" },
    { icon: Cpu, title: "Works with LangGraph Agents", description: "Advanced multi-agent orchestration" },
  ];

  const agents = [
    { name: "Master Agent", role: "Controls Full Flow", color: "bg-primary" },
    { name: "Sales Agent", role: "Offers & EMI", color: "bg-agent-sales" },
    { name: "Verification Agent", role: "PAN, Salary Slip", color: "bg-agent-verification" },
    { name: "Underwriting Agent", role: "Risk Scoring", color: "bg-agent-underwriting" },
    { name: "Sanction Agent", role: "PDF Letter", color: "bg-agent-sanction" },
  ];

  const metrics = [
    { value: "48hrs → 2min", label: "Processing Time Reduced", icon: Clock },
    { value: "80%", label: "Automation Rate", icon: Zap },
    { value: "97%", label: "Accuracy Score", icon: Target },
    { value: "Smart", label: "Personalised Offers", icon: Gift },
    { value: "Best", label: "Negotiators", icon: Award },
  ];

  const team = [
    { name: "Harshit Arora", college: "VIT, Bhopal" },
    { name: "Dharanikota Lavnesh Rao", college: "VIT, Vellore" },
    { name: "Pulkit Agrawal", college: "VIT, Bhopal" },
    { name: "Akshat Majila", college: "VIT, Chennai" },
    { name: "Tejas Ranjeet", college: "IIT, Madras" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Bot className="w-4 h-4 mr-2 inline" />
              Multi-Agent AI System
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Tata Capital
              <span className="block text-primary">AI Powered Loan Assistant</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A multi-agent conversational AI that automates loan inquiry, verification, 
              underwriting and sanctioning — just like real loan officers.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/chat')}
              className="group px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Launch AI Loan Assistant
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-primary rounded-full" />
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">About The Project</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Built by Team <span className="text-primary">Code Catalysts</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built an AI Powered Loan Assistant using a multi-agent architecture. It simulates 
              how real loan officers in Tata Capital work across <strong>Sales</strong>, <strong>Verification</strong>, 
              <strong> Underwriting</strong> and <strong>Sanctioning</strong>. The system guides the user from 
              loan inquiry → verification → underwriting → sanction letter automatically, improving 
              speed, accuracy and customer experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Powerful Capabilities
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* System Flow Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Architecture</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Multi-Agent System Flow
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {agents.map((agent, index) => (
              <div key={index} className="flex items-center">
                <Card className="p-6 bg-card border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className={`w-4 h-4 rounded-full ${agent.color} mb-3`} />
                  <h3 className="font-bold text-foreground">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </Card>
                {index < agents.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Impact</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Transforming Loan Processing
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-to-br from-card to-muted/30 border-border/50 hover:shadow-lg transition-all duration-300">
                <metric.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Code Catalysts from VIT
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((member, index) => (
              <Card key={index} className="p-6 bg-card border-border/50 hover:shadow-lg transition-all duration-300 min-w-[200px]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-center">{member.name}</h3>
                <p className="text-sm text-muted-foreground text-center">{member.college}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="p-12 bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-primary/20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Experience AI-Powered Lending?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your loan journey with our intelligent assistant. Get instant offers, 
              quick verification, and automated approval — all in minutes.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/chat')}
              className="group px-8 py-6 text-lg font-semibold"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Made with ❤️ for <span className="font-semibold text-foreground">EY Techathon 6.0</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
