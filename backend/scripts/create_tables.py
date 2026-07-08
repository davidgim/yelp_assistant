import psycopg2
from psycopg2 import sql

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

conn = psycopg2.connect(**db_params)
cursor = conn.cursor()

cursor.execute("""
SELECT DISTINCT state, city
FROM businesses
WHERE state IS NOT NULL AND city IS NOT NULL;
""")

unique_locations = cursor.fetchall()

print(unique_locations)

insert_query = sql.SQL("""
INSERT INTO locations (state, city)
VALUES (%s, %s)
ON CONFLICT (state, city) DO NOTHING;
""")

for location in unique_locations:
    cursor.execute(insert_query, location)


conn.commit()


cursor.close()
conn.close()

print("Locations table has been populated with unique state and city pairs.")
