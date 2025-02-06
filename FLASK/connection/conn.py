import os
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.getenv("HOST_NAME"),
    "user": os.getenv("USER_NAME"),
    # "password": "tu_contraseña",
    "database": os.getenv("DB_NAME")
}