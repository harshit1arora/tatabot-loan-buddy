import json
import os
from typing import Optional

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")


class MCPClient:
    """
    MCP-style client for accessing customer and offer data.
    Loads data from JSON files and provides helper methods.
    """
    
    _instance = None
    _customers = None
    _offers = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_data()
        return cls._instance
    
    def _load_data(self):
        """Load data from JSON files."""
        # Load customers
        customers_path = os.path.join(DATA_DIR, "customers.json")
        try:
            with open(customers_path, "r") as f:
                data = json.load(f)
                self._customers = {c["customer_id"]: c for c in data.get("customers", [])}
        except FileNotFoundError:
            print(f"Warning: {customers_path} not found. Using empty data.")
            self._customers = {}
        except json.JSONDecodeError as e:
            print(f"Error parsing customers.json: {e}")
            self._customers = {}
        
        # Load offers
        offers_path = os.path.join(DATA_DIR, "offers.json")
        try:
            with open(offers_path, "r") as f:
                data = json.load(f)
                self._offers = {o["customer_id"]: o for o in data.get("offers", [])}
        except FileNotFoundError:
            print(f"Warning: {offers_path} not found. Using empty data.")
            self._offers = {}
        except json.JSONDecodeError as e:
            print(f"Error parsing offers.json: {e}")
            self._offers = {}
    
    def get_customer(self, customer_id: str) -> Optional[dict]:
        """Get customer data by ID."""
        return self._customers.get(customer_id)
    
    def get_offer(self, customer_id: str) -> Optional[dict]:
        """Get offer data by customer ID."""
        return self._offers.get(customer_id)
    
    def get_credit_score(self, customer_id: str) -> int:
        """Get credit score for a customer."""
        customer = self.get_customer(customer_id)
        if customer:
            return customer.get("credit_score", 650)
        return 650  # Default score
    
    def verify_kyc(self, customer_id: str) -> dict:
        """Verify KYC for a customer."""
        customer = self.get_customer(customer_id)
        if customer and customer.get("kyc_verified", False):
            return {
                "status": "pass",
                "customer": customer
            }
        elif customer:
            return {
                "status": "pass",  # For demo, pass if customer exists
                "customer": customer
            }
        return {
            "status": "fail",
            "customer": None
        }
    
    def reload_data(self):
        """Reload data from JSON files."""
        self._load_data()


# Singleton instance
mcp_client = MCPClient()
