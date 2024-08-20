import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './search.css';
import { useNavigate } from 'react-router-dom';
// FlightsPage.js

function FlightsPage(props){
    const [flights, setFlights] = useState([]);
    const [tickets, settickets] = useState([]);
    const [selectedClass, setSelectedClass] = useState('Class');
    const [selectedFlight,setflight]=useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem["email"]]);
    useEffect(() => {
        const fetchFlights = async () => {
            console.log(props.origin_name)
            if (props.origin_name && props.dest_name && props.date) {
                console.log("calling")
                const response = await axios.get(`http://127.0.0.1:8000/flight/?origin_name=${props.origin_name}&dest_name=${props.dest_name}&date=${props.date}&Class=${props.Class}&people=${props.people}`);
                console.log("calling1")
                setFlights(response.data.flights);
                settickets(response.data.ticket);
            }
        };
        fetchFlights();
    }, []);
    
    console.log(flights)
    function selectseats(flight){
        let fare=getPriceForClass(flight);
        props.onSubmit(flight,fare);
        navigate("/Book/passenger");
        setflight(flight);

    }
    function getPriceForClass(flight){
        console.log(props.Class);
        if (props.Class === 'Economy') {
            return flight.Eco_fare;
        } else if (props.Class === 'Business') {
            console.log(flight.busi_fare);
            return flight.busi_fare;
        } else if (props.Class === "First Class") {
            return flight.first_fare;
        }
    }
    function find_seat(flight){
        if (props.Class === 'Economy') {
            return flight.T_Econo;
        } else if (props.Class === 'Business') {
            return flight.T_Bussi;
        } else if (props.Class === 'First Class') {
            return flight.T_First;
        }
    }

    return (
        <>
            <div className="top-content">
                <div className="inner-bg" style={{ padding: "0px 0px 80px 0" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="form-box">
                                    <form className='ad'>
                                        <div className="form-top">
                                            <div className="form-top-left">
                                                <h2>Flights</h2>
                                            </div>
                                            <div className="form-top-right">
                                                <i className="fa fa-plane"></i>
                                            </div>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Flight ID</th>
                                                    <th>Departure City</th>
                                                    <th>Arrival City</th>
                                                    <th>Departure Time</th>
                                                    <th>Arrival Time</th>
                                                    <th>Class</th>
                                                    <th>Seats available</th>
                                                    <th>Fare</th>
                                                    
                                                    <th>Seats</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {flights.map((flight1, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{flight1.id}</td>
                                                        <td>{flight1.origin_name}</td>
                                                        <td>{flight1.dest_name}</td>
                                                        <td>{flight1.start}</td>
                                                        <td>{flight1.end}</td>
                                                        <td>{props.Class}</td>
                                                        <td>{find_seat(tickets[index])}</td>
                                                        <td>{getPriceForClass(flight1)}</td>
                                                        <td> <input type='submit' className='btn btn-primary flex-row-reverse' value='Select' disabled={props.people>find_seat(tickets[index])?true:false} onClick={()=>selectseats(flight1)}/></td>
                                                    </tr>

                                                ))}



                                            </tbody>
                                        </table>
                                    </form >
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>

    );
}

export default FlightsPage;
