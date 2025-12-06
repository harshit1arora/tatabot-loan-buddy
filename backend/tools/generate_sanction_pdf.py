import os
from datetime import datetime
from state import LoanState

# Try to import FPDF, fall back to basic text file if not available
try:
    from fpdf import FPDF
    FPDF_AVAILABLE = True
except ImportError:
    FPDF_AVAILABLE = False
    print("Warning: fpdf not installed. PDF generation will create text files instead.")


def generate_sanction_pdf(state: LoanState) -> dict:
    """
    Generate a sanction letter PDF for an approved loan.
    
    Args:
        state: The current loan state with all application details
        
    Returns:
        dict with:
        - file_path: Path to the generated PDF
        - application_id: The application ID
    """
    # Ensure output directory exists
    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "output_sanctions")
    os.makedirs(output_dir, exist_ok=True)
    
    application_id = state.application_id or f"APP-{state.customer_id}-DEFAULT"
    
    # Calculate EMI
    from tools.calculate_emi import calculate_emi
    emi = calculate_emi(
        state.loan_amount or 0,
        state.tenure_months or 60,
        state.interest_rate
    )
    
    if FPDF_AVAILABLE:
        return _generate_pdf_with_fpdf(state, output_dir, application_id, emi)
    else:
        return _generate_text_file(state, output_dir, application_id, emi)


def _generate_pdf_with_fpdf(state: LoanState, output_dir: str, application_id: str, emi: int) -> dict:
    """Generate PDF using FPDF library."""
    pdf = FPDF()
    pdf.add_page()
    
    # Header
    pdf.set_font("Arial", "B", 20)
    pdf.cell(0, 15, "TATA CAPITAL", ln=True, align="C")
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "LOAN SANCTION LETTER", ln=True, align="C")
    pdf.ln(10)
    
    # Line separator
    pdf.set_draw_color(0, 51, 102)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(10)
    
    # Application details
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 8, f"Application ID: {application_id}", ln=True)
    pdf.cell(0, 8, f"Date: {datetime.now().strftime('%d-%B-%Y')}", ln=True)
    pdf.ln(5)
    
    # Customer details
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "BORROWER DETAILS", ln=True)
    pdf.set_font("Arial", "", 11)
    pdf.cell(0, 7, f"Name: {state.customer_name or 'N/A'}", ln=True)
    pdf.cell(0, 7, f"Customer ID: {state.customer_id or 'N/A'}", ln=True)
    pdf.ln(5)
    
    # Loan details
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "LOAN DETAILS", ln=True)
    pdf.set_font("Arial", "", 11)
    
    loan_amount = state.loan_amount or 0
    tenure = state.tenure_months or 60
    
    pdf.cell(0, 7, f"Loan Amount: Rs. {loan_amount:,}", ln=True)
    pdf.cell(0, 7, f"Interest Rate: {state.interest_rate}% per annum", ln=True)
    pdf.cell(0, 7, f"Tenure: {tenure} months", ln=True)
    pdf.cell(0, 7, f"Monthly EMI: Rs. {emi:,}", ln=True)
    pdf.cell(0, 7, f"Total Payable: Rs. {emi * tenure:,}", ln=True)
    pdf.ln(10)
    
    # Terms and conditions
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "TERMS AND CONDITIONS", ln=True)
    pdf.set_font("Arial", "", 10)
    terms = [
        "1. This sanction is valid for 30 days from the date of issue.",
        "2. The loan is subject to verification of original documents.",
        "3. Processing fee of 1% + GST is applicable.",
        "4. Prepayment/foreclosure charges as per RBI guidelines.",
        "5. EMI will be debited on the 5th of every month."
    ]
    for term in terms:
        pdf.cell(0, 6, term, ln=True)
    pdf.ln(10)
    
    # Footer
    pdf.set_font("Arial", "I", 10)
    pdf.cell(0, 8, "This is a system-generated document.", ln=True, align="C")
    pdf.cell(0, 8, "For queries, contact: support@tatacapital.com", ln=True, align="C")
    
    # Save PDF
    file_path = os.path.join(output_dir, f"{application_id}.pdf")
    pdf.output(file_path)
    
    return {
        "file_path": file_path,
        "application_id": application_id,
        "generated_at": datetime.now().isoformat()
    }


def _generate_text_file(state: LoanState, output_dir: str, application_id: str, emi: int) -> dict:
    """Fallback: Generate a text file if FPDF is not available."""
    loan_amount = state.loan_amount or 0
    tenure = state.tenure_months or 60
    
    content = f"""
================================================================================
                              TATA CAPITAL
                         LOAN SANCTION LETTER
================================================================================

Application ID: {application_id}
Date: {datetime.now().strftime('%d-%B-%Y')}

--------------------------------------------------------------------------------
BORROWER DETAILS
--------------------------------------------------------------------------------
Name: {state.customer_name or 'N/A'}
Customer ID: {state.customer_id or 'N/A'}

--------------------------------------------------------------------------------
LOAN DETAILS
--------------------------------------------------------------------------------
Loan Amount: Rs. {loan_amount:,}
Interest Rate: {state.interest_rate}% per annum
Tenure: {tenure} months
Monthly EMI: Rs. {emi:,}
Total Payable: Rs. {emi * tenure:,}

--------------------------------------------------------------------------------
TERMS AND CONDITIONS
--------------------------------------------------------------------------------
1. This sanction is valid for 30 days from the date of issue.
2. The loan is subject to verification of original documents.
3. Processing fee of 1% + GST is applicable.
4. Prepayment/foreclosure charges as per RBI guidelines.
5. EMI will be debited on the 5th of every month.

--------------------------------------------------------------------------------
This is a system-generated document.
For queries, contact: support@tatacapital.com
================================================================================
"""
    
    file_path = os.path.join(output_dir, f"{application_id}.txt")
    with open(file_path, "w") as f:
        f.write(content)
    
    return {
        "file_path": file_path,
        "application_id": application_id,
        "generated_at": datetime.now().isoformat()
    }
