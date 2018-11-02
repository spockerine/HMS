import sys
from pymongo import MongoClient
from cryptography.fernet import Fernet

key = b'5HFFdBeSChtl1oWaEWwDhTi5Cr7s4LohO5W2zIngmHU='
cipher_suite = Fernet(key)

client = MongoClient('localhost', 27017)
db = client['hms']

if(len(sys.argv) < 3):
    print("provide username and password as command line arguments!!")
    exit(0)

username = sys.argv[1]
password = sys.argv[2]
cipher_suite = Fernet(key)
ciphered_text = cipher_suite.encrypt(password.encode())   #required to be bytes

toInsert = {"_id": username, "password": ciphered_text, "flag": 3}

collection = db["users"]
collection.insert_one(toInsert)

print("ciphered_text: ", ciphered_text)