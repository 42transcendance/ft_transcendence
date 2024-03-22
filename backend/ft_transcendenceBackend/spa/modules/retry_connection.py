from django.db import OperationalError
import time

def connect_to_database():
    while True:
        try:
            # Attempt to connect to the database
            from django.db import connection
            connection.ensure_connection()
            break  # If connection succeeds, break out of the loop
        except OperationalError as e:
            # If connection fails due to "the database system is starting up",
            # retry after a brief delay
            print("Database is starting up. Retrying in 1 second...")
            time.sleep(1)

# Call the function to connect to the database
connect_to_database()