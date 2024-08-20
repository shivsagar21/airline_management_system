import React, { useState } from 'react';
import './booking.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

function Booking(props) {
    const [openDialog, handleDisplay] = useState(false);
    const [PassengerList, setPassengerList] = useState(Array.from({ length: props.people }, () => ({ name: '', age: '' })));
    const state = {
        button: 1
      };
    const navigate=useNavigate();
    console.log(props.people)

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
        handleDisplay(true);
        e.preventDefault();
        props.onSubmitpass(PassengerList);
        
    }
    const dialog=(e)=>{
        console.log(e)
        if(e==="true"){
            navigate('/preference');
            handleDisplay(false);
        }
        else{
            navigate('/payment');
            handleDisplay(false);
        }
    }
    const dialogStyle = {
        padding: "20px",
    };
    

    return (
        <>
            <Dialog close = {!openDialog} open = {openDialog}>
            <DialogTitle> Confirmation Box </DialogTitle>
            <h5 style = {dialogStyle}>
                Do you want to choose your seats?<br/>You'll be charged Rs. 200 extra if you choose to.
            </h5>
            <div style={{whiteSpace:"nowrap"}}>
            <button type="button" className='btn btn-primary flex-row-reverse' style={{width:'49%',display:"inline",paddingLeft:"100px"}} value="true" onClick={(e)=>dialog(e.target.value)}>Yes</button>
            <button type="button" className='btn btn-primary flex-row-reverse' style={{width:'49%',display:"inline",float: 'right'}} value="false" onClick={(e)=>dialog(e.target.value)}>No</button>
            </div>
            </Dialog>
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
                        <button type="submit" className="bb">Book</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Booking;
