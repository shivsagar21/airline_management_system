import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
function Occupancy(){
    const [from,setfrom]=useState('Hyderabad');
    const [to,setto]=useState('Mumbai');
    let navigate=useNavigate();
    const [airports,setairport]=useState([]);
    useEffect(()=>{
        if(localStorage.getItem("admin")===null) navigate('/login',{state:true});
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
    },[localStorage.getItem["admin"]]);
    const handleSubmit=(e)=>{
        e.preventDefault();
        navigate('/Admin/show_occ',{state:{from:from,to:to}})
    }
    return(
        <>
        <div className="background"></div>
            <div className="form-bottom1" style={{ color: "white" }}>
                <form onSubmit={handleSubmit} className="flight-search-form">
                    <div className="form-top1">
                        <div className="form-top-left1">
                            <h2 style={{ color: "white" }}>Enter airports</h2>
                        </div>
                        <br />
                    </div>
                    <div classname="row">
                        <div classname="form-group col-lg-4">
                            <label htmlFor="from" style={{color:"black"}}>From</label>
                            <select name="from" placeholder="From" className="form-control" value={from} onChange={(event) => setfrom(event.target.value)}>
                            {airports.map((airport)=>(
                                <option value={airport.name}>{airport.name}</option>
                              ))}
                              </select>
                            <label htmlFor="to" style={{color:"black"}}>To</label>
                            <select name="to" placeholder="To" className="form-control" value={to} onChange={(event)=>setto(event.target.value)}>
                            {airports.map((airport)=>(
                                <option value={airport.name}>{airport.name}</option>
                              ))}
                              </select>
                            </div>
                        
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button type="submit" className="bb">Check occupancy</button>
                        </div>
                    </form>
                </div>
    
            </>
        )
    
} 
export default Occupancy;
