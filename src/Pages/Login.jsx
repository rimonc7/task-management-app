import { useContext } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPublic from "../Hook/useAxiosPublic";
import Swal from "sweetalert2";

const Login = () => {
  const { loginWithGoogle, setErrorMessage } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const axiosPublic = useAxiosPublic();

  const handleGoogleLogin = () => {
    setErrorMessage("");
    loginWithGoogle()
      .then((userCredential) => {
        const userInfo = {
          name: userCredential.user?.displayName,
          email: userCredential.user?.email,
        };
        axiosPublic.post("/users", userInfo).then((res) => {
          if (res.data.insertedId) {
            Swal.fire({
              title: "Success",
              icon: "success",
              draggable: true,
            });
            navigate(from, { replace: true });
          }
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sign In</h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md"
        >
          <FaGoogle size={20} className="mr-2" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
