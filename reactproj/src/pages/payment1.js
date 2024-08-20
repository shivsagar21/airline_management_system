import React,{useState, useEffect} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import moment from 'moment';

export default function Payment1(props){
    let location=useLocation();
    const [card_no,setcard]=useState('');
    const [cvv_no,setcvv]=useState('');
    const [expiry,setexpiry]=useState('');
    const [fare,setfare]=useState(0);
    const navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem("email")]);

    const [Wallet,setWallet]=useState(0);
    useEffect(()=>{
        const response=axios.post('http://127.0.0.1:8000/wallet/',{id:localStorage.getItem('email')})
                .then((response) => {
                    setWallet(Number(response.data.data));
                    console.log(response.data.data);
                    console.log(Number(Wallet));
                    console.log(location.state);
                    console.log(props.passengers);
                    console.log(props.age);
                    if ((Wallet)>=location.state[2]*0.1){
                    setfare(0);
                    const response1=axios.post('http://127.0.0.1:8000/modify/',{id:location.state[0],pass:props.passengers,age:props.age})
                            .then((response1) => {
                                if(response1.data.status==="success"){
                                    navigate('/error',{state:response1.data.status})
                                }
                                console.log(response.data);
                                
                            })
                        }
                    else{
                        setfare(Number(location.state[2]*0.1-Wallet))
                    }
                    })
                .catch((error)=>{
                    console.log(error);
                })
                    
        },[Wallet]);
    const handleSubmit = (e) => {
        
        e.preventDefault();
    
            axios.post('http://127.0.0.1:8000/modify/',{id:location.state[0],pass:props.passengers,age:props.age})
            .then((response) => {
                if(response.data.status==="success"){
                    navigate('/error',{state:response.data.status})
                }
                console.log(response.data);
                
            })
            .catch((error) => {
                console.log(error);
            });
        }
        return(
            <>
                <div className="background"></div>
                <div className="form-bottom1" style={{ color: "white" }}>
                    <form onSubmit={handleSubmit} className="flight-search-form">
                        <div className="form-top1">
                            <div className="form-top-left1">
                                <h2 style={{ color: "black" }}>Enter card details</h2>
                            </div>
                            <br />
                        </div>
                        <div classname="row">
                            <div classname="form-group col-lg-4">
                                <label htmlFor="card" style={{color:"black"}}>Card Number</label>
                                <input required type="number" name="card" placeholder="Card Number" className="form-control" value={card_no} onChange={(event) => setcard(event.target.value)} />
                                <label htmlFor="cvv" style={{color:"black"}}>cvv number</label>
                                <input required type="number" min="100" max="999" name="cvv" placeholder="cvv number" className="form-control" value={cvv_no} onChange={(event)=>setcvv(event.target.value)} />
                                <label htmlFor="expiry" style={{color:"black"}}>Expiry Date</label>
                                <input required type="date" min={moment().add(1,'days').format("YYYY-MM-DD")}name="Expiry" placeholder="Expiry date" className="form-control" value={expiry} onChange={(event)=>setexpiry(event.target.value)}/>
                                <label htmlFor="amount" style={{color:"black"}}>Amount</label>
                                <input required type="text" name="Amount" placeholder={fare} className="form-control" readOnly></input>
                            </div>
                            
                        </div>
                
                        <div style={{ textAlign: "center" }}>
                            <button type="submit" className="bb">Pay</button>
                        </div>
                    </form>
                </div>
    
            </>
        )
}
