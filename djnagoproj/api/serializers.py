from rest_framework import serializers
from django.contrib.auth.models import User
# from django.contrib.auth.serializers import UserSerializer
from .models import flight_search,flight,flight_seat,seat,Booking,CustomUser,AirplaneType,Airport
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login 
from rest_framework_simplejwt.tokens import RefreshToken


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'name': {'required': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data1):
        email = data1['email']
        password = data1['password']
        user = authenticate(email=email, password=password)
        if user is None:
            print("none")
            raise serializers.ValidationError("Invalid login credentials")
        try:
            print("inside")
            refresh=RefreshToken.for_user(user)
            refresh_token= str(refresh)
            access_token = str(refresh.access_token)

            update_last_login(None,user)

            validation={
                'access':access_token,
                'refresh':refresh_token,
                'email':user.email,
            }

            return validation
        except CustomUser.DoesNotExist and User.DoesNotExist:
            print("except")
            raise serializers.ValidationError("Invalid login credentials")
        
        # refresh = RefreshToken.for_user(user)
        # data = {}
        # data['email'] = user.email
        # data['name'] = user.name
        # data['access'] = str(refresh.access_token)
        # data['refresh'] = str(refresh)
        # return data


# class CustomUserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ['id', 'email', 'name', 'password']
#         extra_kwargs = {
#             'password': {'write_only': True},
#              'name': {'required': True},
             
#         }

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(**validated_data)
#         return user
    


  
# class StudentSerializer(serializers.ModelSerializer): 
#     student_id=serializers.IntegerField(required=True) 
#     username = serializers.CharField(max_length=200, required=True)  
#     email = serializers.CharField(max_length=200, required=True)  
#     password = serializers.CharField(max_length=200, required=True)  
#     # roll_number = serializers.IntegerField()  
#     # mobile = serializers.CharField(max_length=10, required=True)  
  
#     class Meta:  
#         model = Students  
#         fields = ('__all__')  




class flight_searchSerializer(serializers.ModelSerializer):

    class Meta:  
        model = flight_search
        fields = ('__all__')  


class AirplaneTypeSerializer(serializers.ModelSerializer):
    

    class Meta:  
        model = AirplaneType
        fields = ('__all__')  

class AirportSerializer(serializers.ModelSerializer):
    
    class Meta:  
        model = Airport  
        fields = ('__all__')  

class FlightSerializer(serializers.ModelSerializer):
    origin_name=AirportSerializer
    dest_name=AirportSerializer
    airline=AirplaneTypeSerializer

    class Meta:  
        model = flight  
        fields = ('__all__')  


class flight_seatSerializer(serializers.ModelSerializer):
    flight =FlightSerializer

    class Meta:  
        model = flight_seat
        fields = ('__all__') 

    

class seatSerializer(serializers.ModelSerializer):
    flight=FlightSerializer
    class Meta:  
        model = seat 
        fields = ('__all__')  



class BookingSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer
    seats=flight_seatSerializer
    class Meta:
        model = Booking
        fields = ('__all__')


 