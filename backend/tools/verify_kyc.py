from tools.mcp_client import mcp_client


def verify_kyc(customer_id: str) -> dict:
    """
    Verify KYC for a customer.
    
    Args:
        customer_id: The customer's unique identifier
        
    Returns:
        dict with:
        - status: "pass" or "fail"
        - customer: Customer data if verified, None otherwise
    """
    return mcp_client.verify_kyc(customer_id)
