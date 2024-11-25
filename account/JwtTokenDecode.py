import jwt
from django.conf import settings

secret_key = settings.SECRET_KEY
def decode_jwt(token):
    try:
        decoded_token = jwt.decode(token, secret_key, algorithms=["HS256"])
        print("Decoded JWT:", decoded_token)
        return decoded_token
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return "Token has Expired"
    except jwt.InvalidTokenError:
        print("Invalid token")
        return "Invalid Token"
