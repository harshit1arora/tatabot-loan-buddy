import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, CheckCircle, Loader, MessageSquare, User, Bot, Phone, Download, Shield, Clock, Star } from 'lucide-react';

// Complete Customer Data
const mockCustomers = [
  {
    customer_id: "CUST001", name: "Rahul Sharma", age: 32, city: "Mumbai", mobile: "9876543210",
    email: "rahul.sharma@email.com", pan: "ABCDE1234F", monthly_salary: 75000,
    job_type: "Software Engineer", company: "TCS Limited", experience_years: 8,
    credit_score: 750, pre_approved_limit: 400000, total_existing_emi: 15000,
    existing_loans: [{ loan_type: "Home Loan", bank: "HDFC Bank", emi: 15000 }],
    employment_type: "Salaried"
  },
  {
    customer_id: "CUST002", name: "Priya Patel", age: 28, city: "Pune", mobile: "9876543211",
    email: "priya.patel@email.com", pan: "BCDEF2345G", monthly_salary: 55000,
    job_type: "Marketing Manager", company: "Wipro Limited", experience_years: 5,
    credit_score: 720, pre_approved_limit: 275000, total_existing_emi: 12000,
    existing_loans: [{ loan_type: "Car Loan", bank: "Axis Bank", emi: 12000 }],
    employment_type: "Salaried"
  },
  {
    customer_id: "CUST003", name: "Amit Kumar", age: 35, city: "Delhi", mobile: "9876543212",
    email: "amit.kumar@email.com", pan: "CDEFG3456H", monthly_salary: 95000,
    job_type: "Senior Consultant", company: "Deloitte India", experience_years: 12,
    credit_score: 780, pre_approved_limit: 500000, total_existing_emi: 0,
    existing_loans: [], employment_type: "Salaried"
  },
  {
    customer_id: "CUST004", name: "Sneha Reddy", age: 26, city: "Bangalore", mobile: "9876543213",
    email: "sneha.reddy@email.com", pan: "DEFGH4567I", monthly_salary: 42000,
    job_type: "Business Analyst", company: "Accenture", experience_years: 3,
    credit_score: 680, pre_approved_limit: 150000, total_existing_emi: 8500,
    existing_loans: [{ loan_type: "Personal Loan", bank: "Kotak Bank", emi: 8500 }],
    employment_type: "Salaried"
  },
  {
    customer_id: "CUST005", name: "Rajesh Gupta", age: 40, city: "Chennai", mobile: "9876543214",
    email: "rajesh.gupta@email.com", pan: "EFGHI5678J", monthly_salary: 125000,
    job_type: "General Manager", company: "L&T Infotech", experience_years: 16,
    credit_score: 800, pre_approved_limit: 750000, total_existing_emi: 43000,
    existing_loans: [
      { loan_type: "Home Loan", bank: "SBI", emi: 25000 },
      { loan_type: "Car Loan", bank: "HDFC Bank", emi: 18000 }
    ], employment_type: "Salaried"
  },
];

const TataCapitalLoanChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentStage, setCurrentStage] = useState('conversation');
  const [sessionData, setSessionData] = useState({
    customerData: null, loanAmount: null, tenure: null, interestRate: 10.5,
    emi: null, phoneVerified: false, eligibilityStatus: null
  });
  const [conversationState, setConversationState] = useState('greeting');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const stages = [
    { id: 'conversation', label: 'Conversation', icon: MessageSquare },
    { id: 'verification', label: 'Verification', icon: CheckCircle },
    { id: 'underwriting', label: 'Credit Check', icon: Star },
    { id: 'sanction', label: 'Sanction', icon: CheckCircle }
  ];

  useEffect(() => {
    addBotMessage('Master Agent', '🙏 Namaste! Welcome to Tata Capital.\n\nI\'m your AI Personal Loan Assistant. May I know your name?');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (agent, content, options = {}) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(), type: 'bot', agent, content,
      timestamp: new Date(), ...options
    }]);
  };

  const addUserMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(), type: 'user', content, timestamp: new Date()
    }]);
  };

  const calculateEMI = (principal, rate, tenure) => {
    const r = rate / (12 * 100);
    return Math.round((principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1));
  };

  const checkEligibility = (customer, amount) => {
    if (customer.age < 21 || customer.age > 60) {
      return { approved: false, reason: 'age', message: `Age restriction: ${customer.age} years (Required: 21-60)` };
    }
    if (customer.monthly_salary < 15000) {
      return { approved: false, reason: 'salary', message: 'Monthly salary below ₹15,000' };
    }
    if (customer.credit_score < 700) {
      return { approved: false, reason: 'credit', message: `Credit score ${customer.credit_score} is below 700` };
    }
    if (amount <= customer.pre_approved_limit) {
      return { approved: true, instant: true, reason: 'instant', message: '✨ Instant approval available!' };
    }
    if (amount <= customer.pre_approved_limit * 2) {
      return { approved: 'conditional', reason: 'salary_slip', message: 'Needs salary slip verification' };
    }
    return { approved: false, reason: 'excess', message: 'Amount exceeds 2x pre-approved limit' };
  };

  const processConversation = (userInput) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = userInput.toLowerCase();

      switch (conversationState) {
        case 'greeting':
          setSessionData(prev => ({ ...prev, userName: userInput.trim() }));
          setConversationState('ask_phone');
          addBotMessage('Master Agent', `Thank you, ${userInput.trim()}! 😊\n\nPlease share your 10-digit mobile number for verification.`,
            { suggestions: ['9876543210', '9876543212', '9876543214'] });
          break;

        case 'ask_phone':
          const phone = userInput.match(/\d{10}/);
          if (phone) {
            const customer = mockCustomers.find(c => c.mobile === phone[0]);
            if (customer) {
              setSessionData(prev => ({ ...prev, customerData: customer, phoneVerified: true }));
              setCurrentStage('verification');
              setConversationState('show_profile');
              addBotMessage('Verification Agent', `✅ Mobile verified successfully!\n\n👤 ${customer.name}\n📊 Credit Score: ${customer.credit_score}/900\n💰 Pre-approved: ₹${customer.pre_approved_limit.toLocaleString('en-IN')}`);
              setTimeout(() => {
                addBotMessage('Sales Agent', `🎉 Great news, ${customer.name.split(' ')[0]}!\n\nYou have a pre-approved personal loan offer of ₹${customer.pre_approved_limit.toLocaleString('en-IN')}!\n\nHow much would you like to borrow?`,
                  { suggestions: ['₹2,00,000', '₹3,00,000', `₹${customer.pre_approved_limit.toLocaleString('en-IN')}`] });
                setConversationState('ask_amount');
              }, 2000);
            } else {
              addBotMessage('Verification Agent', '❌ Mobile number not found in our records.\n\nPlease try again or contact our support team.');
            }
          } else {
            addBotMessage('Master Agent', 'Please enter a valid 10-digit mobile number.');
          }
          break;

        case 'ask_amount':
          // Remove commas and extract all digits for Indian number format (e.g., 2,00,000)
          const cleanedInput = userInput.replace(/,/g, '');
          const amt = cleanedInput.match(/\d+/);
          if (amt) {
            const amount = parseInt(amt[0]);
            const { customerData } = sessionData;
            const elig = checkEligibility(customerData, amount);
            
            setSessionData(prev => ({ ...prev, loanAmount: amount }));
            
            if (!elig.approved) {
              addBotMessage('Underwriting Agent', `❌ Application Declined\n\n${elig.message}\n\nPlease contact our support team for assistance.`,
                { error: true, suggestions: ['Contact Support', 'Try Another Amount'] });
              setConversationState('rejected');
              return;
            }

            if (elig.approved === 'conditional') {
              setConversationState('need_salary');
              addBotMessage('Sales Agent', `Loan Amount: ₹${amount.toLocaleString('en-IN')}\n\n${elig.message}\n\nFirst, let's choose your preferred tenure:`,
                { suggestions: ['24 months', '36 months', '48 months'] });
              setConversationState('ask_tenure_cond');
              return;
            }

            setConversationState('ask_tenure');
            const emi12 = calculateEMI(amount, 10.5, 12);
            const emi24 = calculateEMI(amount, 10.5, 24);
            const emi36 = calculateEMI(amount, 10.5, 36);
            addBotMessage('Sales Agent', `Perfect! ₹${amount.toLocaleString('en-IN')} ${elig.message}\n\nChoose your preferred tenure:\n\n📅 12 months: ₹${emi12.toLocaleString('en-IN')}/month\n📅 24 months: ₹${emi24.toLocaleString('en-IN')}/month\n📅 36 months: ₹${emi36.toLocaleString('en-IN')}/month`,
              { suggestions: ['24 months', '36 months', '48 months'] });
          } else {
            addBotMessage('Sales Agent', 'Please enter a valid loan amount (e.g., 300000)');
          }
          break;

        case 'ask_tenure':
        case 'ask_tenure_cond':
          const ten = userInput.match(/\d+/);
          if (ten) {
            const tenure = parseInt(ten[0]);
            const { loanAmount, customerData } = sessionData;
            const emi = calculateEMI(loanAmount, 10.5, tenure);
            setSessionData(prev => ({ ...prev, tenure, emi }));
            
            const total = customerData.total_existing_emi + emi;
            const ratio = (total / customerData.monthly_salary) * 100;
            
            addBotMessage('Sales Agent', `📋 Loan Summary\n\nAmount: ₹${loanAmount.toLocaleString('en-IN')}\nTenure: ${tenure} months\nMonthly EMI: ₹${emi.toLocaleString('en-IN')}\nEMI/Income Ratio: ${ratio.toFixed(1)}%\n\n${conversationState === 'ask_tenure_cond' ? '📄 Please upload your salary slip to proceed' : '✅ Ready to proceed with credit check?'}`,
              { suggestions: conversationState === 'ask_tenure_cond' ? ['Upload Document'] : ['Yes, Proceed'] });
            
            setConversationState(conversationState === 'ask_tenure_cond' ? 'upload_salary' : 'confirm');
          }
          break;

        case 'upload_salary':
          addBotMessage('Verification Agent', '📎 Click the upload button below to submit your salary slip (PDF, JPG, or PNG format).',
            { needsUpload: true });
          break;

        case 'confirm':
          if (lower.includes('yes') || lower.includes('proceed')) {
            triggerCreditCheck();
          }
          break;

        case 'sanction_ready':
          generateSanctionLetter();
          break;

        default:
          addBotMessage('Master Agent', 'Please choose from the suggestions below.');
      }
    }, 1000);
  };

  const triggerCreditCheck = () => {
    setCurrentStage('underwriting');
    setConversationState('credit_check');
    addBotMessage('Underwriting Agent', '🔍 Running comprehensive credit check...\n\nThis will take a few moments.', { showLoader: true });
    
    setTimeout(() => {
      const { customerData, emi } = sessionData;
      const ratio = ((customerData.total_existing_emi + emi) / customerData.monthly_salary) * 100;
      
      setIsTyping(false);
      if (customerData.credit_score >= 700 && ratio <= 50) {
        addBotMessage('Underwriting Agent', `✅ CREDIT CHECK APPROVED!\n\n📊 Credit Score: ${customerData.credit_score}/900\n💳 EMI/Income Ratio: ${ratio.toFixed(1)}%\n✨ Status: Excellent\n\nReady to generate your sanction letter?`,
          { suggestions: ['Generate Sanction Letter'] });
        setConversationState('sanction_ready');
      } else {
        addBotMessage('Underwriting Agent', `❌ Credit Check Declined\n\nReason: ${ratio > 50 ? 'EMI/Income ratio exceeds 50%' : 'Credit score below minimum requirement'}\n\nPlease contact support for assistance.`,
          { error: true });
      }
    }, 3000);
  };

  const generateSanctionLetter = () => {
    setCurrentStage('sanction');
    addBotMessage('Document Agent', '📄 Generating your sanction letter...\n\nPlease wait while we prepare your documents.', { showLoader: true });
    
    setTimeout(() => {
      const { customerData, loanAmount, tenure, emi } = sessionData;
      const ref = `TATA-${Date.now().toString().slice(-8)}`;
      
      setIsTyping(false);
      addBotMessage('Document Agent', `🎊 CONGRATULATIONS ${customerData.name.toUpperCase()}!\n\n✅ YOUR LOAN IS SANCTIONED!\n\n📋 Reference: ${ref}\n💰 Amount: ₹${loanAmount.toLocaleString('en-IN')}\n📅 Tenure: ${tenure} months\n💳 Monthly EMI: ₹${emi.toLocaleString('en-IN')}\n📊 Total Payment: ₹${(emi * tenure).toLocaleString('en-IN')}\n\n⏱️ Funds will be disbursed within 24 hours!\n\nThank you for choosing Tata Capital! 🎉`,
        { downloadable: true, suggestions: ['Download PDF', 'E-Sign Now'] });
    }, 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setUploadedFile(file);
      addUserMessage(`📎 Uploaded: ${file.name}`);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage('Verification Agent', `✅ Document verified successfully!\n\n💰 Salary: ₹${sessionData.customerData.monthly_salary.toLocaleString('en-IN')}\n✨ Status: Verified\n\nProceeding to credit check...`);
        setTimeout(() => triggerCreditCheck(), 2000);
      }, 2500);
    } else {
      alert('Please upload a file under 5MB');
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addUserMessage(input);
    processConversation(input);
    setInput('');
  };

  const handleSuggestionClick = (s) => {
    addUserMessage(s);
    processConversation(s);
  };

  const getAgentColor = (agent) => {
    const colors = {
      'Master Agent': 'from-agent-master to-agent-master/80',
      'Sales Agent': 'from-agent-sales to-agent-sales/80',
      'Verification Agent': 'from-agent-verification to-agent-verification/80',
      'Underwriting Agent': 'from-agent-underwriting to-agent-underwriting/80',
      'Document Agent': 'from-agent-document to-agent-document/80'
    };
    return `bg-gradient-to-r ${colors[agent] || 'from-primary to-primary/80'}`;
  };

  const stageIdx = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-primary shadow-xl border-b-4 border-secondary">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-primary font-bold text-3xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Tata Capital</h1>
              <p className="text-xs text-secondary-light font-semibold tracking-wide">AI Loan Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Phone className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-white">1860-267-6789</span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStage !== 'landing' && (
        <div className="bg-white shadow-md px-4 py-6 border-b">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const done = idx < stageIdx;
              const curr = idx === stageIdx;
              const active = idx <= stageIdx;
              
              return (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done ? 'bg-gradient-to-br from-secondary to-secondary-dark shadow-lg' : 
                      curr ? 'bg-gradient-primary shadow-glow animate-pulse-glow' : 
                      'bg-muted'
                    }`}>
                      {done ? <CheckCircle className="w-7 h-7 text-white" /> : 
                       <Icon className={`w-7 h-7 ${active ? 'text-white' : 'text-muted-foreground'}`} />}
                    </div>
                    <span className={`text-xs mt-2 font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-1 h-2 mx-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-secondary transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`flex items-start space-x-3 max-w-2xl ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  msg.type === 'user' ? 'bg-gradient-to-br from-primary to-primary-light' : 'bg-gradient-to-br from-accent to-accent/80'
                }`}>
                  {msg.type === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1">
                  {msg.agent && (
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-2 ${getAgentColor(msg.agent)} text-white shadow-md`}>
                      {msg.agent}
                    </span>
                  )}
                  <div className={`px-5 py-4 rounded-2xl shadow-lg ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary-light text-white' 
                      : 'bg-white text-foreground border border-border'
                  }`}>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.content}</p>
                    {msg.showLoader && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Loader className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Processing...</span>
                      </div>
                    )}
                    {msg.downloadable && (
                      <button className="mt-4 px-5 py-2.5 bg-gradient-secondary text-primary rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                        <Download className="w-4 h-4" />
                        <span>Download Sanction Letter</span>
                      </button>
                    )}
                    {msg.needsUpload && (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-5 py-2.5 bg-gradient-primary text-white rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                        <Upload className="w-4 h-4" />
                        <span>Upload Document</span>
                      </button>
                    )}
                  </div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(s)}
                          className="px-4 py-2 bg-white border-2 border-primary/20 text-primary rounded-full text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm hover:shadow-md transform hover:scale-105">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-slide-up">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl shadow-lg border border-border">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border-t px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-center items-center space-x-8 text-xs text-foreground">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-secondary" />
            <span className="font-semibold">RBI Registered</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-secondary" />
            <span className="font-semibold">100% Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-secondary" />
            <span className="font-semibold">24hr Disbursal</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-primary/10 px-4 py-5 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gradient-to-br from-muted to-muted/50 hover:from-primary/10 hover:to-primary/5 rounded-xl border-2 border-primary/20 transition-all transform hover:scale-105">
            <Upload className="w-5 h-5 text-primary" />
          </button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background" />
          <button onClick={handleSend} disabled={!input.trim()}
            className="p-3 bg-gradient-primary hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all transform hover:scale-105 shadow-lg">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TataCapitalLoanChatbot;
