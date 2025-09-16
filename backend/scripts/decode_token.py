import jwt

# The token from the logs
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU2MDU5Njk1LCJpYXQiOjE3NTU5NzMyOTV9.KZRRxBi3h2onS_Sw74MsXlFvUD-nup_J6kWbT_EuP2k"

# Django secret key
secret_key = "django-insecure-v4^5r9*1@(ve&mzplhxqpzavcj=yn&!xo7d_)p@84z0=y46b$6"

try:
    decoded = jwt.decode(token, secret_key, algorithms=["HS256"])
    print("Token decoded successfully!")
    print("Payload:", decoded)

    # Check if token is expired
    import time

    current_time = int(time.time())
    exp_time = decoded.get("exp", 0)

    print(f"Current time: {current_time}")
    print(f"Expiration time: {exp_time}")
    print(f"Token expired: {current_time > exp_time}")

except Exception as e:
    print(f"Error decoding token: {e}")
