import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";
import { removeSpot } from "../../store/spots";

export default function DeleteSpotModal({ id }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const handleDeletion = async (e) => {
    e.preventDefault();
    dispatch(removeSpot(id));
    closeModal();
  };
  return (
    <>
      <h2>Confirm Delete</h2>
      <h5>Are you sure you want to remove this restaurant?</h5>
      <button onClick={handleDeletion}>Yes </button>
      <button onClick={() => closeModal()}>No </button>
    </>
  );
}
