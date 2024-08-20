import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
function Profit(){
    let navigate=useNavigate();
    const [profit,setprofit]=useState('');
    useEffect(()=>{
        if(localStorage.getItem("admin")===null) navigate('/login',{state:true});
    },[localStorage.getItem["admin"]]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const response=axios.post('http://127.0.0.1:8000/profit/', {from:from,to:to})
            .then((response) => {
                setprofit(response.data.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
            handleDisplay(true);
    }
    const [openDialog, handleDisplay] = useState(false);
   const handleClose = () => {
      handleDisplay(false);
   };
   const dialogStyle = {
      padding: "20px",
   };
    
    const [from,setfrom]=useState('');
    const [to,setto]=useState('');
    return(
        <>
            <Dialog onClose = {handleClose} open = {openDialog}>
            <DialogTitle> Profit earned </DialogTitle>
            <h3 style = {dialogStyle}>
            The profit earned by the airline from {from} till {to} is {profit}.
            </h3>
            </Dialog>
            <div className="background"></div>
            <div className="form-bottom1" style={{ color: "white" }}>
                <form onSubmit={handleSubmit} className="flight-search-form">
                    <div className="form-top1">
                        <div className="form-top-left1">
                            <h2 style={{ color: "white" }}>Enter date range</h2>
                        </div>
                        <br />
                    </div>
                    <div classname="row">
                        <div classname="form-group col-lg-4">
                            <label htmlFor="from" style={{color:"black"}}>From</label>
                            <input required type="date" name="from" placeholder="From" className="form-control" value={from} onChange={(event) => setfrom(event.target.value)} />
                            <label htmlFor="to" style={{color:"black"}}>To</label>
                            <input required type="date" name="to" placeholder="To" className="form-control" value={to} onChange={(event)=>setto(event.target.value)} />
                            </div>
                        
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button type="submit" className="bb">Check Profit</button>
                        </div>
                    </form>
                </div>
    
            </>
        )
} 
export default Profit;   
