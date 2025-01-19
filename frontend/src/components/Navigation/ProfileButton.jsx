import { useDispatch } from "react-redux";
import { signout } from "../../store/session";
import { FaUserCircle } from "react-icons/fa";
import { MdApps } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import OpenModal from "../OpenModal";
import "./ProfileButton.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  function logout(e) {
    e.preventDefault();
    dispatch(signout());
    closeMenu();
    navigateTo("/");
  }

  function toggleMenu(e) {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if (!showMenu) return;

    function closeMenu(e) {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const ulClassname = "profile-dropdown" + (showMenu ? "" : " hidden");
  return (
    <>
      <button onClick={toggleMenu} className="profile-button" data-testid="user-menu-button">
        <MdApps />
        <FaUserCircle />
      </button>
      <ul className={ulClassname} ref={ulRef} data-testid="user-dropdown-menu">
        {user ? (
          <>
            <li>Hey, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <NavLink to="/restaurants/current">Manage restaurants</NavLink>
            </li>
            <li>
              <button onClick={logout} className="logout-button">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModal itemText="Log In" onItemClick={closeMenu} modalComponent={<LoginFormModal />} />
            <OpenModal itemText="Sign Up" onItemClick={closeMenu} modalComponent={<SignupFormModal />} />
          </>
        )}
      </ul>
    </>
  );
}
