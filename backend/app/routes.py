from flask_restful import Api
from .controllers.user_controller import AddUserFavoriteBusiness, DeleteUserFavoriteBusiness, GetUserMetadata, AddUserDietaryRestriction, DeleteUserDietaryRestriction
from .controllers.business_controller import SearchBusiness, SummarizeBusiness, BusinessCategories
from .controllers.location_controller import States, Cities, Locations

def initialize_routes(api):
    api.add_resource(GetUserMetadata, '/user/metadata')
    api.add_resource(AddUserFavoriteBusiness, '/user/metadata/businesses/add')
    api.add_resource(DeleteUserFavoriteBusiness, '/user/metadata/businesses/delete')
    api.add_resource(AddUserDietaryRestriction, '/user/metadata/diet/add')
    api.add_resource(DeleteUserDietaryRestriction, '/user/metadata/diet/delete')

    api.add_resource(SearchBusiness, '/business/search')
    api.add_resource(SummarizeBusiness, '/business/summarize')
    api.add_resource(BusinessCategories, '/business/categories')

    api.add_resource(States, '/location/states')
    api.add_resource(Cities, '/location/cities')
    api.add_resource(Locations, '/location/locations')

