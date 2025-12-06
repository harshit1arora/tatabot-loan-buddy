from tools.mcp_client import mcp_client


def get_offers(customer_id: str) -> dict:
    """
    Get pre-approved offers for a customer.
    
    Args:
        customer_id: The customer's unique identifier
        
    Returns:
        dict with offer details:
        - pre_approved_limit: Maximum pre-approved loan amount
        - interest_rate: Offered interest rate
        - products: List of available products
        - customer_name: Customer's name
        - monthly_salary: Customer's monthly salary (if available)
    """
    offer = mcp_client.get_offer(customer_id)
    customer = mcp_client.get_customer(customer_id)
    
    if offer:
        result = {
            "pre_approved_limit": offer.get("pre_approved_limit", 0),
            "interest_rate": offer.get("interest_rate", 14.0),
            "products": offer.get("products", ["Personal Loan"]),
            "customer_name": customer.get("name") if customer else None,
            "monthly_salary": customer.get("monthly_salary") if customer else None
        }
        return result
    
    # Default offer for unknown customers
    return {
        "pre_approved_limit": 100000,
        "interest_rate": 14.0,
        "products": ["Personal Loan"],
        "customer_name": customer.get("name") if customer else None,
        "monthly_salary": customer.get("monthly_salary") if customer else 50000
    }
