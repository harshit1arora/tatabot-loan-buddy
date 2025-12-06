# Tata Capital Loan Processing Backend

Multi-agent loan processing system using FastAPI.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Master Agent                            │  │
│  │         (Orchestrator - Routes to Worker Agents)           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                    │         │         │         │               │
│           ┌───────┘         │         │         └───────┐       │
│           ▼                 ▼         ▼                 ▼       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │Sales Agent  │  │Verification │  │Underwriting │  │Sanction ││
│  │             │  │   Agent     │  │   Agent     │  │ Agent   ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘│
│         │                │                │              │       │
│         └────────────────┼────────────────┼──────────────┘       │
│                          ▼                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Tool Layer                            │  │
│  │  verify_kyc │ get_credit_score │ calculate_emi │ gen_pdf  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │                                        │
│                          ▼                                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Data Layer (JSON)                        │  │
│  │            customers.json │ offers.json                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test the API

```bash
# Start a chat session
curl -X POST http://localhost:8000/chat/start

# Send a message
curl -X POST http://localhost:8000/chat/message \
  -H "Content-Type: application/json" \
  -d '{"session_id": "YOUR_SESSION_ID", "message": "I need a loan of 5 lakhs"}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat/start` | POST | Start a new chat session |
| `/chat/message` | POST | Send a message and get agent response |
| `/chat/upload` | POST | Upload salary slip or documents |
| `/sanction/status/{id}` | GET | Get application status |
| `/sanction/download/{id}` | GET | Download sanction letter PDF |
| `/health` | GET | Health check |

## State Machine

```
conversation → verification → underwriting → sanction
     ↑              │               │
     └──────────────┴───────────────┘
           (on rejection/retry)
```

## Agent Responsibilities

### Sales Agent
- Understands loan intent
- Extracts loan amount and tenure
- Presents offers and EMI calculations
- Initiates verification process

### Verification Agent
- Performs KYC verification
- Validates customer identity
- Checks document authenticity

### Underwriting Agent
- Evaluates credit score
- Applies lending rules
- Determines approval/rejection

### Sanction Agent
- Generates sanction letter
- Creates application ID
- Finalizes the loan process

## Test Customers

| Customer ID | Name | Credit Score | Pre-approved Limit |
|-------------|------|--------------|-------------------|
| CUST001 | Rahul Sharma | 782 | ₹5,00,000 |
| CUST002 | Priya Patel | 815 | ₹10,00,000 |
| CUST003 | Amit Kumar | 720 | ₹7,50,000 |
| CUST004 | Sneha Reddy | 850 | ₹20,00,000 |
| CUST005 | Vikram Singh | 680 | ₹3,00,000 |

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy!

## Future Enhancements

- [ ] Integrate real LLM (OpenAI/Anthropic)
- [ ] Add LangGraph for complex workflows
- [ ] Connect to real credit bureau APIs
- [ ] Add database persistence (PostgreSQL)
- [ ] Implement authentication (JWT)
