import { Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import CrmLogo from "../../assets/Companylogo/ppvn-logo.png"
import { toast } from "sonner";
import { ContextPanel } from "../../context/ContextPanel";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {fetchYears}= useContext(ContextPanel)
  const navigate = useNavigate();
  const handleForgetPasswordClick = () => {
    navigate("/forget-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
  
    try {
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);
  
      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        const default_year = res.data.school_detils.school_default_year;
  
        if (token && default_year) {
          localStorage.setItem("token", token);
          localStorage.setItem("default_year", default_year);
          localStorage.setItem("id", res.data.UserInfo.user.id);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("user_position", res.data.UserInfo.user.user_position);
          localStorage.setItem("user_type", res.data.UserInfo.user.user_type);
  
          
            await fetchYears(); 
            navigate("/home");
        
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }
  
    setLoading(false);
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
        {/* ppvn-logo  */}
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
                src={CrmLogo}
                alt="Company Logo"
                className="w-35 h-35"
              />
            </div>

            <Typography
              variant="h6"
              className="text-center font-bold mb-6 text-blue-gray-800"
            >
              Sign into your account
            </Typography>
            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
              <div>
                <FormLabel required>Username</FormLabel>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Password</FormLabel>
                <input
                  type="password"
                  name="email"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex justify-center ">
                <button
                  className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  type="submit"
                  disabled={loading}
                >
                  {" "}
                  {loading ? "Checking..." : "Sign In"}
                </button>
              </div>
            </form>
            <div className="text-end mt-4" onClick={handleForgetPasswordClick}>
              <Link className="text-sm text-gray-700 hover:text-blue-600">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
