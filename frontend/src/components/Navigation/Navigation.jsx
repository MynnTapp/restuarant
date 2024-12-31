import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { createSelector } from "reselect";

const spotsSelector = createSelector([(state) => state.session], (session) => session.user);

export default function Navigation({ isLoaded }) {
  const sessionUser = useSelector(spotsSelector);
  console.log(sessionUser);
  return (
    <ul className="nav-box">
      <li className="image-box">
        <NavLink data-testid="logo" to="/">
          <img src="https://www.dbackdrop.com/cdn/shop/files/M5-151.jpg?v=1684748585" className="logo-image" />
        </NavLink>
      </li>
      <li className="welcome">Welcome to Pink life of Airbnb</li>
      {isLoaded && (
        <>
          <span
            style={{
              display: sessionUser ? "block" : "none",
              position: "relative",
              left: "12.5vw",
            }}
          >
            <NavLink to="/spots/new" data-testid="create-new-spot-button">
              Create a New Spot
            </NavLink>
          </span>
          <li className="profile-box">
            <ProfileButton user={sessionUser} />
          </li>
        </>
      )}
    </ul>
  );
}
