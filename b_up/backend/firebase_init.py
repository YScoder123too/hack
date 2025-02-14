import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the service account key JSON file
cred = credentials.Certificate('../serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore database
db = firestore.client()