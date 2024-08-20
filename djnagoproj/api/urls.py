from django.urls import path
from . import views

from .views import flight_searchView,FlightView,flight_seatView,seatView,BookingView,CustomUserCreate,CancelView,PaymentSuccessfulView,MybookingView,RemoveflightView,EditView,ProfitView,GettypeView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView,CustomLogoutView,WalletView,OccupancyView,preferenceView,modifyView



urlpatterns = [ 
    path('logout/',CustomLogoutView.as_view(),name='logout'),
    path('register/', CustomUserCreate.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'), 
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    # path('login/', StudentView.as_view()), 
    path('search/', flight_searchView.as_view()),  
    path('flight/', FlightView.as_view()),  
    path('f_seat/', flight_seatView.as_view()),  
    path('seat/', seatView.as_view()),  
    path('book/', BookingView.as_view()),   
    path('cancel/',CancelView.as_view()),
    path('successful/',PaymentSuccessfulView.as_view()),
    path('booking/',MybookingView.as_view()),
    path('remove/',RemoveflightView.as_view()),
    path('edit/',EditView.as_view()),
    path('profit/',ProfitView.as_view()),
    path('addflight/',GettypeView.as_view()),
    path('wallet/',WalletView.as_view()),
    path('check/',OccupancyView.as_view()),
    path('preference/',preferenceView.as_view()),
    path('modify/',modifyView.as_view())
]  