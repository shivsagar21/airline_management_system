from django.db import models
from django.contrib.auth.models import AbstractBaseUser, User, BaseUserManager, PermissionsMixin, Permission,Group


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Airport(models.Model):
    name=models.CharField(max_length=150,primary_key=True)

class AirplaneType(models.Model):
    airplane_type=models.CharField(max_length=50,primary_key=True)
    Econo=models.IntegerField()
    first=models.IntegerField()
    busi=models.IntegerField()
    count=models.IntegerField()
    basic_cost=models.IntegerField(default=0)
    cost=models.IntegerField(default=0)
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=30)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    wallet=models.IntegerField(default=0)
    

    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name='custom_users_permissions'
    )

    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name='custom_users_groups'
    )
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email


class flight_search(models.Model):
    date = models.DateTimeField()
    origin = models.CharField(max_length=200)
    origin_id = models.IntegerField
    dest = models.CharField(max_length=200)
    dest_id = models.IntegerField
    prf_class = models.CharField(max_length=200)

class Distance(models.Model):
    From=models.CharField(max_length=50)
    to=models.CharField(max_length=50)
    distance=models.IntegerField()

class flight(models.Model):
    origin_name = models.ForeignKey(Airport,on_delete=models.CASCADE,related_name="origin")
    dest_name = models.ForeignKey(Airport,on_delete=models.CASCADE,related_name="dest")
    start = models.TimeField()
    end = models.TimeField()
    Eco_fare = models.IntegerField()
    first_fare = models.IntegerField()
    busi_fare = models.IntegerField()
    date = models.DateField()
    airline = models.ForeignKey(AirplaneType,on_delete=models.CASCADE)
    distance=models.IntegerField()
    last_date=models.DateField(null=True, blank=True)
    day=models.CharField(max_length=15,default="Wednesday")

class flight_seat(models.Model):
    flight = models.ForeignKey(flight, on_delete=models.CASCADE)
    date=models.DateField()
    seats_no = models.CharField(max_length=500)
    Class=models.CharField(max_length=20,)

class seat(models.Model):
    flight = models.ForeignKey(flight,on_delete=models.CASCADE) 
    T_Econo = models.IntegerField()
    T_Bussi = models.IntegerField()
    T_First = models.IntegerField()
    date=models.DateField()
    Income=models.IntegerField()


class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name="user", default=0)
    Num_trav = models.IntegerField()
    seats=models.OneToOneField(flight_seat,on_delete=models.CASCADE,related_name="seats")
    date=models.DateField()
    traveller = models.CharField(max_length=150)
    tra_age = models.CharField(max_length=150)
    fare=models.IntegerField()


# -------------------------------------------------------------------------------------------------------------------------------------------------

