import os
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from the environment
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI LLM
llm = OpenAI(api_key=openai_api_key, temperature=0.7)

# Define a prompt template for mental health queries
prompt_template = PromptTemplate(
    input_variables=["input"],
    template="""
    You are a mental health consultant. Respond only to queries related to mental health.
    If the query is unrelated, say 'I'm here to help with mental health concerns. Can you share more about how you’re feeling?'
    User input: {input}
    """
)

# Create a RunnableSequence pipeline
pipeline = prompt_template | llm

# Function to generate AI response
def generate_response(user_input):
    return pipeline.invoke({"input": user_input})