import "./SignupForm.css";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { signup } from "../../store/session";
import { useModal } from "../../context/Modal";

export default function SignupFormModal() {
  const dispatch = useDispatch();
  const isDisabled = useRef(true);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const getErrors = (e) => {
    e.preventDefault();
    const errors = {};
    if (password !== confirmPassword) errors.password = "Provided passwords do not match.";
    if (!email.includes("@")) errors.email = "Provided email is invalid.";
    Object.values(errors).length === 0 ? handleSubmit() : setErrors(errors);
  };

  const updateStatus = () => {
    !(firstName && lastName && email && username.length > 3 && password.length > 5 && confirmPassword.length > 5) ? (isDisabled.current = true) : (isDisabled.current = false);
    return isDisabled;
  };

  const handleSubmit = async () => {
    const payload = {
      firstName: firstName[0].toUpperCase() + firstName.slice(1),
      lastName: lastName[0].toUpperCase() + lastName.slice(1),
      email,
      username,
      password,
    };

    const data = await dispatch(signup(payload));

    if (!data.errors) {
      closeModal();
    }
    setErrors(data.errors);
  };

  return (
    <div className="form-box" data-testid="sign-up-form">
      <div className="headers">Sign up</div>
      <form onSubmit={getErrors} className="signup-form">
        {errors.email && (
          <p className="errors message" data-testid="email-error-message">
            {errors.email}
          </p>
        )}
        {errors.username && (
          <p className="errors message" data-testid="username-error-message">
            {errors.username}
          </p>
        )}
        {errors.password && <p className="errors message">{errors.password}</p>}

        <label>First Name</label>
        <input type="text" data-testid="first-name-input" value={firstName} onChange={({ target: { value } }) => setFirstName(value)} />

        <label>Last Name</label>
        <input type="text" data-testid="last-name-input" value={lastName} onChange={({ target: { value } }) => setLastName(value)} />

        <label>Email</label>
        <input type="text" data-testid="email-input" value={email} onChange={({ target: { value } }) => setEmail(value)} />

        <label>Username</label>
        <input type="text" data-testid="username-input" value={username} onChange={({ target: { value } }) => setUsername(value)} />

        <label>Password</label>
        <input type="password" data-testid="password-input" value={password} onChange={({ target: { value } }) => setPassword(value)} />

        <label>Confirm Password</label>
        <input type="password" data-testid="confirm-password-input" value={confirmPassword} onChange={({ target: { value } }) => setConfirmPassword(value)} />

        <button type="submit" data-testid="form-sign-up-button" className={`signup-button ${isDisabled.current ? "" : "enabled"}`} disabled={updateStatus().current}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
