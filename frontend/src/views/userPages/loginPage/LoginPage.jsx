import { Helmet } from "react-helmet-async";
import Login from "../../../features/login/Login";
import "./LoginPage.scss";

const LoginPage = () => {
  return (
    <main className="login-page">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <section className="login-page-container">
        <h1 className="login-page-title"> Welcome to your Account</h1>

        <Login />
      </section>
    </main>
  );
};

export default LoginPage;