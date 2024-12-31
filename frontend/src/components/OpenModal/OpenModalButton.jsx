import { useRef } from "react";
import { useModal } from "../../context/Modal";
import "./OpenModalButton.css";
import { useSelector } from "react-redux";

export default function OpenModal({ modalComponent, itemText, buttonText, onItemClick, onButtonClick, onModalClose }) {
  const { setModalContent, setOnModalClose } = useModal();
  const isDisabled = useRef(true);
  const user = useSelector((state) => state.session.user);

  const handleClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onItemClick === "function") onItemClick();
  };

  const setStatus = () => {
    user ? (isDisabled.current = false) : (isDisabled.current = true);
    return isDisabled;
  };

  return !itemText ? (
    <button onClick={handleClick} data-testid="review-button" className={`modal-button ${isDisabled.current ? "" : "enabled"}`} disabled={setStatus().current}>
      {buttonText}
    </button>
  ) : (
    <li onClick={handleClick}>{itemText}</li>
  );
}
