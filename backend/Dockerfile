FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=wsgi.py
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run the application with Gunicorn
CMD exec gunicorn --bind 0.0.0.0:8080 \
    --workers 3 \
    --threads 8 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    wsgi:application