from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LoanState(BaseModel):
    session_id: str
    step: str = "conversation"  # conversation | verification | underwriting | sanction
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    loan_amount: Optional[int] = None
    tenure_months: Optional[int] = None
    interest_rate: float = 14.0
    verification_passed: bool = False
    salary_slip_parsed: bool = False
    monthly_salary: Optional[int] = None
    credit_score: Optional[int] = None
    pre_approved_limit: Optional[int] = None
    underwriting_result: Optional[str] = None  # "approved" | "rejected" | "conditional"
    application_id: Optional[str] = None
    sanction_pdf_path: Optional[str] = None
    created_at: datetime = datetime.now()
    messages: List[dict] = []

    class Config:
        arbitrary_types_allowed = True
