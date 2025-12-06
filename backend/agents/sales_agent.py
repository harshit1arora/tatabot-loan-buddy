import re
from state import LoanState
from tools.get_offers import get_offers
from tools.calculate_emi import calculate_emi


def parse_indian_number(text: str) -> int:
    """Parse Indian number format like 2,00,000 or 200000 or 2 lakh."""
    text = text.lower().strip()
    
    # Handle lakh/lakhs format
    lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lac|lakhs|lacs)', text)
    if lakh_match:
        return int(float(lakh_match.group(1)) * 100000)
    
    # Handle crore format
    crore_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:crore|cr)', text)
    if crore_match:
        return int(float(crore_match.group(1)) * 10000000)
    
    # Handle plain numbers with or without commas
    number_match = re.search(r'[\d,]+', text)
    if number_match:
        return int(number_match.group().replace(',', ''))
    
    return 0


def extract_tenure(text: str) -> int:
    """Extract tenure in months from user message."""
    text = text.lower()
    
    # Look for year patterns
    year_match = re.search(r'(\d+)\s*(?:year|years|yr|yrs)', text)
    if year_match:
        return int(year_match.group(1)) * 12
    
    # Look for month patterns
    month_match = re.search(r'(\d+)\s*(?:month|months|mo)', text)
    if month_match:
        return int(month_match.group(1))
    
    return 0


def extract_customer_id(text: str) -> str:
    """Extract customer ID from user message."""
    # Look for patterns like CUST001, CUST-001, customer id: XXX
    patterns = [
        r'CUST[-_]?(\d+)',
        r'customer\s*(?:id|number)?[:\s]*([A-Z0-9]+)',
        r'id[:\s]*([A-Z0-9]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            cust_num = match.group(1)
            if cust_num.isdigit():
                return f"CUST{cust_num.zfill(3)}"
            return cust_num
    
    return ""


def handle_sales(user_message: str, state: LoanState) -> tuple[str, LoanState]:
    """
    Sales Agent: Handles initial conversation, loan inquiry, and offer presentation.
    
    Responsibilities:
    - Understand loan intent
    - Extract loan amount and tenure
    - Provide offers using get_offers() tool
    - Calculate and show EMI
    - Move to verification step when ready
    """
    message_lower = user_message.lower()
    
    # Try to extract customer ID if not already set
    if not state.customer_id:
        customer_id = extract_customer_id(user_message)
        if customer_id:
            state.customer_id = customer_id
        else:
            # Default customer for demo
            state.customer_id = "CUST001"
    
    # Get customer offers
    offers = get_offers(state.customer_id)
    if offers.get("customer_name"):
        state.customer_name = offers["customer_name"]
    if offers.get("pre_approved_limit"):
        state.pre_approved_limit = offers["pre_approved_limit"]
    
    # Check for loan-related keywords
    loan_keywords = ['loan', 'borrow', 'need money', 'finance', 'credit', 'emi', 'apply']
    is_loan_inquiry = any(keyword in message_lower for keyword in loan_keywords)
    
    # Try to extract loan amount
    if not state.loan_amount:
        amount = parse_indian_number(user_message)
        if amount > 0:
            state.loan_amount = amount
    
    # Try to extract tenure
    if not state.tenure_months:
        tenure = extract_tenure(user_message)
        if tenure > 0:
            state.tenure_months = tenure
    
    # Build response based on collected information
    customer_name = state.customer_name or "valued customer"
    
    # If we don't have amount or tenure, ask for them
    if not state.loan_amount or not state.tenure_months:
        if is_loan_inquiry or state.loan_amount:
            missing = []
            if not state.loan_amount:
                missing.append("loan amount")
            if not state.tenure_months:
                missing.append("preferred tenure (in months or years)")
            
            pre_approved_msg = ""
            if state.pre_approved_limit:
                pre_approved_msg = f"\n\n🎉 Great news! You have a pre-approved limit of ₹{state.pre_approved_limit:,}."
            
            reply = f"""Hello {customer_name}! I'd be happy to help you with a loan.{pre_approved_msg}

To provide you with the best offer, please share your:
- {' and '.join(missing)}

For example: "I need a loan of 5 lakhs for 3 years" """
            
            return reply, state
        else:
            # General greeting
            reply = f"""Welcome to Tata Capital, {customer_name}! 👋

I'm your AI loan assistant. I can help you with:
• Personal Loans
• Home Loans  
• Business Loans

How can I assist you today? Just tell me what you're looking for!"""
            return reply, state
    
    # We have both amount and tenure - calculate EMI and show offer
    emi = calculate_emi(state.loan_amount, state.tenure_months, state.interest_rate)
    
    # Check against pre-approved limit
    limit_message = ""
    if state.pre_approved_limit:
        if state.loan_amount <= state.pre_approved_limit:
            limit_message = "✅ Your requested amount is within your pre-approved limit!"
        elif state.loan_amount <= state.pre_approved_limit * 2:
            limit_message = "📋 Your requested amount exceeds your pre-approved limit but may be eligible with additional documentation."
        else:
            limit_message = "⚠️ Your requested amount significantly exceeds your pre-approved limit. Additional verification will be required."
    
    reply = f"""Thank you, {customer_name}! Here's your personalized loan offer:

📋 **Loan Details**
• Loan Amount: ₹{state.loan_amount:,}
• Tenure: {state.tenure_months} months ({state.tenure_months // 12} years {state.tenure_months % 12} months)
• Interest Rate: {state.interest_rate}% p.a.
• **Monthly EMI: ₹{emi:,}**

{limit_message}

Would you like to proceed with this loan application? I'll need to verify your KYC details next.

Reply with "Yes" or "Proceed" to continue."""
    
    # Check if user wants to proceed
    proceed_keywords = ['yes', 'proceed', 'continue', 'ok', 'okay', 'sure', 'go ahead', 'apply']
    if any(keyword in message_lower for keyword in proceed_keywords) and state.loan_amount and state.tenure_months:
        state.step = "verification"
        reply = f"""Excellent! Let's proceed with your loan application.

📋 **Application Summary**
• Customer: {customer_name}
• Loan Amount: ₹{state.loan_amount:,}
• Tenure: {state.tenure_months} months
• EMI: ₹{emi:,}/month

🔍 **Verification Step**
I'm now verifying your KYC details. Please wait a moment..."""
    
    return reply, state
