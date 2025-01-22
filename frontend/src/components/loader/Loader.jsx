import { Oval } from "react-loader-spinner";
import "./Loader.scss";

const Loader = ({ isLoading, message = "Loading...", size = 24 }) => {
  if (!isLoading) return null; // Do not render the spinner if not loading

  return (
    <div className="page-loader">
      <Oval
        height={size}
        width={size}
        color="#4fa94d"
        secondaryColor="#4fa94d"
        strokeWidth={4}
        strokeWidthSecondary={4}
        visible={true}
        ariaLabel="oval-loading"
      />
      <span className="loader-message">{message}</span>
    </div>
  );
};

export default Loader;
