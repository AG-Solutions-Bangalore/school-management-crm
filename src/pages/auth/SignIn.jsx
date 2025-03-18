import { Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import BASE_URL from "../../base/BaseUrl";
import CrmLogo from "../../assets/Companylogo/ppvn-logo.png";
import { toast } from "sonner";
import { CreateButton } from "../../components/common/ButttonConfig";
import { Eye, EyeOff } from "lucide-react";
import { loginSuccess } from "../../redux/store/authSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
      if (res.data.code === 200) {
        const token = res.data.UserInfo?.token;
        const default_year = res.data.school_detils.school_default_year;
        const allUser = res.data?.userN;

        if (token && default_year) {
          const userData = {
            token,
            user: res.data.UserInfo.user,
            default_year,
            user_position: res.data.UserInfo.user.user_position,
            user_type: res.data.UserInfo.user.user_type,
            token_expire_time: res.data.UserInfo.token_expires_at,
            allUsers: allUser,
          };

          dispatch(loginSuccess(userData));

          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
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
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="hidden lg:block lg:w-[50%] xl:block xl:w-[70%] h-full">
        <img
          src="https://img.freepik.com/free-vector/large-school-building-scene_1308-32058.jpg"
          alt="img 1"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg shadow-blue-600">
          <div className="flex justify-center mb-4">
            <img src={CrmLogo} alt="Company Logo" className="w-35 h-35" />
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

            <div className="mt-3">
              <FormLabel required>Password</FormLabel>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-10`}
                  required
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button className={CreateButton} type="submit" disabled={loading}>
                {loading ? "Checking..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="text-end mt-4" onClick={handleForgetPasswordClick}>
            <Link className="text-sm text-gray-700 hover:text-indigo-600">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
