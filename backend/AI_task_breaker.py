import os
from google import genai
from dotenv import load_dotenv

# 1 Load the variables from your .env file
load_dotenv()

# 2. Initialize the client. 
# It will look for GOOGLE_API_KEY in your .env file.
# If your .env uses a different name, use: api_key=os.getenv("YOUR_NAME")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_subtasks(goal, prescription_info="Needs high-stimulation, 10-15 min bursts"):
    # Using gemini-2.0-flash for speed/hackathon efficiency
    model_id = "gemini-2.5-flash" 
    
    prompt = f"""
    Role: You are an ADHD Productivity Coach.
    User Profile: {prescription_info}
    Goal: {goal}
    
    Task: Break this goal into no more than 5 tiny, specific sub-steps. Assign a realistic time estimate for each step (e.g., 10-15 minutes). 
    Assign awarding points to each step based on the level of difficulty and dopamine reward (e.g., 10 points for a simple task, 50 points for a more challenging one), maximum points is 100.
    ADHD users struggle with 'Executive Dysfunction,' so make the first step extremely easy (e.g., 'Stand up and walk to the kitchen').
    
    Format:
    - Step 1: [Task Name] (Time)
    - Step 2: [Task Name] (Time)
    """

    try:
        # Note: The new SDK uses client.models.generate_content
        response = client.models.generate_content(
            model=model_id,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error connecting to Gemini: {e}"

# --------- testing code ---------
if __name__ == "__main__":
    test_goal = "Clean my chaotic kitchen"
    test_prescription = "User is on 20mg Adderall; needs high-dopamine, very short bursts of activity."

    print("--- 🚀 Testing AI Task Breakdown ---")
    
    # Check if API Key is actually loaded
    if not os.getenv("GEMINI_API_KEY"):
        print("❌ Error: GEMINI_API_KEY not found in .env file!")
    else:
        result = generate_subtasks(test_goal, test_prescription)
        print(f"Goal: {test_goal}")
        print("-" * 30)
        print(result)
        print("-" * 30)