from state import LoanState
from tools.verify_kyc import verify_kyc


def handle_verification(state: LoanState) -> tuple[str, LoanState]:
    """
    Verification Agent: Handles KYC verification.
    
    Responsibilities:
    - Verify customer KYC using verify_kyc() tool
    - Update verification status
    - Move to underwriting if verified
    - Ask for correct details if verification fails
    """
    if not state.customer_id:
        reply = """❌ No customer ID found in your profile.

Please provide your Customer ID or PAN number for verification.
Example: "My customer ID is CUST001" """
        return reply, state
    
    # Perform KYC verification
    kyc_result = verify_kyc(state.customer_id)
    
    if kyc_result["status"] == "pass":
        customer = kyc_result["customer"]
        state.verification_passed = True
        state.customer_name = customer.get("name", state.customer_name)
        state.step = "underwriting"
        
        reply = f"""✅ **KYC Verification Successful!**

**Verified Details:**
• Name: {customer.get('name', 'N/A')}
• PAN: {customer.get('pan', 'N/A')}
• Email: {customer.get('email', 'N/A')}
• Phone: {customer.get('phone', 'N/A')}

Your identity has been verified. Now proceeding to credit evaluation...

🔍 **Credit Assessment in Progress**
Please wait while I check your credit score and eligibility."""
        
    else:
        state.verification_passed = False
        
        reply = f"""❌ **KYC Verification Failed**

We could not verify your details with Customer ID: {state.customer_id}

Possible reasons:
• Incorrect Customer ID
• Profile not found in our system
• Mismatched PAN/Aadhaar details

Please provide the correct Customer ID or contact our support team.

You can also try with a different ID: "My ID is CUST002" """
    
    return reply, state
