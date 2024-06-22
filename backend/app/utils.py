import re
import os
from groq import Groq
import http.client
import json


client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

testing_with_api = False

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def get_summary(business, reviews, dietary_restrictions=None):
    print(dietary_restrictions)
    summary = "Testing without api currently"
    if testing_with_api:
        user_prompt = f"Look for information regarding these dietary restrictions: {dietary_restrictions}. " if dietary_restrictions else ""
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            temperature=0.5,
            messages=[
                {"role": "user", "content": f"{user_prompt} Provide a concise and readable summary that highlights the most important or repeated aspects of the following reviews for {business.name}: {reviews}. Give only the summary, no other dialogue. Paragraph no bullets. Do not say anything: here is a ___ just go straight to the point. If it is a food-related place list the most-liked items. Speficially mention the dietary restrictions provided."}
            ]
        )
        summary = response.choices[0].message.content
    return summary


def get_management_api_token():
    conn = http.client.HTTPSConnection(os.getenv('AUTH0_DOMAIN'))
    payload = json.dumps({
        "client_id": os.getenv('AUTH0_CLIENT_ID'),
        "client_secret": os.getenv('AUTH0_CLIENT_SECRET'),
        "audience": os.getenv('AUTH0_API_AUDIENCE'),
        "grant_type": "client_credentials"
    })

    headers = {'content-type': "application/json"}

    conn.request("POST", "/oauth/token", payload, headers)

    res = conn.getresponse()
    data = res.read()
    print("data is this: ", data)
    token_info = json.loads(data.decode("utf-8"))
    return token_info['access_token']

def get_user_metadata(user_id, token):
    conn = http.client.HTTPSConnection(os.getenv('AUTH0_DOMAIN'))
    headers = {
        'content-type': "application/json",
        'Authorization': f"Bearer {token}"
    }
    conn.request("GET", f"/api/v2/users/{user_id}", headers=headers)

    res = conn.getresponse()
    data = res.read()
    user_info = json.loads(data.decode("utf-8"))
    return user_info.get('user_metadata', {})
