from firebase_init import db
from firebase_admin import firestore  # Add this line if you use Firestore-specific features

# Write data to Firestore
def write_test_data():
    doc_ref = db.collection('test').document('test_doc')
    doc_ref.set({
        'message': 'Hello, Firebase!',
        'timestamp': firestore.SERVER_TIMESTAMP  # Requires the firestore import
    })
    print("Data written to Firestore.")

# Read data from Firestore
def read_test_data():
    doc_ref = db.collection('test').document('test_doc')
    doc = doc_ref.get()
    if doc.exists:
        print(f"Data from Firestore: {doc.to_dict()}")
    else:
        print("No such document!")

if __name__ == '__main__':
    write_test_data()
    read_test_data()