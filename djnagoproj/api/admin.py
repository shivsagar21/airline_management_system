from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(CustomUser)  
admin.site.register(flight)  
admin.site.register(flight_search)  
admin.site.register(flight_seat)  
admin.site.register(seat)
admin.site.register(Booking)     
