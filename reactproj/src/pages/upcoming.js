import React,{useState, useEffect} from "react"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Upcoming_journey(props){
    const custom={
        textAlign: "center",
        fontFamily: 'Arial, Helvetica, sans-serif',
    }
    const custom1={
        width: "80%",
        padding: "1%",
    }
    const custom2={
        padding: "2%",
        borderRadius: "10px",
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tickets, setticket] = useState([]);
    let navigate=useNavigate();
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem["email"]]);
    
    const fetchticket = async () => {
        setEmail(localStorage.getItem("email"))
        if(localStorage.getItem("email")!==null) {const response = await axios.get(`http://127.0.0.1:8000/book/?email=${localStorage.getItem("email")}`);
        setticket(response.data.students);
                
        };
        console.log(email)
        }
        useEffect(() => {
        fetchticket();
    }, []);
    
    return (
        <>

        <br />

        <div class="container bg-light" style={custom2}>

        <hr />

        <h2 style={{custom}}>Your Upcoming Trips:</h2>
        <br />
        <div class="tickets">
            <center>
            <div class="list-group" style={{width: "50%"}}>
            {tickets.map((ticket)=>(
                <>
                <Link to={`/myticket`} state={ticket.id} class="list-group-item list-group-item-action list-group-item-danger">
                Ticket Booking ID { ticket.id }<br />
                Trip on : { ticket.date }
                </Link>
                <hr />
                </>
            ))}
            </div>
            </center>
        </div>
        </div>
        </>
        );
}
export default Upcoming_journey;
