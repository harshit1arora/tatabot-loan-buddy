import random


def extract_salary_slip(file_path: str) -> dict:
    """
    Extract salary information from an uploaded salary slip.
    
    This is a mock implementation that returns dummy data.
    In production, this would use OCR or document parsing.
    
    Args:
        file_path: Path to the uploaded salary slip file
        
    Returns:
        dict with extracted salary details:
        - monthly_salary: Gross monthly salary
        - net_salary: Net take-home salary
        - employer: Employer name
        - designation: Employee designation
    """
    # Mock salary data - in production, this would use OCR/AI extraction
    # Randomize slightly for demo variety
    base_salary = random.choice([50000, 65000, 75000, 85000, 100000, 120000])
    
    return {
        "monthly_salary": base_salary,
        "net_salary": int(base_salary * 0.85),  # ~15% deductions
        "employer": "Tech Solutions Pvt Ltd",
        "designation": "Senior Software Engineer",
        "extracted_from": file_path,
        "extraction_confidence": 0.95
    }
