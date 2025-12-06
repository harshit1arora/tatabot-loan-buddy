from state import LoanState
from agents.sales_agent import handle_sales
from agents.verification_agent import handle_verification
from agents.underwriting_agent import handle_underwriting
from agents.sanction_agent import handle_sanction


def run_master_agent(user_message: str, state: LoanState) -> dict:
    """
    Master Orchestrator Agent.
    Routes the request to the correct worker agent based on state.step.
    
    Returns:
        dict with fields:
        - reply: string (message to show to user)
        - updated_state: LoanState
    """
    current_step = state.step
    
    # Route to appropriate worker agent
    if current_step == "conversation":
        reply, updated_state = handle_sales(user_message, state)
    
    elif current_step == "verification":
        reply, updated_state = handle_verification(state)
    
    elif current_step == "underwriting":
        reply, updated_state = handle_underwriting(state)
    
    elif current_step == "sanction":
        reply, updated_state = handle_sanction(state)
    
    else:
        # Fallback to sales agent for unknown steps
        reply, updated_state = handle_sales(user_message, state)
    
    return {
        "reply": reply,
        "updated_state": updated_state
    }
