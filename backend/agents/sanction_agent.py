from state import LoanState
from tools.generate_sanction_pdf import generate_sanction_pdf
from tools.calculate_emi import calculate_emi


def handle_sanction(state: LoanState) -> tuple[str, LoanState]:
    """
    Sanction Agent: Generates sanction letter and finalizes application.
    
    Responsibilities:
    - Generate unique application ID
    - Create sanction letter PDF
    - Update state with application details
    - Provide final confirmation to user
    """
    # Generate application ID if not exists
    if not state.application_id:
        state.application_id = f"APP-{state.customer_id}-{state.session_id[:8].upper()}"
    
    # Calculate final EMI
    emi = calculate_emi(
        state.loan_amount or 0,
        state.tenure_months or 60,
        state.interest_rate
    )
    
    # Generate sanction letter PDF
    try:
        pdf_result = generate_sanction_pdf(state)
        state.sanction_pdf_path = pdf_result.get("file_path")
        pdf_generated = True
    except Exception as e:
        print(f"PDF generation error: {e}")
        pdf_generated = False
    
    # Build response
    customer_name = state.customer_name or "Valued Customer"
    loan_amount = state.loan_amount or 0
    tenure_months = state.tenure_months or 60
    
    reply = f"""🎉 **Congratulations, {customer_name}!**

Your loan has been **SANCTIONED**!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **Sanction Details**

**Application ID:** {state.application_id}

**Loan Amount:** ₹{loan_amount:,}
**Interest Rate:** {state.interest_rate}% p.a.
**Tenure:** {tenure_months} months
**Monthly EMI:** ₹{emi:,}

**Total Payable:** ₹{emi * tenure_months:,}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"""
    
    if pdf_generated:
        reply += f"""📄 **Sanction Letter Generated**
Your official sanction letter has been created and is ready for download.

"""
    
    reply += f"""📌 **Next Steps:**
1. Review and sign the loan agreement
2. Submit original documents for verification
3. Funds will be disbursed within 24-48 hours after verification

**Track Your Application:**
Use Application ID: **{state.application_id}** to track your loan status.

Thank you for choosing Tata Capital! 🙏

Need any other assistance? Feel free to ask!"""
    
    return reply, state
