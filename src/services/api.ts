// API Service Layer for Tata Capital Loan Chatbot
// Configure BASE_URL to your backend

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  customer_id?: string;
  language: 'en' | 'hi';
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  agent: 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction';
  conversation_id: string;
  suggestions?: string[];
  action?: string;
  data?: Record<string, unknown>;
}

export interface UploadResponse {
  success: boolean;
  document_id: string;
  document_type: string;
  extracted_data?: Record<string, unknown>;
  message: string;
}

export interface LoanStatusResponse {
  application_id: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'disbursed';
  stage: string;
  amount?: number;
  emi?: number;
  tenure?: number;
  next_steps?: string[];
  updated_at: string;
}

export interface DocumentVerifyResponse {
  success: boolean;
  verified: boolean;
  extracted_fields: {
    name?: string;
    employer?: string;
    salary?: number;
    net_pay?: number;
    date?: string;
  };
  confidence: number;
  message: string;
}

// Chat with Master Agent
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  return response.json();
}

// Upload documents (PDF/JPG/PNG)
export async function uploadDocument(
  file: File,
  documentType: 'salary_slip' | 'pan_card' | 'aadhaar' | 'bank_statement',
  customerId?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);
  if (customerId) {
    formData.append('customer_id', customerId);
  }

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload API error: ${response.status}`);
  }

  return response.json();
}

// Get loan application status
export async function getLoanStatus(applicationId: string): Promise<LoanStatusResponse> {
  const response = await fetch(`${BASE_URL}/status/${applicationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Status API error: ${response.status}`);
  }

  return response.json();
}

// Verify documents and extract fields
export async function verifyDocument(
  file: File,
  documentType: 'salary_slip' | 'pan_card' | 'aadhaar' | 'bank_statement'
): Promise<DocumentVerifyResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', documentType);

  const response = await fetch(`${BASE_URL}/verify/docs`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Verify API error: ${response.status}`);
  }

  return response.json();
}
