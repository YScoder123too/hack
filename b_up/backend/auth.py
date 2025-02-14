from firebase_admin import auth, firestore
from firebase_init import db  # Import Firestore database

def signup_user(email, password):
    try:
        # Create a new user in Firebase Authentication
        user = auth.create_user(email=email, password=password)

        # Store user data in Firestore
        db.collection('users').document(user.uid).set({
            "email": email,
            "created_at": firestore.SERVER_TIMESTAMP
        })

        return {"message": "User created successfully", "uid": user.uid}
    except Exception as e:
        return {"error": f"Failed to create user: {str(e)}"}  # Include error details

def login_user(email, password):
    try:
        # Retrieve user by email
        user = auth.get_user_by_email(email)
        return {"message": "User logged in successfully", "uid": user.uid}
    except Exception as e:
        return {"error": f"Invalid email or password: {str(e)}"}  # Include error details
