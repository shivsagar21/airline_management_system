import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Wallet(){
    let navigate=useNavigate();
    const [balance,setbalance]=useState('');
    useEffect(()=>{
        if(localStorage.getItem("email")===null) navigate('/login',{state:true});
    },[localStorage.getItem["email"]]);
    useEffect(() => {
        console.log(localStorage.getItem("email"))
        const response=axios.post('http://127.0.0.1:8000/wallet/', {id:localStorage.getItem("email")})
            .then((response) => {
                setbalance(response.data.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    },[]);
    
    return(
        <>
        <br/>
        <br/>

        <div class="container bg-light" style={{width: "90%", border_radius: "10px"}}>
            <div class="text-center">
                <br/><br/><br/><br/>
                <h1 style={{text_align:"center"}}>You've Rs. {balance} in your wallet.</h1>
                <br/>
                <br/><br/><br/><br/>
            </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        </>
    )
}