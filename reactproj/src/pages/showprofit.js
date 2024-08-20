
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useLocation } from "react-router-dom";

export default function Showprofit(props) {
   const [openDialog, handleDisplay] = React.useState(false);
    let location=useLocation();
   const handleClose = () => {
      handleDisplay(false);
   };

   React.useEffect(() => {
      handleDisplay(true);
   },[]);
   const dialogStyle = {
      padding: "20px",
   };
   
   return (
      <>
         <Dialog onClose = {handleClose} open = {openDialog}>
            <DialogTitle> Profit gained </DialogTitle>
            <h3 style = {dialogStyle}>
            The profit earned by the airline from {location.state['from']} till {location.state['to']} is {location.state['profit']}
            </h3>
         </Dialog>
      </>
   );
}
