import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function Show(){
    const [seats,setseats]=useState([]);
    const [type,settype]=useState([]);
    let location=useLocation();
    useEffect(()=>{
        console.log()
        const response=axios.post("http://127.0.0.1:8000/check/",{from:location.state.from,to:location.state.to})
        .then((response)=>{
            setseats(response.data.seats)
            settype(response.data.type)
            console.log(response.data)
        })
        .catch((response)=>{
            console.log(response.data)
        })
    },[]);

    return(
        <>
        <div class="view_occupancy">
        
        <br/>
        <div class="container bg-light" style={{width: "90%", borderRadius: "10px;"}}>
            <br/>
            <h1 style={{textAlign: "center", color:"rgb(81, 161, 0);"}}>Occupancy Rates for next 30 days</h1>
            <br/><hr/><br/>
            <div class="container" style={{width: "90%;"}}>
                {seats.map((seat,index)=>(
                <tr key={index}>
                    <h3 hidden={(index===0)?false:(seat.date===(seats[index-1].date))?true:false}>Occupancy rate from {location.state.from } to {location.state.to} on {seat.date}</h3>
                    <h4>For flight {seat.flight}= {(type[index].busi-seat.T_Bussi+type[index].first-seat.T_First+type[index].Econo-seat.T_Econo)/(type[index].busi+type[index].first+type[index].Econo)}</h4>
                    <h6 style={{fontFamily: "Arial"}}> First Class = {(type[index].first-seat.T_First)/type[index].first}</h6>
                    <h6 style={{fontFamily: "Arial"}}> Business Class = {(type[index].busi-seat.T_Bussi)/type[index].busi }</h6>
                    <h6 style={{fontFamily: "Arial"}}> Economy Class = {(type[index].Econo-seat.T_Econo)/type[index].Econo}</h6>
                </tr>
                ))}
                
                <br/>
                <hr/>
                <br/>
            </div>
        </div>
        </div>
        </>
    )
}