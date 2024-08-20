from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics,permissions
from .models import flight_search, flight, flight_seat, seat,Booking,CustomUser,AirplaneType,Distance
from .serializers import flight_searchSerializer, FlightSerializer, flight_seatSerializer, seatSerializer,BookingSerializer,CustomUserSerializer,CustomTokenObtainPairSerializer,AirportSerializer,AirplaneTypeSerializer
from django.contrib.auth.models import auth, User
from django.contrib import messages
from datetime import datetime,timedelta
from django.contrib.auth import authenticate,logout
from . import models
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from django.utils.timezone import localdate
from django.utils.timezone import localtime
from itertools import chain

# Create your views here.
config = {
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
}


DATE_FORMAT = "%Y-%m-%d"
class CustomUserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid()
        try:
            admin=User.objects.get(email=request.data['email'],is_superuser=True)
            type="admin"
        except User.DoesNotExist:
            try:
                user = CustomUser.objects.get(email=request.data['email'])
                type="user"
            except CustomUser.DoesNotExist:
                type=""
                response = Response({
                'status': True,
                'type':type,
                "data": "hello",
                'message':"User logged in successfully",
                'access':None,
                'refresh':None
                }, status=200)
                return response
            
        
        response = Response({
            'status': True,
            'type':type,
            "data": "hello",
            'message':"User logged in successfully",
            'access':serializer.data['access'],
            'refresh':serializer.data['refresh']
        }, status=200)
        return response

class CustomLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "You have been logged out."}, status=status.HTTP_200_OK)
    
class RemoveflightView(APIView):
    def get(self,request):
        flight_=request.GET.get('id')
        print(flight_)
        Flight=flight.objects.get(id=flight_)
        Flight.last_date=localdate()
        Flight.airline.count+=1
        Flight.airline.save()
        booking=Booking.objects.filter(seats__flight=flight_,date__gt=localdate())
        for result in booking:
            user=CustomUser.objects.get(id=result.user.id)
            user.wallet+=result.fare
            user.save()
        seats=flight_seat.objects.filter(flight=flight_,date__gt=localdate())
        seats.delete()
        seats_=seat.objects.filter(flight=flight_,date__gt=localdate())
        seats_.delete()
        Flight.save()
        print("h")
        response=Response({
            "status":"success",
            "data":"hello"
        })
        return response
    
class ProfitView(APIView):
    def post(self,request):
        From=request.data['from']
        to=request.data['to']
        seats=seat.objects.filter(Q(date__gte=From) & Q(date__lte=to))
        profit=0
        for Seat in seats:
            profit+=(Seat.flight.airline.Econo-Seat.T_Econo)*Seat.flight.Eco_fare+(Seat.flight.airline.busi-Seat.T_Bussi)*Seat.flight.busi_fare+(Seat.flight.airline.first-Seat.T_First)*Seat.flight.first_fare-Seat.flight.airline.basic_cost-Seat.flight.airline.cost*Seat.flight.distance
        return Response({"status": "success", "data": profit}, status=status.HTTP_200_OK)

class FlightView(APIView):
    def get(self, request):
        origin_name = request.GET.get('origin_name')
        dest_name = request.GET.get('dest_name')
        date = datetime.strptime(request.GET.get('date'),DATE_FORMAT)
        day=date.strftime("%A")
        no=request.GET.get('people')
        Class=request.GET.get('Class')
        # filter flights based on origin, destination, and date
        
        if(date.date()==localdate()):
            flights_ = flight.objects.filter(Q(origin_name=origin_name, dest_name=dest_name, date__lte=date) & (Q(start__gt=(localtime()+timedelta(hours=2)).time()) & Q(date=date) & (Q(last_date=None) | Q(last_date__gte=date)))).order_by('start')
        elif (date.date()==localdate()+timedelta(days=1)):
            if localdate()+timedelta(hours=2)>localdate():
                flights_ = flight.objects.filter(Q(origin_name=origin_name, dest_name=dest_name, date__lte=date)& (Q(start__gt=(localtime()+timedelta(hours=2)).time()) & (Q(last_date=None) | Q(last_date__gte=date)))).order_by('start')
            else:
                flights_ = flight.objects.filter(Q(origin_name=origin_name, dest_name=dest_name, date__lte=date) & (Q(last_date=None) | Q(last_date__gte=date))).order_by('start')
        
        else:
            flights_ = flight.objects.filter(Q(origin_name=origin_name, dest_name=dest_name, date__lte=date)& (Q(last_date=None) | Q(last_date__gte=date))).order_by('start')
        flights=[]
        for flight_ in flights_:
            if flight_.date.strftime("%A")==day:
                flights.append(flight_)

        for flight_ in flights:
            seats=seat.objects.filter(flight=flight_.id,date=request.GET.get('date'))
            print(flight_.id)
            if (seats.exists()):
                print(date)
                print("exist")
                pass
            else:
                print(flight_.id)
                seatsSerializer=seatSerializer(data={"T_Econo":flight_.airline.Econo,"T_Bussi":flight_.airline.busi,"T_First":flight_.airline.first,"Income":0,"date":request.GET.get('date'),"flight":flight_.id})
                if seatsSerializer.is_valid():
                    seatsSerializer.save()
        
        # serialize the filtered flights
        if Class=="Economy":
            seats=seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_Econo__gte=no).order_by('flight__start')
            seats=list(chain(seats,seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_Econo__lt=no).order_by('flight__start')))
        else:
            if Class=="Business":
                seats=seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_Bussi__gte=no).order_by('flight__start')
                seats=list(chain(seats,seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_Bussi__lt=no).order_by('flight__start')))
            else:
                seats=seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_First__gte=no).order_by('flight__start')
                seats=list(chain(seats,seat.objects.filter(flight__origin_name=origin_name,flight__dest_name=dest_name,date=date,T_First__lt=no).order_by('flight__start')))
                
        serializer = seatSerializer(seats, many=True)
        Serializer=FlightSerializer(flights,many=True)
        # create the response object and set the Access-Control headers
        response = Response({
            'status': 'success',
            'ticket': serializer.data,
            'flights':Serializer.data,

        })
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"

        return response

    def post(self, request):
        print(request.data)
        n={}
        airplanes=[]
        index=0
        for airplane in request.data:
            index+=1
            types=AirplaneType.objects.get(airplane_type=airplane['airline'])
            if not n.get(types.airplane_type):
                n[types.airplane_type]=1
                if types.count>=n[types.airplane_type]:
                    pass
                else:
                    return Response({"status": "Not enough airplanes of type "+types.airplane_type, "data":None}, status=status.HTTP_200_OK)

            elif types.count>n[types.airplane_type]:
                n[types.airplane_type]+=1
            else:
                return Response({"status": "Not enough airplanes of type "+types.airplane_type, "data":None}, status=status.HTTP_200_OK)

            
            try:
                flights=flight.objects.get(dest_name=airplane['dest_name'],origin_name=airplane['origin_name'],start=airplane['start'], end=airplane['end'],day=datetime.strptime(airplane['date'],DATE_FORMAT).strftime("%A"),last_date__isnull=True)
                if flights:
                    return Response({"status": "Schedule clash for flight at index="+str(index), "data":None}, status=status.HTTP_200_OK)
            except flight.DoesNotExist:
                airplane.update({"day":datetime.strptime(airplane['date'],DATE_FORMAT,).strftime("%A"),"distance":Distance.objects.get(Q(From=airplane['origin_name'],to=airplane['dest_name']) | Q(to=airplane['origin_name'],From=airplane['dest_name'])).distance})
                airplanes.append(airplane)
        
        airplanetypes=AirplaneType.objects.all()
        for airplanetype in airplanetypes:
            if n.get(airplanetype.airplane_type):
                airplanetype.count-=n[airplanetype.airplane_type]
                airplanetype.save()

        serializer = FlightSerializer(data=airplanes,many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class modifyView(APIView):
    def post(self,request):
        ticket=Booking.objects.get(id=request.data['id'])
        ticket.traveller=",".join(request.data['pass'])
        ticket.tra_age=",".join(request.data['age'])
        ticket.save()
        return Response({"status": "success"}, status=status.HTTP_200_OK) 
    
class EditView(APIView):
    def post(self,request):
        data=request.data
        for data_ in data:
            flights=flight.objects.get(id=data_['id'])
            flights.Eco_fare=data_['Eco_fare']
            flights.first_fare=data_['first_fare']
            flights.busi_fare=data_['busi_fare']
            flights.save()
        return Response({"status": "success"}, status=status.HTTP_200_OK) 
class GettypeView(APIView):
    def post(self,request):
        airports=models.Airport.objects.all()
        serializer=AirportSerializer(airports,many=True)
        airtype=models.AirplaneType.objects.all()
        Serializer=AirplaneTypeSerializer(airtype,many=True)
        return Response({"status": "success", "airport": serializer.data,"airplane":Serializer.data}, status=status.HTTP_200_OK)
         
class flight_searchView(APIView):
    def get(self, request, *args, **kwargs):
        result = flight_search.objects.all()
        serializers = flight_searchSerializer(result, many=True)
        print("Get", result, serializers)
        print("flight")
        response = Response({
            'status': 'success',
            "data": "helo",
            "students": serializers.data
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response

    def post(self, request):
        flights=flight.objects.filter(last_date__isnull=True)
        serializers=FlightSerializer(flights,many=True)
        response = Response({
            'status': 'success',
            "data": "helo",
            "flights": serializers.data
        }, status=status.HTTP_200_OK)
        return response


class flight_seatView(APIView):
    def get(self, request, *args, **kwargs):
        result = flight_seat.objects.all()
        serializers = flight_seatSerializer(result, many=True)
        print("Get", result, serializers)

        response = Response({
            'status': 'success',
            "data": "helo",
            "students": serializers.data
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response

    def post(self, request):
        print(request.data)
        serializer = flight_seatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class MybookingView(APIView):
    def get(self, request, *args, **kwargs):
        id=request.GET.get('id')
        result=Booking.objects.get(id=id)
        serializers = BookingSerializer(result)
        status_="ok"
        seats=flight_seat.objects.get(id=result.seats.id)
        serializer=flight_seatSerializer(seats)
        flight_=flight.objects.get(id=seats.flight.id)
        if(result.date==localdate()):
            if result.seats.flight.start<(localtime()+timedelta(hours=3)).time():
                status_="timeerror"
        elif result.date==localdate()+timedelta(days=1):
            if localdate()+timedelta(hours=3)>localdate():
                if result.seats.flight.start<(localtime()+timedelta(hours=3)).time():
                    status_="timeerror"
        else:
            pass

        flights=FlightSerializer(flight_)
        response = Response({
            'status': 'success',
            "data": "helo",
            "ticket": serializers.data,
            "traveller":result.traveller.split(","),
            "age":result.tra_age.split(","),
            "seats":seats.seats_no.split(","),
            "Class":seats.Class,
            "flight":flights.data,
            "no":result.Num_trav,
            "time":status_,
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response
    
class seatView(APIView):
    def get(self, request, *args, **kwargs):
        result = seat.objects.all()
        serializers = seatSerializer(result, many=True)
        print("Get", result, serializers)

        response = Response({
            'status': 'success',
            "data": "helo",
            "students": serializers.data
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response

    def post(self, request):
        print(request.data)
        serializer = seatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class PaymentSuccessfulView(APIView):
    def post(self, request):
        print(request.data)
        flight_id=request.data['flight']
        date=request.data['date']
        passengers=request.data['pass']
        age=request.data['age']
        email=request.data['user1']
        Class=request.data['Class']
        booking_type=request.data['booking_type']
        no=int(request.data['people'])
        origin_name=request.data['origin']
        dest_name=request.data['dest']
        user=CustomUser.objects.get(email=request.data['user1'])
        Flight=flight.objects.get(id=flight_id)
        seat_=seat.objects.get(flight=flight_id,date=date)
        status_="ok"
        if Class=="Economy":
            fare=Flight.Eco_fare*no
            if seat_.T_Econo<no:
                status_="gone"
        else:
            if Class=="Business":
                fare=Flight.busi_fare*no
                if seat_.T_Bussi<no:
                    status_="gone"
            else:
                fare=Flight.first_fare*no
                if no>seat_.T_First:
                    status_="gone"
        if status_=="gone":
            user.wallet+=fare
            return Response({"status": "gone", "data": None}, status=status.HTTP_200_OK)
        if(booking_type=="random"):
            try:
                i=1
                j=no
                booked_seats=flight_seat.objects.filter(Class=Class,date=date,flight=flight_id)
                seats=[]
                new_seats=[]
                for booked_seat in booked_seats:
                    seats+=(booked_seat.seats_no.split(","))
                print(seats)
                while True:
                    if not j:
                        break
                    if(str(i) in seats):
                        print(1)
                        i+=1
                    else:
                        
                        new_seats.append(str(i))
                        i+=1
                        j-=1
            
            except flight_seat.DoesNotExist:
                
                for i in range(1,no+1):
                    if i==1:
                        new_seats=str(i)
                    else:
                        new_seats+=","+str(i)

        else:
            new_seats=request.data['seats']
            seats=flight_seat.objects.filter(flight=flight_id,date=date,Class=Class)
            for Seat_ in new_seats:
                for Seat in seats:
                    if Seat_ in Seat.seats_no.split(","):
                        user.wallet+=fare
                        return Response({"status":"gone", "data": None}, status=status.HTTP_200_OK)
            
        booked_seats=flight_seatSerializer(data={"seats_no":",".join(new_seats),"Class":Class,"date":date,"flight":flight_id})
        if booked_seats.is_valid():
            booked_seats.save()
        booked_seat=flight_seat.objects.get(seats_no=",".join(new_seats),Class=Class,date=date,flight=flight_id)
        traveller=','.join(passengers)
        print(traveller)
        tra_age=','.join(age)
        print(tra_age)
        
        if Class=="Economy":
            seat_.T_Econo-=no
        else:
            if Class=="Business":
                
                seat_.T_Bussi-=no
            else:
                
                seat_.T_First-=no
        if (user.wallet>fare):
            user.wallet-=fare
        else:
            user.wallet=0
        user.save()
        seat_.save()
        new_booking=BookingSerializer(data={"tra_age":tra_age,"traveller":traveller,"date":date,"Num_trav":no,"seats":booked_seat.id,"fare":fare,"user":user.id})
        if new_booking.is_valid():
            new_booking.save()
            return Response({"status": "success", "data": new_booking.data}, status=status.HTTP_200_OK)
        else:
            print(new_booking.errors)
            return Response({"status": "error", "data": new_booking.errors}, status=status.HTTP_400_BAD_REQUEST)

class preferenceView(APIView):
    def post(self,request):
        id=request.data['id']
        date=request.data['date']
        Class=request.data['Class']
        seats=flight_seat.objects.filter(flight=id,date=date,Class=Class)
        airplanetype=flight.objects.get(id=id).airline
        freeseats=[]
        if Class=="Economy":
            for i in range(1,airplanetype.Econo+1):
                freeseats.append(str(i))
        elif Class=="Business":
            for i in range(1,airplanetype.busi+1):
                freeseats.append(str(i))
        else:
            for i in range(1,airplanetype.first+1):
                freeseats.append(str(i))
        print(freeseats)
        for seat in seats:
            print("seats:"+seat.seats_no)
            for seat_ in seat.seats_no.split(","):
                if seat_ in freeseats:
                    freeseats.remove(seat_)

        return Response({"status": "success", "seats": freeseats}, status=status.HTTP_200_OK)
        

class BookingView(APIView):
    def get(self, request, *args, **kwargs):
        email=request.GET.get('email')
        
        user=CustomUser.objects.get(email=email)
        result = Booking.objects.filter(Q(user=user.id,date__gt=localdate()) | Q(user=user.id,seats__flight__start__gt=(localtime()),date=(localdate())))
        
            
        serializers = BookingSerializer(result, many=True)

        response = Response({
            'status': 'success',
            "data": "helo",
            "students": serializers.data
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response

    def post(self, request):
        print(request.data)
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CancelView(APIView):
    def get(self, request, *args, **kwargs):
        id=request.GET.get('id')
        result=Booking.objects.get(id=id)
        print(result.user)
        Seat=flight_seat.objects.get(id=result.seats.id)
        seat_=seat.objects.get(date=result.seats.date,flight=result.seats.flight.id)
        if Seat.Class=="Economy":
            seat_.T_Econo+=result.Num_trav
        elif Seat.Class=="Business":
            seat_.T_Bussi+=result.Num_trav
        else:
            seat_.T_First+=result.Num_trav
        seat_.save()
        user=CustomUser.objects.get(id=result.user.id)
        user.wallet+=.9*result.fare
        user.save()
        Seat.delete()
        response = Response({
            'status': 'success',
            "data": "hello",
        }, status=200)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
        return response

class WalletView(APIView):
    def post(self,request):
        print(request.data)
        user=CustomUser.objects.get(email=request.data['id'])
        return Response({"status": "success", "data": user.wallet}, status=status.HTTP_200_OK)

class OccupancyView(APIView):
    def post(self,request):
        From=request.data['from']
        
        to=request.data['to']
        seats=seat.objects.filter(Q(date__gt=localdate()) & Q(date__lte=localdate()+timedelta(days=30)) & (Q(flight__origin_name=From,flight__dest_name=to))).order_by('date')
        
        airplanetype=[]
        for seat_ in seats:
            airplanetype.append(seat_.flight.airline)
            
        serializer=seatSerializer(seats,many=True)
        Serializer=AirplaneTypeSerializer(airplanetype,many=True)
        
        return Response({"status": "success", "seats": serializer.data, "type":Serializer.data}, status=status.HTTP_200_OK)
# ------------------------------------------------------------------------------------------------------------------------------
