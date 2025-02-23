import os
import json
import base64
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
from datetime import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash')

class Message(BaseModel):
    content: str
    role: str

class UserProfile(BaseModel):
    verbal_score: float
    non_verbal_score: float
    self_assessment: float
    age: int

PLANNING_AGENT_PROMPT = """
ROLE:
You are the "Planing Agent." Your primary function is to identify a user's logical or conceptual mistakes and create a structured plan to address these issues. You will analyze the user's thought process, pinpoint where they are going wrong, and propose a roadmap to guide them toward a correct understanding or solution.

OBJECTIVES:

1. Mistake Identification:
* Listen for incorrect assumptions, flawed reasoning or what can be improved in the user's responses.
* Break down these mistakes into clear, identifiable patterns (e.g., misunderstanding a definition, skipping a critical step).

2. Roadmap Creation:
* Based on the identified mistakes or what can be improved, outline a prioritized to-do list or sequence of steps.
* Each step should move the user closer to the correct approach or deeper understanding of the topic.
* Provide rationale for each step, explaining why it is important and how it addresses the user's mistakes.

3. Communication & Handover:
* Once the plan is formed, pass the details of the identified mistakes and the propose a roadmap.
* Ensure that your summary of mistakes is concise but thorough to generate a report.

GUIDELINES:
* Use clear, structured language (e.g., bullet points, short paragraphs).
* Focus on constructive guidance rather than just pointing out errors.
* If new information emerges from the user, be ready to refine the roadmap.
* Maintain a supportive and instructional tone.

USER QUERY: {user_query}
"""

ANALYSIS_AGENT_PROMPT = """
ROLE:
You are the "Analysis Agent" You are professional analyzer that takes the mistake analysis and roadmap from the relevant information that I will give it to you, then produce a comprehensive report that detects the user's shortcomings when user approaches a problem/tries to understands a question or a concept and recommends further action. Gather previously recorded information of the user and tailor your response according to the user.

OBJECTIVES:

1. Comprehensive Report Generation:
* Receive the list of mistakes and the proposed plan from the information I gave it to you.
* Recognize patterns, repetitive conceptual errors, errors caused by carelessness.   
* Also recognize the "near-success" attempts what lead the user to "near-success".
* Provide insights into how these mistakes affect the user's overall understanding or progress.

2. Feedback & Recommendations:
* Suggest additional examples, practice tasks, or alternative explanations that might help the user correct their mistakes.
* If the user's mistakes are recurring, highlight patterns or deeper misconceptions.
* Recommend whether the user should revisit earlier steps, explore prerequisite topics, or attempt new exercises.

GUIDELINES:
* Focus on clarity and usefulness: the report should be actionable for the user.
* Maintain a factual, yet empathetic tone—acknowledge the user's effort while guiding them forward.
* Use structured, long language (lists, detailed paragraphs) for readability.
* Thinking Steps That you need to do in order to understand fully:
* Questions that you need to think about when you want to understand this fully:

Always add Additional Related Question in the end of the report:

PLANNING AGENT OUTPUT: {planning_output}
USER QUERY: {user_query}
"""


async def process_image(image_data: bytes) -> str:
    """Process the uploaded image data into a base64 string"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(BytesIO(image_data))
        
        # Ensure the image is in RGB mode
        if image.mode != 'RGB':
            image = image.convert('RGB')
            
        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return img_str
    except Exception as e:
        raise ValueError(f"Failed to process image: {str(e)}")

async def get_vision_response(image_base64: str, query: str) -> str:
    """Get response from Gemini for image analysis"""
    try:
        # Decode base64 string back to bytes
        image_bytes = base64.b64decode(image_base64)
        
        # Create a Part object for the image
        image_part = {
            "mime_type": "image/jpeg",
            "data": image_bytes
        }
        
        # Create the prompt parts combining image and text
        prompt_parts = [
            image_part,
            query
        ]
        
        # Use generate_content with both image and text
        response = await model.generate_content_async(prompt_parts)
        return response.text
    except Exception as e:
        raise Exception(f"Failed to get vision response: {str(e)}")

async def get_chat_response(
    user_query: str,
    user_profile: Optional[UserProfile] = None,
    image_data: bytes = None
) -> str:
    """
    Process user query and return the response
    If image_data is provided, includes image analysis in the response
    """
    try:
        # If image is provided, get vision analysis first
        vision_analysis = ""
        if image_data:
            try:
                image_base64 = await process_image(image_data)
                vision_analysis = await get_vision_response(image_base64, user_query)
                # Combine vision analysis with user query
                user_query = f"{user_query}\n\nImage Analysis: {vision_analysis}"
            except Exception as e:
                print(f"Warning: Failed to process image: {str(e)}")
        
        # Generate response using Gemini
        planning_analysis = await model.generate_content_async(PLANNING_AGENT_PROMPT.format(user_query=user_query))
        final_analysis = await model.generate_content_async(ANALYSIS_AGENT_PROMPT.format(planning_output=planning_analysis, user_query=user_query))

        # Determine response style based on user profile
        response_style = ""
        if user_profile:
            if user_profile.verbal_score > user_profile.non_verbal_score:
                response_style = """
                Focus on providing detailed text explanations and story-based examples.
                Break down concepts into clear, sequential steps.
                Use analogies and metaphors to explain complex ideas.
                Provide written examples and scenarios.
                """
            elif user_profile.non_verbal_score > user_profile.verbal_score:
                response_style = """
                Focus on interactive scaffolding and visual descriptions.
                Use step-by-step guidance with clear checkpoints.
                Incorporate spatial and pattern-based explanations.
                Break complex tasks into smaller, manageable parts.
                """
            else:
                response_style = """
                Provide a balanced approach with both verbal and visual explanations.
                Use concise explanations with supporting examples.
                Combine text-based and pattern-based learning strategies.
                """

            # Add confidence level consideration
            confidence_guidance = f"""
            The user's self-assessment score is {user_profile.self_assessment}/10, indicating {'high' if user_profile.self_assessment > 7 else 'moderate' if user_profile.self_assessment > 4 else 'low'} confidence in non-verbal skills.
            {'Provide additional encouragement and positive reinforcement.' if user_profile.self_assessment < 5 else 'Maintain supportive but direct communication.'}
            """

        prompt = f"""
        You are a helpful AI assistant for helping students who has a disability called non-verbal learning to understand the concepts, understand ideas and solve the problems. Please provide a clear response to the following query:

        User Profile Information:
        {f'Age: {user_profile.age}' if user_profile else 'Age: Unknown'}
        {f'Verbal Score: {user_profile.verbal_score}/2' if user_profile else ''}
        {f'Non-verbal Score: {user_profile.non_verbal_score}/2' if user_profile else ''}
        {f'Self-assessment Score: {user_profile.self_assessment}/10' if user_profile else ''}

        Response Style Guidelines:
        {response_style if user_profile else 'Provide a balanced approach to explanation.'}
        {confidence_guidance if user_profile else ''}

        User Query: {user_query}
        Final Analysis: {final_analysis}
        {f'Vision Analysis: {vision_analysis}' if image_data else ''}
        
        Please provide a helpful and informative response that matches the user's learning profile and needs.
        """
        response = await model.generate_content_async(prompt)
        return response.text
        
    except Exception as e:
        raise Exception(f"Failed to get chat response: {str(e)}") 