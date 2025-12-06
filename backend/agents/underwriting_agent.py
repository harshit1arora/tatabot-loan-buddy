from state import LoanState
from tools.get_credit_score import get_credit_score
from tools.get_offers import get_offers
from tools.calculate_emi import calculate_emi


def handle_underwriting(state: LoanState) -> tuple[str, LoanState]:
    """
    Underwriting Agent: Evaluates loan eligibility based on credit rules.
    
    Responsibilities:
    - Get credit score using get_credit_score() tool
    - Apply underwriting rules
    - Determine approval/rejection/conditional status
    - Move to sanction if approved
    
    Underwriting Rules:
    1. Credit score < 700 → Reject
    2. Loan amount > 2× pre-approved limit → Reject
    3. Loan amount ≤ pre-approved limit AND EMI ≤ 50% salary → Instant approve
    4. Pre-approved < loan ≤ 2× limit → Conditional (need salary slip)
       - If EMI ≤ 50% salary → Approve
       - Else → Reject
    """
    # Get credit score
    credit_score = get_credit_score(state.customer_id)
    state.credit_score = credit_score
    
    # Get offers for pre-approved limit
    offers = get_offers(state.customer_id)
    pre_approved_limit = offers.get("pre_approved_limit", 0)
    state.pre_approved_limit = pre_approved_limit
    
    # Calculate EMI
    loan_amount = state.loan_amount or 0
    tenure_months = state.tenure_months or 60
    emi = calculate_emi(loan_amount, tenure_months, state.interest_rate)
    
    # Get salary (from parsed slip or from customer data)
    monthly_salary = state.monthly_salary or offers.get("monthly_salary", 50000)
    state.monthly_salary = monthly_salary
    
    # Calculate EMI to salary ratio
    emi_ratio = (emi / monthly_salary * 100) if monthly_salary > 0 else 100
    
    # Build evaluation report
    report = f"""📊 **Credit Evaluation Report**

**Credit Score:** {credit_score}/900
**Pre-Approved Limit:** ₹{pre_approved_limit:,}
**Monthly Salary:** ₹{monthly_salary:,}
**Requested Amount:** ₹{loan_amount:,}
**Monthly EMI:** ₹{emi:,}
**EMI/Salary Ratio:** {emi_ratio:.1f}%

"""
    
    # Rule 1: Credit score check
    if credit_score < 700:
        state.underwriting_result = "rejected"
        reply = report + f"""❌ **Application Rejected**

**Reason:** Your credit score ({credit_score}) is below our minimum requirement of 700.

**Suggestions:**
• Review your credit report for any errors
• Pay off existing debts to improve your score
• Try again after 3-6 months of credit improvement

We appreciate your interest in Tata Capital. Please reach out to our customer support for more guidance."""
        return reply, state
    
    # Rule 2: Loan amount vs 2× pre-approved limit
    if loan_amount > pre_approved_limit * 2:
        state.underwriting_result = "rejected"
        reply = report + f"""❌ **Application Rejected**

**Reason:** Requested amount (₹{loan_amount:,}) exceeds 2× your pre-approved limit (₹{pre_approved_limit * 2:,}).

**Maximum Eligible Amount:** ₹{pre_approved_limit * 2:,}

**Options:**
• Apply for a lower amount within ₹{pre_approved_limit * 2:,}
• Provide additional income proof to increase eligibility
• Consider adding a co-applicant

Would you like to revise your loan amount?"""
        return reply, state
    
    # Rule 3: Within pre-approved limit AND good EMI ratio
    if loan_amount <= pre_approved_limit and emi_ratio <= 50:
        state.underwriting_result = "approved"
        state.step = "sanction"
        reply = report + f"""✅ **Instant Approval!**

Congratulations! Your loan has been **APPROVED** instantly!

**Approval Details:**
• ✅ Credit Score: Excellent ({credit_score})
• ✅ Within Pre-Approved Limit
• ✅ Affordable EMI ({emi_ratio:.1f}% of income)

Generating your sanction letter now..."""
        return reply, state
    
    # Rule 4: Between pre-approved and 2× limit - conditional approval
    if pre_approved_limit < loan_amount <= pre_approved_limit * 2:
        # Check if salary slip is parsed
        if not state.salary_slip_parsed:
            state.underwriting_result = "conditional"
            reply = report + f"""📋 **Conditional Approval - Documents Required**

Your loan amount exceeds your pre-approved limit but is within eligible range.

**Required:** Please upload your latest salary slip for income verification.

Once verified, we can proceed with final approval.

Use the upload feature to submit your salary slip."""
            return reply, state
        
        # Salary slip is parsed, check EMI ratio
        if emi_ratio <= 50:
            state.underwriting_result = "approved"
            state.step = "sanction"
            reply = report + f"""✅ **Approved After Verification!**

Your salary slip has been verified successfully.

**Verification Results:**
• ✅ Verified Salary: ₹{monthly_salary:,}
• ✅ EMI Affordable: {emi_ratio:.1f}% of income
• ✅ Credit Score: Good ({credit_score})

Your loan has been **APPROVED**! 

Generating your sanction letter now..."""
            return reply, state
        else:
            state.underwriting_result = "rejected"
            reply = report + f"""❌ **Application Rejected**

**Reason:** EMI-to-income ratio ({emi_ratio:.1f}%) exceeds our 50% threshold.

**Your EMI:** ₹{emi:,}
**Your Salary:** ₹{monthly_salary:,}
**Maximum Affordable EMI:** ₹{int(monthly_salary * 0.5):,}

**Options:**
• Reduce loan amount to lower EMI
• Increase tenure to reduce monthly payment
• Add a co-applicant to increase combined income

Would you like to modify your loan terms?"""
            return reply, state
    
    # Default case: approve if within limit
    if emi_ratio <= 50:
        state.underwriting_result = "approved"
        state.step = "sanction"
        reply = report + f"""✅ **Loan Approved!**

Your loan application has been approved based on your credit profile.

Proceeding to generate sanction letter..."""
    else:
        state.underwriting_result = "rejected"
        reply = report + f"""❌ **Application Rejected**

EMI amount exceeds 50% of your monthly income.
Please consider a lower loan amount or longer tenure."""
    
    return reply, state
