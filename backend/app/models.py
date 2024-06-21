from . import db

class Business(db.Model):
    __tablename__ = 'businesses'
    business_id = db.Column(db.String(22), primary_key=True)
    name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
    postal_code = db.Column(db.String(10))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    stars = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    is_open = db.Column(db.Integer)
    categories = db.Column(db.ARRAY(db.String))
    hours = db.Column(db.JSON)

    def serialize(self):
        return {
            'business_id': self.business_id,
            'name': self.name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'stars': self.stars,
            'review_count': self.review_count,
            'is_open': self.is_open,
            'categories': self.categories,
            'hours': self.hours,
        }

class Review(db.Model):
    __tablename__ = 'reviews'  # Explicitly setting the table name
    review_id = db.Column(db.String(22), primary_key=True)
    user_id = db.Column(db.String(22), nullable=False)
    business_id = db.Column(db.String(22), db.ForeignKey('businesses.business_id'), nullable=False)  # Updated to match the table name
    stars = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    text = db.Column(db.Text, nullable=False)
    useful = db.Column(db.Integer)
    funny = db.Column(db.Integer)
    cool = db.Column(db.Integer)

    def serialize(self):
        return {
            'review_id': self.review_id,
            'user_id': self.user_id,
            'business_id': self.business_id,
            'stars': self.stars,
            'date': self.date.isoformat(),
            'text': self.text,
            'useful': self.useful,
            'funny': self.funny,
            'cool': self.cool,
        }
    
class Location(db.Model):
    __tablename__ = 'locations'
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(2), nullable=False)
    city = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'state': self.state,
            'city': self.city
        }
    
