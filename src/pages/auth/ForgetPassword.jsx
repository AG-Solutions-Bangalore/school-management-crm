import { Input, Button, Typography } from "@material-tailwind/react";
import { toast } from "sonner";
import BASE_URL, { LoginImageUrl } from "../../base/BaseUrl";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormLabel } from "@mui/material";
import logo from "../../assets/Companylogo/dfc.png";
import logo1 from "../../assets/Companylogo/logo1.jpg";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/panel-send-password?username=${username}&email=${email}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("New Password Sent to your Email");
      } else {
        toast.error("Email not sent. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Image */}
        <div className="hidden  lg:block lg:w-[50%] xl:block xl:w-[70%] h-full">
          <img
            src="https://img.freepik.com/free-vector/large-school-building-scene_1308-32058.jpg"
            alt="img 1"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
          <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg  shadow-blue-600 ">
            <div className="flex justify-center mb-4">
              <img
                src={`${LoginImageUrl}/ppvn.png`}
                alt="Logo"
                className="w-35 h-35"
              />
            </div>
            <Typography
              variant="h6"
              className="text-center font-bold mb-6 text-blue-gray-800"
            >
              Reset Password
            </Typography>
            <form onSubmit={onResetPassword} className="space-y-6">
              <div>
                <FormLabel required>Username</FormLabel>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Email</FormLabel>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  type="submit"
                >
                  Reset Password
                </button>
              </div>
            </form>
            <div className="text-end mt-4" onClick={() => navigate("/")}>
              <Link className="text-sm text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
