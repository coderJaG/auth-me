import { useDispatch } from "react-redux";
import { deleteASpot } from "../../store/spots";
import { useModal } from "../context/Modal";
import { useState } from "react";



const DeleteSpotModal  = ({spotId})=> {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const [errors, setErrors] = useState({})

    const handleYesClick = async (e)=>{
        e.preventDefault()
        return dispatch(deleteASpot(spotId))
        .then(()=>closeModal())
        .catch(
            async (res) => {
              const data = await res.json();
              if (data?.errors) setErrors(data.errors);
            }
          );
    }

    const handleNoClick = (e) => {
        e.preventDefault(); 
        closeModal();      
      };

    return (
        <div>
        <h3> Confirm Delete</h3>
        <p>Are you sure you want to remove this spot from the listings</p>
        <button onClick={handleYesClick}>Yes</button>
        <button onClick={handleNoClick}>No</button>
        </div>
    )

}


export default DeleteSpotModal;