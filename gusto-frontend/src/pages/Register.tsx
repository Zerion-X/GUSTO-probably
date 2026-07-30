import { Link } from "react-router-dom";

export default function Register() {

    return(
   <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "52px", marginBottom: "20px" }}>
        <Link to="/login" style={{ textDecoration: "none", color: "black", backgroundColor: "lightgreen", padding: "25px", borderRadius: "8px" }}>
          Login       
        </Link>
      </h1>

      <p>Don't have an account?</p>

      <Link  to="/signup"  style={{ fontWeight: "bold"}}>Signup</Link>
    </div>
    );
}