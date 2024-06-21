from flask_restful import Api
from .controllers.user_controller import UpdateUserFavoriteBusinesses, UpdateUserMetadata, GetUserMetadata
from .controllers.business_controller import SearchBusiness, SummarizeBusiness, BusinessCategories
from .controllers.location_controller import States, Cities, Locations

def initialize_routes(api):
    api.add_resource(GetUserMetadata, '/user/metadata')
    api.add_resource(UpdateUserFavoriteBusinesses, '/user/metadata/businesses')

    api.add_resource(SearchBusiness, '/business/search')
    api.add_resource(SummarizeBusiness, '/business/summarize')
    api.add_resource(BusinessCategories, '/business/categories')

    api.add_resource(States, '/location/states')
    api.add_resource(Cities, '/location/cities')
    api.add_resource(Locations, '/location/locations')

