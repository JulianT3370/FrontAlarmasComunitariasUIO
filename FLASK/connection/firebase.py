import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIAL"))
firebase_admin.initialize_app(cred)
db = firestore.client()

