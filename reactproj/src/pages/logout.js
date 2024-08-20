import { useEffect } from "react";
import { NavLink,useNavigate } from "react-router-dom";

const LogoutForm = () => {
  
  const navigate=useNavigate();
  
  useEffect((e)=>{
    e.preventDefault();
    navigate('/login');
  },[])
}
export default LogoutForm;
