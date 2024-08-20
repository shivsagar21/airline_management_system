import axios from 'axios';
import {useEffect} from 'react';
import { useState } from 'react';
import { NavLink,useNavigate } from "react-router-dom";
import moment from 'moment';
import './removeflight.css';
export default function Remove(){
    let navigate=useNavigate();
    const [error,seterror]=useState(false);
    const [mssg,setmssg]=useState('');
    const [flightList, setflightList] = useState([{}]);
    
    const handleInputChange = (event, index) => {

        const { name, value } = event.target;
        const list = [...flightList];
        list[index][name] = value;
        setflightList(list);
        seterror(false);
        flightList.map((flight)=>{
            if (flight.origin_name===flight.dest_name){
                seterror(true);
                console.log(error);
            }
        })
      };
      useEffect(()=>{
        const getlist=async()=>{
            const response=await axios.post('http://127.0.0.1:8000/search/')
            console.log(response.data.flights)
            setflightList(response.data.flights)
        };
        getlist();
        
    },[]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response=await axios.post('http://127.0.0.1:8000/edit/', flightList)

            .then((response) => {
                console.log(response.data);
                if (response.data.status==="success"){
                    navigate("/home")
                    setmssg('')
                }
                else {
                    setmssg(response.data.status)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleRemoveClick = (index) => {
        const list = [...flightList];
        const Del=async()=>{
        const response=await axios.get(`http://127.0.0.1:8000/remove/?id=${flightList[index].id}`)
        list.splice(index, 1);
        setflightList(list)
        }
        Del();
    };
    const handleAddClick=(e)=>{
        e.preventDefault();
        navigate('/Admin/AddFlight')
    };
    return (
        <>
            <div className="top-content2">
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
                                            <thead className='ac'>
                                                <tr>
                                                    
                                                    <th>Departure City</th>
                                                    <th>Arrival City</th>
                                                    <th>Departure Time</th>
                                                    <th>Arrival Time</th>
                                                    <th>Date of first departure</th>
                                                    <th>Economy fare</th>
                                                    <th>Business fare</th>
                                                    <th>First Class fare</th>
                                                    <th>Distance</th>
                                                    <th>Airplane Type</th>
                                                </tr>
                                            </thead>
                                            
                                                {flightList.map((flightList1, index) => (
                                                    <tbody>
                                                    <tr key={index}>
            
                                                    <td><input type="text" id="origin_name" name="origin_name" value={flightList[index].origin_name} onChange={(e) => handleInputChange(e, index)} readOnly>
                                                        
                                                        </input>
                                                        </td>
                                                        <td><input type="text" id="destin_name" name="dest_name" value={flightList[index].dest_name} onChange={(e) => handleInputChange(e, index)} readOnly>
                                                        
                                                        </input>
                                                        </td>
                                                        <td><input type="Time" id="start" name="start" value={flightList[index].start} onChange={(e) => handleInputChange(e, index)}readOnly/></td>
                                                        <td><input type="Time" id="end" name="end" value={flightList[index].end} onChange={(e) => handleInputChange(e, index)}readOnly/></td>
                                                        <td><input type="Date" min={moment().format("YYYY-MM-DD")} id="date" name="date" value={flightList[index].date} onChange={(e) => handleInputChange(e, index)}readOnly/></td>
                                                        <td><input type="number" id="Eco_fare" name="Eco_fare" value={flightList[index].Eco_fare} onChange={(e) => handleInputChange(e, index)} /></td>
                                                        <td><input type="number" id="busi_fare" name="busi_fare" value={flightList[index].busi_fare} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        <td><input type="number" id="first_fare" name="first_fare" value={flightList[index].first_fare} onChange={(e) => handleInputChange(e, index)}/></td>
                                                        {/* <td><input type="text" id="flight_id" name="flight_id" value={flightList[index].flight_id} onChange={(e) => handleInputChange(e, index)}/></td> */}
                                                        <td><input type="number" id="distance" name="distance" value={flightList[index].distance} onChange={(e) => handleInputChange(e, index)}readOnly/></td>
                                                        <td><input type="text" id="airline" name="airline" value={flightList[index].airline} onChange={(e) => handleInputChange(e, index)}readOnly>
                                                        
                                                        </input>
                                                        </td>
                                                        <td>{flightList.length>0 &&(<input type='remove' className='btn btn-primary flex-row-reverse' value='Remove' onClick={() =>handleRemoveClick(index)} />)}</td>
                                                       
                                                    </tr>
                                                    </tbody>
                                                ))}
                                            

                                        </table>
                                     <div style={{paddingRight:"1500px"}}><button type='button' onClick={handleAddClick} className="add" style={{width:'100%'}}>Add new flight</button></div>
                                      <div style={{paddingLeft:"1500px"}}><button type='submit' style={{width:'80%'}}>Save</button></div>

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
