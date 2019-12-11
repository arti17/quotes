from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework import routers

from api.views import LogoutView, QuoteViewSet, AddRatingView, SubRatingView

router = routers.DefaultRouter()
router.register(r'quotes', QuoteViewSet, base_name='Quote')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
    path('quotes/<int:pk>/add/', AddRatingView.as_view(), name='add'),
    path('quotes/<int:pk>/sub/', SubRatingView.as_view(), name='sub'),
    path('login/', obtain_auth_token, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
