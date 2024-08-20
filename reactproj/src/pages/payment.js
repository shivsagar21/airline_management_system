import React,{useState, useEffect} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

function Payment(props){
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
                    console.log(props.Seats);
                    console.log(Wallet)
                    if (Number(Wallet)>=props.fare){
                        console.log(0)
                        setfare(0);
                        if (props.Seats.length===0){
                            const response= axios.post('http://127.0.0.1:8000/successful/',{pass:props.passengers,user1:localStorage.getItem('email'),people:props.people,origin:props.origin_name,dest:props.dest_name,date:props.date,flight:props.flight,Class:props.Class,age:props.age,booking_type:"random"})
                                .then((response) => {
                                    if(response.data.status==="success"){
                                        navigate('/error',{state:response.data.status})
                                    }
                                    else{
                                        if (response.data.status==="gone"){
                                            navigate('/error',{state:response.data.status})
                                        }
                                    }
                                    console.log(response.data);
                                    
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            }
                        else{
                            if (Number(Wallet)>=props.fare+200){
                                console.log(0)
                                setfare(0);
                            const response=axios.post('http://127.0.0.1:8000/successful/',{pass:props.passengers,user1:localStorage.getItem('email'),seats:props.Seats,people:props.people,origin:props.origin_name,dest:props.dest_name,date:props.date,flight:props.flight,Class:props.Class,age:props.age,booking_type:"mychoice"})
                                .then((response) => {

                                    console.log(response)
                                    if(response.data.status==="success"){
                                        navigate('/error',{state:response.data.status})
                                    }
                                    else{
                                        if (response.data.status==="gone"){
                                            navigate('/error',{state:response.data.status})
                                        }
                                    }
                                    console.log(response.data);
                                    
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            }
                        }
                        
            
                    }
                    else{
                        console.log("there")
                        console.log(Wallet)
                        if (props.Seats.length===0){
                            setfare(props.fare-Number(Wallet));
                        }
                        else{
                            setfare(props.fare-Number(Wallet)+200);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            
        },[Wallet]);
    const handleSubmit = (e) => {
        console.log(props.origin_name);
        console.log(props.dest_name);
        console.log(props.date)
        console.log(props.Class)
        console.log(props.flight)
        console.log(props.people)
        console.log(props.passengers)
        console.log(localStorage.getItem('email'))
        console.log(props.age)
        e.preventDefault();
        if (props.Seats.length===0){
            const response=axios.post('http://127.0.0.1:8000/successful/',{pass:props.passengers,user1:localStorage.getItem('email'),people:props.people,origin:props.origin_name,dest:props.dest_name,date:props.date,flight:props.flight,Class:props.Class,age:props.age,booking_type:"random"})
                .then((response) => {
                    if(response.data.status==="success"){
                        navigate('/error',{state:response.data.status})
                    }
                    else{
                        if (response.data.status==="gone"){
                            navigate('/error',{state:response.data.status})
                        }
                    }
                    console.log(response.data);
                    
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else{
            
            const response=axios.post('http://127.0.0.1:8000/successful/',{pass:props.passengers,user1:localStorage.getItem('email'),people:props.people,origin:props.origin_name,dest:props.dest_name,date:props.date,flight:props.flight,Class:props.Class,age:props.age,seats:props.Seats,booking_type:"mychoice"})
                .then((response) => {
                    if(response.data.status==="success"){
                        navigate('/error',{state:response.data.status})
                    }
                    else{
                        if (response.data.status==="gone"){
                            navigate('/error',{state:response.data.status})
                        }
                    }
                    console.log(response.data);
                    
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        
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
export default Payment;