import React,{useState, useEffect} from "react"
import axios from "axios";
import { NavLink,useNavigate, useParams } from "react-router-dom";
import './search.css';
import { useLocation } from 'react-router-dom';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

function Mybooking(props){
    const [openDialog, handleDisplay] = useState(false);
    const [ticket,setticket]=useState('');
    const [passengers,setpass]=useState([]);
    const [tra_age,setage]=useState([]);
    const [seats,setseat]=useState([]);
    const [flight,setflight]=useState('');
    const [Class,setClass]=useState('');
    const [confirm,setconfirm]=useState(false);
    const [type,settype]=useState('');
    const [time,settime]=useState('');
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem["email"]]);
    const location=useLocation();
    let navigate=useNavigate();
    const Modify=()=>{
        const modify=async()=>{
        console.log(ticket.Num_trav)
        navigate('/modify',{state:[location.state,ticket.Num_trav,ticket.fare]})
        }
        modify();
    }
    useEffect(() => {
        const fetchticket = async () => {
            console.log(props.origin_name)
            //if (ticket_id) {
                const response = await axios.get(`http://127.0.0.1:8000/booking/?id=${location.state}`);
                setticket(response.data.ticket);
                setpass(response.data.traveller);
                setage(response.data.age);
                setseat(response.data.seats);
                setflight(response.data.flight);
                setClass(response.data.Class);
                settime(response.data.time);
            //}
        };
        fetchticket();
    },[props.ticket_id]);
    function Cancel(){
        
        console.log(openDialog)
        const Cancel_tick = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/cancel/?id=${location.state}`);
            navigate('/index');
            }
        console.log(openDialog);
        Cancel_tick();
        
    }
    const dialog=(e)=>{
        setconfirm(e);
        console.log(e)
        handleDisplay(false);
        console.log(e)
        if (e==="true"){
            (type==='modify')?Modify():Cancel();
        }
        console.log(confirm);
    }
    function opendialog(type){
        settype(type);
        console.log(type)
        handleDisplay(true);
        console.log(confirm);
    }
    
    
    const dialogStyle = {
            padding: "20px",
    };
        
    return (
        <>
            <Dialog close = {!openDialog} open = {openDialog}>
            <DialogTitle> Confirmation Box </DialogTitle>
            <h5 style = {dialogStyle}>
                You'll be charged 10% of your fare as penalty.<br/>Are you sure you want to continue?
            </h5>
            <div style={{whiteSpace:"nowrap"}}>
            <button type="button" className='btn btn-primary flex-row-reverse' style={{width:'49%',display:"inline",paddingLeft:"100px"}} value={"true"} onClick={(e)=>dialog(e.target.value)}>Yes</button>
            <button type="button" className='btn btn-primary flex-row-reverse' style={{width:'49%',display:"inline",float: 'right'}} value={"false"} onClick={(e)=>dialog(e.target.value)}>No</button>
            </div>
            </Dialog>
            <div className="top-content">
                <div className="inner-bg" style={{ padding: "0px 0px 80px 0" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="form-box">
                                    <form className='ad'>
                                        <div className="form-top">
                                            <div className="form-top-left">
                                                <h2 className="text-center">Ticket details</h2>
                                            </div>
                                            <div className="form-top-right">
                                                <i className="fa fa-plane"></i>
                                            
                                            </div>
                                        
                                        </div>
                                        <div className="row">
                                            <div className="col-mid-6">
                                                
                                            <p style={{ display: "inline",paddingLeft:"200px",color:"black" }}>PNR Number : {ticket.id}</p>
                                            <p style={{ display: "inline",paddingLeft:"400px",color:"black" }}>Date of Travel : {ticket.date}</p>
                                            <p style={{ display: "inline",paddingLeft:"400px",color:"black" }}>Flight ID : { flight.id }</p>
                                            
                                            </div>
                                            <div id="container1" style={{ whiteSpace: "nowrap" }}>
                                            <p style={{ display: "inline",paddingLeft:"200px",color:"black" }}>To : {flight.dest_name}</p>
                                            <p style={{ display: "inline",paddingLeft:"410px",color:"black" }}>Departure Time : {flight.start}</p>
                                            <p style={{ display: "inline",paddingLeft:"400px",color:"black" }}>From : {flight.origin_name}</p>
                                                    
                                            </div>
                                            <div id="container2" style={{ whiteSpace: "nowrap" }}>
                                                <p style={{ display: "inline",paddingLeft:"200px",color:"black" }}>Arrival Time : {flight.end}</p>
                                                <p style={{ display: "inline",paddingLeft:"400px",color:"black" }}>Class : {Class}</p>
                                                <p style={{ display: "inline",paddingLeft:"400px",color:"black" }}> Fare : {ticket.fare}</p>
                                            </div>
                                        </div>
                                        <table>
                                            <thead>
                                            <br/>
                                                
                                                <tr>
                                                    <th>Serial no</th>
                                                    <th>Passenger name</th>
                                                    <th>Age</th>
                                                    <th>Seat no</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    {passengers.map((passenger,index)=>(
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            
                                                            <td>{passenger}</td>
                                                            <td>{tra_age[index]}</td>
                                                            <td>{seats[index]}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                        <button type = "button"  hidden={time==="timeerror"?true:false}onClick={()=>opendialog('cancel')}>Cancel</button>
                                        <button type = "button" hidden={time==="timeerror"?true:false}onClick={()=>opendialog('modify')}>Modify </button>
                                    </form >
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>

    );
}
export default Mybooking;