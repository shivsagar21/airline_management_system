import React, { useState } from 'react';
import './booking.css'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Preference(props) {
    const [seats, setseats] = useState(Array.from({ length: props.people }, () => ({ seat: 'Select'})));
    const [error,seterror]=useState(false);
    const [freeseats,setfreeseats]=useState([]);
    useEffect(()=>{
        const fetchseats=async()=>{
        const response=await axios.post('http://127.0.0.1:8000/preference/',{id:props.flight,date:props.date,Class:props.Class})
        console.log(response.data.seats)
        setfreeseats(response.data.seats);
        }
        fetchseats();
    },[props.Class,props.date,props.flight]);
    const navigate=useNavigate();
    console.log(props.people)
    
    const handleInputChange = (event, index) => {
        const { seat, value } = event.target;
        //console.log(event.target)
        const list = [...seats];
        list[index].seat = value;
        seterror(false);
        console.log(list);
        setseats(list);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        let isError = false; // Variable to track error condition
    
        seats.forEach((seat2, index2) => {
            seats.forEach((seat1, index1) => {
                if ((index1 !== index2 && seat1.seat === seat2.seat) || (seat1.seat==='Select')) {
            
                    isError = true; // Update error condition
                }
            });
        });
        
        if (isError) {
            seterror(true); // Update error state
        } else {
            seterror(false); // Update error state
            props.onSubmitseat(seats);
            navigate('/payment');
        }
    };

    return (
        <>
            <div className="background"></div>
            <div className="form-bottom1" style={{ color: "white" }}>
                <form onSubmit={handleSubmit} className="flight-search-form">
                    <div className="form-top1">
                        <div className="form-top-left1">
                            <h3 style={{ color: "white" }}>Choose your seats</h3>
                        </div>
                        <br />
                        <label htmlFor="errors" style={{color:"red"}} hidden={!error}>All seat nos should be selected and have to be different</label>
                    </div>
                    {seats.map((seatlist1, index) => (
                        <div className="row" key={index}>
                            <div className="form-group col-lg-4">
                                <label htmlFor="Seat" style={{color:"black"}}>Seat {index}</label>
                                <select id="seat" name="seat" className="form-control"  value={seatlist1.seat} onChange={(e) => handleInputChange(e, index)}>
                                    <option value='Select'>Select</option>
                                    {freeseats.map((freeseat)=>(
                                        
                                        <option value={freeseat}>{freeseat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                    <br />
        
                    <div style={{ textAlign: "center" }}>
                        <button type="submit" disabled={error && props.people>1} className="bb">Book</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Preference;