import { useState } from "react";
import "./Register.css"; 
import { supabase } from "../supabase/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingStatus(true)

    // Do your validations here
    if(password !== confirmPassword){
      alert("Passwords do not match");
      setLoadingStatus(false)
      return;
    }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options:{
            data: {
              // add additional data here            
            }
          }
        })

        if (error){
          throw error
        }

        // check for user email uniqueness
        if (data?.user?.identities?.length === 0) {
          alert("Email already registered. Please try a different email.");
          setLoadingStatus(false);
          return;
        }

        console.log("User data:",data);
        alert("Sign up successful! Check your email for the verification link") // route them to Login Page
    } catch (error) {
      console.log("Error signing up:", error)
      // @ts-expect-error("allow")
      alert(`Error: ${error?.message}`);
      setLoadingStatus(false);
    } finally {
      setLoadingStatus(false);
    }
  };
  return (
    <div className="registerPage">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            required
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            required
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {loadingStatus ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;