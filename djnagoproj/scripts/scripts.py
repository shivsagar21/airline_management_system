from api.models import CustomUser,Airport,AirplaneType,Distance

def run(*args):
    Hyderabad = Airport(name='Hyderabad')
    Mumbai = Airport(name='Mumbai')
    Delhi = Airport(name='Delhi')
    Chennai = Airport(name='Chennai')
    Bangalore = Airport(name='Bangalore')
    Kolkata = Airport(name='Kolkata')

    Hyderabad.save()
    Mumbai.save()
    Delhi.save()
    Chennai.save()
    Bangalore.save()
    Kolkata.save()
    boeing747 = AirplaneType(
        first=50,
        Econo=300,
        busi=100,
        airplane_type='boeing747',
        cost=5,
        basic_cost=1000,
        count=10
    )
    boeing747.save()
    boeing787 = AirplaneType(
        first=25,
        Econo=150,
        busi=50,
        cost=5,
        basic_cost=1100,
        airplane_type='boeing787',
        count=10
    )
    boeing787.save()
    MumbaitoDelhi=Distance(
    From="Mumbai",
    to="Delhi",
    distance=1140
    )
    MumbaitoDelhi.save()

    MumbaitoHyderabad=Distance(
    From="Mumbai",
    to="Hyderabad",
    distance=706
    )
    MumbaitoHyderabad.save()

    MumbaitoChennai=Distance(
    From="Mumbai",
    to="Chennai",
    distance=1032
    )
    MumbaitoChennai.save()

    MumbaitoKolkata=Distance(
    From="Mumbai",
    to="Kolkata",
    distance=1660
    )
    MumbaitoKolkata.save()

    MumbaitoBangalore=Distance(
    From="Mumbai",
    to="Bangalore",
    distance=841
    )
    MumbaitoBangalore.save()

    DelhitoHyderabad=Distance(
    From="Delhi",
    to="Hyderabad",
    distance=1256
    )
    DelhitoHyderabad.save()

    DelhitoChennai=Distance(
    From="Delhi",
    to="Chennai",
    distance=1760
    )
    DelhitoChennai.save()

    DelhitoKolkata=Distance(
    From="Delhi",
    to="Kolkata",
    distance=1300
    )
    DelhitoKolkata.save()

    DelhitoBangalore=Distance(
    From="Delhi",
    to="Bangalore",
    distance=1740
    )
    DelhitoBangalore.save()

    HyderabadtoChennai=Distance(
    From="Hyderabad",
    to="Chennai",
    distance=627
    )
    HyderabadtoChennai.save()

    HyderabadtoKolkata=Distance(
    From="Hyderabad",
    to="Kolkata",
    distance=1460
    )
    HyderabadtoKolkata.save()

    HyderabadtoBangalore=Distance(
    From="Hyderabad",
    to="Bangalore",
    distance=502
    )
    HyderabadtoBangalore.save()

    ChennaitoKolkata=Distance(
    From="Chennai",
    to="Kolkata",
    distance=1679
    )
    ChennaitoKolkata.save()

    ChennaitoBangalore=Distance(
    From="Chennai",
    to="Bangalore",
    distance=290
    )
    ChennaitoBangalore.save()

    KolkatatoBangalore=Distance(
    From="Kolkata",
    to="Bangalore",
    distance=1877
    )
    KolkatatoBangalore.save()

    print('file completely ran\n')