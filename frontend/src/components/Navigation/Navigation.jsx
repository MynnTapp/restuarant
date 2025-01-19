import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { createSelector } from "reselect";

const spotsSelector = createSelector([(state) => state.session], (session) => session.user);

export default function Navigation({ isLoaded }) {
  const sessionUser = useSelector(spotsSelector);
  return (
    <ul className="nav-box">
      <li className="image-box">
        <NavLink data-testid="logo" to="/">
          <img src="https://static.wixstatic.com/media/81e2b1_3ec4c4d91eda4ac6a9ac11cb919a3995~mv2.png" className="logo-image" />
        </NavLink>
      </li>
      <li className="welcome">Welcome to Restuarant rater and creator!</li>
      {isLoaded && (
        <>
          <span
            style={{
              display: sessionUser ? "block" : "none",
              position: "relative",
              left: "12.5vw",
            }}
          >
            <NavLink to="/restaurants/new" data-testid="create-new-spot-button">
              <div>Eaten at a new Restaurant?</div>
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
