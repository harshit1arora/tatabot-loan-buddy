from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import uuid
import os
import shutil

from state import LoanState
from agents.master_agent import run_master_agent

app = FastAPI(
    title="Tata Capital Loan Processing API",
    description="Multi-agent loan processing system",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage
SESSIONS: dict[str, LoanState] = {}

# Ensure directories exist
os.makedirs("data/uploads", exist_ok=True)
os.makedirs("data/output_sanctions", exist_ok=True)


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str


class ChatStartResponse(BaseModel):
    session_id: str
    message: str


class ChatMessageResponse(BaseModel):
    reply: str
    step: str
    application_id: Optional[str] = None
    customer_name: Optional[str] = None
    loan_amount: Optional[int] = None
    tenure_months: Optional[int] = None
    emi: Optional[int] = None


class StatusResponse(BaseModel):
    application_id: str
    status: str
    step: str
    customer_name: Optional[str] = None
    loan_amount: Optional[int] = None
    tenure_months: Optional[int] = None


@app.get("/")
async def root():
    return {"message": "Tata Capital Loan Processing API is running"}


@app.post("/chat/start", response_model=ChatStartResponse)
async def start_chat():
    """Start a new chat session."""
    session_id = str(uuid.uuid4())
    state = LoanState(session_id=session_id)
    SESSIONS[session_id] = state
    
    return ChatStartResponse(
        session_id=session_id,
        message="Welcome to Tata Capital! I'm your AI loan assistant. How can I help you today? You can ask about personal loans, home loans, or business loans."
    )


@app.post("/chat/message", response_model=ChatMessageResponse)
async def send_message(request: ChatMessageRequest):
    """Process a chat message through the agent workflow."""
    session_id = request.session_id
    message = request.message
    
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new chat.")
    
    state = SESSIONS[session_id]
    
    # Add user message to history
    state.messages.append({"role": "user", "content": message})
    
    # Run master agent
    result = run_master_agent(message, state)
    
    # Update session state
    updated_state = result["updated_state"]
    SESSIONS[session_id] = updated_state
    
    # Add agent response to history
    updated_state.messages.append({"role": "assistant", "content": result["reply"]})
    
    # Calculate EMI if we have the data
    emi = None
    if updated_state.loan_amount and updated_state.tenure_months:
        from tools.calculate_emi import calculate_emi
        emi = calculate_emi(
            updated_state.loan_amount,
            updated_state.tenure_months,
            updated_state.interest_rate
        )
    
    return ChatMessageResponse(
        reply=result["reply"],
        step=updated_state.step,
        application_id=updated_state.application_id,
        customer_name=updated_state.customer_name,
        loan_amount=updated_state.loan_amount,
        tenure_months=updated_state.tenure_months,
        emi=emi
    )


@app.post("/chat/upload")
async def upload_document(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload a salary slip or other document."""
    if session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")
    
    state = SESSIONS[session_id]
    
    # Save the uploaded file
    upload_dir = "data/uploads"
    file_path = os.path.join(upload_dir, f"{session_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extract salary information using the tool
    from tools.extract_salary_slip import extract_salary_slip
    salary_data = extract_salary_slip(file_path)
    
    # Update state
    state.salary_slip_parsed = True
    state.monthly_salary = salary_data.get("monthly_salary", 75000)
    SESSIONS[session_id] = state
    
    return {
        "message": f"Document '{file.filename}' uploaded successfully. Salary extracted: ₹{state.monthly_salary:,}",
        "salary_extracted": state.monthly_salary,
        "step": state.step
    }


@app.get("/sanction/status/{application_id}", response_model=StatusResponse)
async def get_sanction_status(application_id: str):
    """Get the status of a loan application."""
    # Search for the session with this application_id
    for session_id, state in SESSIONS.items():
        if state.application_id == application_id:
            status = "pending"
            if state.underwriting_result == "approved" and state.step == "sanction":
                status = "approved"
            elif state.underwriting_result == "rejected":
                status = "rejected"
            elif state.underwriting_result == "conditional":
                status = "conditional"
            
            return StatusResponse(
                application_id=application_id,
                status=status,
                step=state.step,
                customer_name=state.customer_name,
                loan_amount=state.loan_amount,
                tenure_months=state.tenure_months
            )
    
    raise HTTPException(status_code=404, detail="Application not found")


@app.get("/sanction/download/{application_id}")
async def download_sanction_letter(application_id: str):
    """Download the sanction letter PDF."""
    pdf_path = f"data/output_sanctions/{application_id}.pdf"
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Sanction letter not found")
    
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"sanction_letter_{application_id}.pdf"
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "active_sessions": len(SESSIONS)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
