def calculate_emi(principal: int, tenure_months: int, annual_interest_rate: float = 14.0) -> int:
    """
    Calculate EMI (Equated Monthly Installment) for a loan.
    
    Uses the standard EMI formula:
    EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    
    Where:
    - P = Principal loan amount
    - r = Monthly interest rate (annual rate / 12 / 100)
    - n = Number of monthly installments (tenure)
    
    Args:
        principal: Loan amount in rupees
        tenure_months: Loan tenure in months
        annual_interest_rate: Annual interest rate in percentage (default 14%)
        
    Returns:
        Monthly EMI amount (rounded to nearest integer)
    """
    if principal <= 0 or tenure_months <= 0:
        return 0
    
    # Convert annual rate to monthly rate
    monthly_rate = annual_interest_rate / 12 / 100
    
    # Handle zero interest rate case
    if monthly_rate == 0:
        return int(principal / tenure_months)
    
    # Calculate EMI using the formula
    # EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    power_term = (1 + monthly_rate) ** tenure_months
    emi = principal * monthly_rate * power_term / (power_term - 1)
    
    return int(round(emi))
