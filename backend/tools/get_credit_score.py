from tools.mcp_client import mcp_client


def get_credit_score(customer_id: str) -> int:
    """
    Get credit score for a customer.
    
    Args:
        customer_id: The customer's unique identifier
        
    Returns:
        Credit score (int between 300-900)
        Returns 650 as default if customer not found
    """
    return mcp_client.get_credit_score(customer_id)
