import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './flight.css'
import moment from 'moment';
import axios from 'axios';

function FormPage(props) {
    const [origin_name, setorigin_name] = useState('Hyderabad');
    const [dest_name, setdest_name] = useState('Hyderabad');
    const [date, setdate] = useState('');
    const [Class, setClass] = useState("Economy");
    const [people, setPeople] = useState(' ');
    const navigate = useNavigate();
    const [airports,setairport]=useState([]);
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem["email"]]);
    useEffect(()=>{
        const fetchtype=async()=>{
            const response=await axios.post('http://127.0.0.1:8000/addflight/')
            .then((response)=>{
                setairport(response.data.airport);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        fetchtype();
    },[])
    const handleSubmit = (event) => {
        event.preventDefault();
        props.onInputSubmit(origin_name, dest_name, date,people,Class);
        navigate("/Book");
        console.log(origin_name, dest_name);
      };
    return (
        <>
            <div className="background2">
            </div>
            <div className="form-bottom1" style={{ color: "white" }}>
                <form  onSubmit={handleSubmit}className="flight-search-form">
                    <div className="form-top1">
                        <div className="form-top-left1">
                            <h3 style={{ color: "white" }}>Search Flight</h3>
                        </div>
                        <br />
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-4 ui-widget">
                            <label htmlFor="origin_name">From</label>
                            <select name="origin_name" placeholder="Departure City..." className="form-control" id="osearch" value={origin_name} onChange={(event) => setorigin_name(event.target.value)}>
                            {airports.map((airport)=>(
                              <option value={airport.name}>{airport.name}</option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group col-lg-4 ui-widget">
                            <label htmlFor="dest_name">To</label>
                            <select name="dest_name" placeholder="Destination City..." className="form-control" id="dsearch" value={dest_name} onChange={(event) => setdest_name(event.target.value)}>
                            {airports.map((airport)=>(
                                <option value={airport.name}>{airport.name}</option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group col-lg-4">
                            <label htmlFor="date">Departure date</label>
                            <input required type="date" min={moment().format("YYYY-MM-DD")} name="date" className="form-control" id="form-depart" value={date} onChange={(event) => setdate(event.target.value)} style={{ height: "60px" }} />
                        </div>
                    </div>
                    <br />

                    <div className="row">
                        <div className="form-group col-lg-4">
                            <label htmlFor="class">Class</label>
                            <select required name="Class" className="form-control" id="form-class" value={Class}  onChange={(event) => setClass(event.target.value)} >
                                <option value="Economy" >Economy</option>
                                <option value="Business"> Business</option>
                                <option value="First Class"> First Class</option>
                            </select>

                        </div>
                        <div className="form-group col-lg-4 ab">
                            <label htmlFor="people" style={{color:"black"}}>No. of People</label>
                            <input required type="number" min="1" max="4" placeholder="Number of People.." name="people" className="form-control" id="form-adults" value={people} onChange={(event)=> setPeople(event.target.value) }/>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                    <button type="submit" className="bb">Search Flights</button>
                    </div>
                </form>
            </div>

        </>
    );
}

export default FormPage;
