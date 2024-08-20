import React, { useState } from 'react';
import axios from 'axios';
import './addFlight.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// FlightsPage.js

function FlightsPage() {
    const [flightList, setflightList] = useState([{
        origin_name: 'Hyderabad',
        dest_name: 'Hyderabad',
        start: '',
        end: '',
        Eco_fare: '',
        first_fare: '',
        busi_fare: '',
        date: moment().add(1,'days').format("YYYY-MM-DD"),
        airline: 'boeing747',

    }]);
    const [error,seterror]=useState(true);
    const [airplanes,setairplanes]=useState([]);
    const [airports,setairport]=useState([]);
    const [mssg,setmssg]=useState('');
    let navigate=useNavigate();
    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const list = [...flightList];
        list[index][name] = value;
        setflightList(list);
        seterror(false);
        let iserror = false;
        let index_=0;
        let index1_=0;
        
        flightList.map((flight,index)=>{
            flightList.map((flight1,index1)=>{
                if ((index1!==index)&&(flight1.origin_name===flight.origin_name)&&(flight.dest_name===flight1.dest_name)&&(flight.start===flight1.start)&&(flight.end===flight1.end) &&((new Date(flight1.date)).getDay()===(new Date(flight.date)).getDay())){
                    iserror=true;
                    console.log(1)
                    index_=index;
                    index1_=index1;
                }
            })
            if (flight.origin_name===flight.dest_name){
                seterror(true);
                console.log(error);
            }
        })
        if (iserror){
            setmssg(`Schedule clash for flights at index ${index_},${index1_}`)
        }
        else{
            setmssg('')
        }

      };
    useEffect(()=>{
        if(localStorage.getItem("admin")===null) navigate('/login',{state:true});
        const fetchtype=async()=>{
            const response=await axios.post('http://127.0.0.1:8000/addflight/')
            .then((response)=>{
                setairplanes(response.data.airplane)
                setairport(response.data.airport)
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
        }
        fetchtype();
    },[]);
    
    const handleAddClick = () => {
        setflightList([
            ...flightList,
            {
                origin_name: 'Hyderabad',
                dest_name: 'Hyderabad',
                start: '',
                end: '',
                Eco_fare: '',
                first_fare: '',
                busi_fare: '',
                date: moment().format("YYYY-MM-DD"),
                airline: 'boeing747',
            }]);
    };

    const handleRemoveClick = (index) => {
        const list = [...flightList];
        list.splice(index, 1);
        setflightList(list)
    };
    const handleSubmit = (e) => {
        console.log(flightList)
        e.preventDefault();
        if((mssg==='')){
            const response=axios.post('http://127.0.0.1:8000/flight/', flightList)
                .then((response) => {
                    console.log(response.data);
                    if ((response.data.status=="success")){
                        setmssg('')
                        navigate("/home")
                    }
                    else {
                        setmssg(response.data.status)
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }


    return (
        <>
            <div className="top-content1">
                <div className="inner-bg" style={{ padding: "0px 0px 80px 0" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="form1-box">
                                    <form onSubmit={handleSubmit} className="ab">
                                        <div className="form1-top">
                                            <div className="form1-top-left">
                                                <h2>Flights</h2>
                                            </div>
                                            <div className="form1-top-right">
                                                <i className="fa fa-plane"></i>
                                            </div>
                                        </div>
                                        <label htmlFor="errors" style={{color:"red"}} hidden={mssg===null?true:false}>{mssg}</label>
                                        <label htmlFor="error" hidden={error?false:true} style={{color:"red"}} className="center">Origin and destination name should not be same!</label>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Departure City</th>
                                                    <th>Arrival City</th>
                                                    <th>Departure Time</th>
                                                    <th>Arrival Time</th>
                                                    <th>Date of first departure</th>
                                                    <th>Economy fare</th>
                                                    <th>Business fare</th>
                                                    <th>First Class fare</th>
                                                    {/* <th>Basic cost</th> */}
                                                    {/* <th>Cost per km</th> */}
                                                    
                                                    <th>Airplane type</th>
                                                </tr>
                                            </thead>
                                            
                                                {flightList.map((flightList1, index) => (
                                                    <tbody>
                                                    <tr key={index}>
                                                        <td><select id="origin_name" name="origin_name" value={flightList[index].origin_name} onChange={(e) => handleInputChange(e, index)}>
                                                        {airports.map((airport)=>(
                                                            <option value={airport.name}>{airport.name}</option>
                                                        ))}
                                                        </select>
                                                        </td>
                                                        <td><select id="destin_name" name="dest_name" value={flightList[index].dest_name} onChange={(e) => handleInputChange(e, index)}>
                                                        {airports.map((airport)=>(
                                                            <option value={airport.name}>{airport.name}</option>
                                                        ))}
                                                        </select>
                                                        </td>
                                                        <td><input type="Time" id="start" name="start" value={flightList[index].start} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="Time" id="end" name="end" value={flightList[index].end} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="Date" min={moment().add(1,'days').format("YYYY-MM-DD")} id="date" name="date" value={flightList[index].date} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="number" id="Eco_fare" name="Eco_fare" value={flightList[index].Eco_fare} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="number" id="busi_fare" name="busi_fare" value={flightList[index].busi_fare} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="number" id="first_fare" name="first_fare" value={flightList[index].first_fare} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><select id="airline" name="airline" value={flightList[index].airline} onChange={(e) => handleInputChange(e, index)}>
                                                        {airplanes.map((airplane)=>(
                                                            <option value={airplane.airplane_type}>{airplane.airplane_type}</option>
                                                        ))}
                                                        </select>
                                                        </td>

                                                        <td>{flightList.length>1 &&(<input type='remove' className='btn btn-primary flex-row-reverse' value='Remove' onClick={() =>handleRemoveClick(index)} />)}</td>
                                                       
                                                    </tr>
                                                    {
                                                            flightList.length - 1 === index && flightList.length < 3 && (
                                                                <button type='button' onClick={handleAddClick} className="add" >Add</button>
                                                            )
                                                 }
                                                    </tbody>
                                                ))}
                                            

                                        </table>
                                      <div style={{paddingLeft:"1500px"}}><button type='submit' disabled={error?true:false} style={{width:'80%'}}>Save</button></div>

                                    </form>

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
