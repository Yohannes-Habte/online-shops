import { Helmet } from "react-helmet-async";
import Register from "../../../features/register/Register";
import "./RegisterPage.scss";

const RegisterPage = () => {
  return (
    <main className="register-page">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <section className="register-page-container">
        <h1 className="register-page-title">Create Account for Free</h1>

        <Register />
      </section>
    </main>
  );
};

export default RegisterPage;
