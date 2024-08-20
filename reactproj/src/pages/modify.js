import React, { useState } from 'react';
import './booking.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Modify(props) {
    let location=useLocation();
    const [people,setpeople]=useState(0);
    useEffect(()=>{

        const request=axios.get(`http://127.0.0.1:8000/booking/?id=${location.state[0]}`)
        .then((request)=>{
            setpeople(request.data.no);
            console.log(request.data.no);
    })
    },[people])
    console.log(location.state[1])
    const [PassengerList, setPassengerList] = useState(Array.from({ length: location.state[1] }, () => ({ name: '', age: '' })));
    
    const navigate=useNavigate();
    console.log(location.state[1])

    const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedList = [...PassengerList];
    updatedList[index] = {
    ...updatedList[index],
    [name]: value
  };
  setPassengerList(updatedList);
};

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onSubmitpass(PassengerList);
        navigate('/payment1',{state:location.state});
    }
    

    return (
        <>
            <div className="background"></div>
            <div className="form-bottom1" style={{ color: "white" }}>
                <form onSubmit={handleSubmit} className="flight-search-form">
                    <div className="form-top1">
                        <div className="form-top-left1">
                            <h3 style={{ color: "white" }}>Passenger Details</h3>
                        </div>
                        <br />
                    </div>
                    {PassengerList.map((passList1, index) => (
                        <div className="row" key={index}>
                            <div className="form-group col-lg-4">
                                <label htmlFor={`name${index}`}style={{color:"black"}}>Name</label>
                                <input required type="text" name="name" placeholder="Name" className="form-control" id={`osearch${index}`} value={PassengerList[index].name} onChange={(e) => handleInputChange(e, index)} />
                            </div>
                            <div className="form-group col-lg-4">
                                <label htmlFor={`Age${index}`}style={{color:"black"}}>Age</label>
                                <input required type="number" name="age" min="5" placeholder="Age" className="form-control" id={`dsearch${index}`} value={PassengerList[index].age} onChange={(e) => handleInputChange(e, index)}/>
                            </div>
                        </div>
                    ))}
                    <br />
                    <div style={{ textAlign: "center" }}>
                        <button type="submit"  className="bb">Modify</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Modify;