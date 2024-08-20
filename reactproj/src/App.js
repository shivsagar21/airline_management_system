import './App.css';
import Header from './components/header';
import Sign from './pages/sign';
import LoginForm from './pages/login';
import LogoutForm from './pages/logout';
import Footer from './components/footer';
import Home from './pages/home';
import FlightTable from './pages/search';
import Upcoming_journey from './pages/upcoming';
import FlightsPage from './pages/addflight';
import Mybooking from './pages/mybooking';
import Booking from './pages/booking';
import { useState} from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import FormPage from './pages/flight2';
import Payment from './pages/payment';
import Payment1 from './pages/payment1';
import Profit from './pages/profit';
import Remove from './pages/removeflight';
import Occupacy from './pages/occupancy';
import Wallet from './pages/wallet';
import Show from './pages/show_occ';
import Error_ from './pages/error';
import Preference from './pages/preference';
import Modify from './pages/modify';

function App() {
  
  const [origin_name, setOrigin_name] = useState('');
  const [dest_name, setDest_name] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');
  const [Class,setClass]=useState('');
  const [flight,setflight]=useState('');
  const [passengers,setpass]=useState([]);
  const [age,setage]=useState([]);
  const [fare,setfare]=useState('');
  const [Seats,setseats]=useState([]);
  function handleInputSubmit(origin_name, dest_name, date,people,Class) {
    setOrigin_name(origin_name);
    setDest_name(dest_name);
    setDate(date);
    setPeople(people);
    setClass(Class);
  }
  function handlehome(){
    setOrigin_name('');
    setDest_name('');
    setDate('');
    setPeople('');
    setClass('');
    setflight('');
    setpass([]);
    setage([]);
    setfare('');
    setseats([]);
  }
  function handlesignin(email,status){
    if(status==="user")
      localStorage.setItem("email", email);
    if(status==="admin") localStorage.setItem("admin",email);
    console.log(email);
  }
  function handleFlight(flight,fare){
    setfare(Number(fare)*Number(people))
    console.log(fare)
    console.log(flight.id)
    setflight(flight.id);
  }
  function handleseat(seats){
    setseats([]);
    seats.map(seat=>{
      setseats(previous=>[...previous,seat.seat])
    })
  }
  function handlepass(PassengerList){
    setseats([]);
    setpass([]);
    setage([]);
    console.log(PassengerList)
    PassengerList.map(passenger=>{
        setpass(previous=>[...previous,passenger.name])
    })
    PassengerList.map(passenger=>{
         setage(previous=>[...previous,passenger.age])
    
  })

  }
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Sign />} />
          <Route path="/login" element={<LoginForm onSignin={handlesignin}/>} />
          <Route path="/home" element={<Home onReturn={handlehome}/>} />
          <Route path="/SearchFlight" element={<FormPage onInputSubmit={handleInputSubmit}/>} />
          <Route path='/Book' element= {origin_name && dest_name && date && Class && people? <FlightTable origin_name={origin_name} dest_name={dest_name} date={date} Class={Class} user={localStorage.getItem("email")} people={people} onSubmit={handleFlight}/> : null}/>
          <Route path='/Book/passenger' element= {people ? <Booking people ={Number(people)} onSubmitpass={handlepass}/> : null}/>
          
          <Route path='/logout' element={<LogoutForm/>}/>
          <Route path='/index' element={<Upcoming_journey/>}/>
          <Route path='/myticket' element={<Mybooking/>}/>
          <Route path='/modify' element={<Modify onSubmitpass={handlepass}/>}/>
          <Route path='/payment' element={origin_name && dest_name && date && Class && flight && people && passengers && age && fare && Seats? <Payment Seats={Seats} origin_name={origin_name} dest_name={dest_name} date={date} Class={Class} flight={flight} people={people} passengers={passengers} age={age} fare={fare}/>:null}/>
          <Route path='/Admin/AddFlight' element={<FlightsPage />} />
          <Route path='/Admin/profit' element={<Profit />}/>
          <Route path='/Admin/edit' element={<Remove/>}/>
          <Route path='/Admin/occupancy' element={<Occupacy/>}/>
          <Route path='/mywallet' element={<Wallet></Wallet>}/>
          <Route path='/Admin/show_occ' element={<Show />}/>
          <Route path='/error' element={<Error_ />}/>
          <Route path='/payment1' element={passengers && age?<Payment1 passengers={passengers} age={age}/>:null}/>
          <Route path='/preference' element= {people && flight && date && Class? <Preference people ={Number(people)} flight={flight} date={date} Class={Class} onSubmitseat={handleseat}/> : null}/>
          
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
