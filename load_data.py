import ast
import json
import psycopg2
import logging
from psycopg2.extras import execute_values

logging.basicConfig(level=logging.INFO)

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432'
}

conn = psycopg2.connect(**db_params)
cursor = conn.cursor()


def preprocess_business(biz):
    # Ensure state is a two-character string
    state = biz['state'][:2] if len(biz['state']) > 2 else biz['state']
    
    categories = biz.get('categories', '').split(', ') if biz.get('categories') else []
    hours = json.dumps(biz.get('hours', {})) if biz.get('hours') is not None else json.dumps({})
    return (
        biz['business_id'],
        biz['name'],
        biz['address'],
        biz['city'],
        state,
        biz['postal_code'],
        biz['latitude'],
        biz['longitude'],
        biz['stars'],
        biz['review_count'],
        biz['is_open'],
        categories,
        hours
    )

def load_businesses(data):
    with open(data, 'r', encoding='utf-8') as f:
        businesses = [json.loads(line) for line in f]

    business_data = []
    for idx, biz in enumerate(businesses):
        try:
            business_data.append(preprocess_business(biz))
        except Exception as e:
            logging.error(f"Error processing record {idx + 1}: {biz}")
            logging.error(f"Exception: {e}")

    query = """INSERT INTO businesses (business_id, name, address, city, state, postal_code, latitude, longitude, stars, review_count, is_open, categories, hours)
    VALUES %s
    ON CONFLICT (business_id) DO NOTHING"""

    try:
        execute_values(cursor, query, business_data)
        conn.commit()
    except Exception as e:
        logging.error(f"Error inserting data: {e}")
        conn.rollback()


def load_reviews(data):
    with open(data, 'r', encoding='utf-8') as f:
        reviews = [json.loads(line) for line in f]

    batch_size = 1000
    total_reviews = len(reviews)
    logging.info(f"Total reviews to process: {total_reviews}")

    for i in range(0, total_reviews, batch_size):
        batch = reviews[i:i + batch_size]
        review_data = [(
            review['review_id'],
            review['user_id'],
            review['business_id'],
            review['stars'],
            review['date'],
            review['text'],
            review['useful'],
            review['funny'],
            review['cool']
        ) for review in batch]

        query = """
        INSERT INTO reviews (review_id, user_id, business_id, stars, date, text, useful, funny, cool)
        VALUES %s
        ON CONFLICT (review_id) DO NOTHING
        """
        try:
            execute_values(cursor, query, review_data)
            conn.commit()
        except Exception as e:
            logging.error(f"Error inserting data: {e}")
            conn.rollback()

        logging.info(f"Processed {i + len(batch)} / {total_reviews} reviews")

def load_tips(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        tips = [json.loads(line) for line in f]

    batch_size = 1000
    total_tips = len(tips)
    logging.info(f"Total tips to process: {total_tips}")

    for i in range(0, total_tips, batch_size):
        batch = tips[i:i + batch_size]
        tip_data = [(
            tip['text'],
            tip['date'],
            tip['compliment_count'],
            tip['business_id'],
            tip['user_id']
        ) for tip in batch]

        query = """
        INSERT INTO tips (text, date, compliment_count, business_id, user_id)
        VALUES %s
        """
        try:
            execute_values(cursor, query, tip_data)
            conn.commit()
        except Exception as e:
            logging.error(f"Error inserting data: {e}")
            conn.rollback()

        logging.info(f"Processed {i + len(batch)} / {total_tips} tips")

#load_businesses('./dataset/yelp_academic_dataset_business.json')
#load_reviews('./dataset/yelp_academic_dataset_review.json')
load_tips('./dataset/yelp_academic_dataset_tip.json')

cursor.close()
conn.close()