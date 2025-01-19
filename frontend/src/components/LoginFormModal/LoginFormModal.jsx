// import { useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../../store/session";
// import { useModal } from "../../context/Modal";
// import "./LoginFormModal.css";

// export default function LoginFormModal() {
//   const dispatch = useDispatch();
//   const isDisabled = useRef(true);
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

//   const handleSumbit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     const payload = {
//       credential,
//       password,
//     };
//     const data = await dispatch(login(payload));
//     data.message === "Invalid credentials" ? setErrors({ invalid: "The provided credentials were invalid." }) : closeModal();
//   };

//   const signIn = async (e) => {
//     e.preventDefault();
//     const payload = {
//       credential: "Demo-lition",
//       password: "password",
//     };
//     await dispatch(login(payload));
//     closeModal();
//   };

//   const updateStatus = () => {
//     credential.length < 4 || password.length < 6 ? (isDisabled.current = true) : (isDisabled.current = false);
//     return isDisabled;
//   };

//   return (
//     <div data-testid="login-modal">
//       <div className="headers">Log In</div>
//       <form onSubmit={handleSumbit} className="login-form">
//         <p className="error-message">{errors.invalid ? errors.invalid : ""}</p>

//         <label>Username or Email</label>
//         <input type="text" data-testid="credential-input" value={credential} onChange={({ target: { value } }) => setCredential(value)} required />

//         <label>Password</label>
//         <input type="password" data-testid="password-input" value={password} onChange={({ target: { value } }) => setPassword(value)} required />

//         <button type="submit" disabled={updateStatus().current} data-testid="login-button" className={`login-button ${isDisabled.current ? "" : "enabled"}`}>
//           Log In
//         </button>
//       </form>
//       <a href="" onClick={signIn} data-testid="demo-user-login" className="demo-user">
//         Log in as Demo User
//       </a>
//     </div>
//   );
// }

import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";
import { useModal } from "../../context/Modal";
import "./LoginFormModal.css";

export default function LoginFormModal() {
  const dispatch = useDispatch();
  const isDisabled = useRef(true);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // Centralized error handler
  const getError = (message) => {
    const errorMap = {
      "Invalid credentials": "The provided credentials were invalid.",
      "Network error": "A network error occurred. Please try again.",
    };

    return errorMap[message] || "An unexpected error occurred.";
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = {
      credential,
      password,
    };
    try {
      const data = await dispatch(login(payload));
      if (data.message) {
        setErrors({ invalid: getError(data.message) });
      } else {
        closeModal();
      }
    } catch (err) {
      setErrors({ invalid: getError("Network error") });
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    const payload = {
      credential: "Demo-lition",
      password: "password",
    };
    try {
      await dispatch(login(payload));
      closeModal();
    } catch (err) {
      setErrors({ invalid: getError("Network error") });
    }
  };

  const updateStatus = () => {
    isDisabled.current = credential.length < 4 || password.length < 6;
    return isDisabled;
  };

  return (
    <div data-testid="login-modal">
      <div className="headers">Log In</div>
      <form onSubmit={handleSumbit} className="login-form">
        <p className="error-message">{errors.invalid ? errors.invalid : ""}</p>

        <label>Username or Email</label>
        <input type="text" data-testid="credential-input" value={credential} onChange={({ target: { value } }) => setCredential(value)} required />

        <label>Password</label>
        <input type="password" data-testid="password-input" value={password} onChange={({ target: { value } }) => setPassword(value)} required />

        <button type="submit" disabled={updateStatus().current} data-testid="login-button" className={`login-button ${isDisabled.current ? "" : "enabled"}`}>
          Log In
        </button>
      </form>
      <a href="" onClick={signIn} data-testid="demo-user-login" className="demo-user">
        Log in as Demo User
      </a>
    </div>
  );
}
