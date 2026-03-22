import { useForm } from "react-hook-form";
import { InputLabel, TextInputComponent } from "../../../components/common/form/input.component";
import { Heading2 } from "../../../components/common/title/title";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import authSvc from "../auth.service";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../components/common/loading/loading.component";
import { useDispatch, useSelector } from "react-redux";
import { setloggedInUserForRedux } from "../../../reducer/user.reducer";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const LoginPage = () => {

  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required")
  });

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((root:any) => root.auth.loggedInUser || null);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (loggedInUser) {
      toast.info("You are already logged in");
      navigate(`/${loggedInUser.role}`);
    }
  }, [loggedInUser]);

  // ✅ Login Handler
  const login = async (data) => {
    try {
      setLoading(true);

      const response = await authSvc.postRequest("/auth/login", data);

      localStorage.setItem("_at", response.result.token.token);
      localStorage.setItem("_rt", response.result.token.refreshToken);

      dispatch(setloggedInUserForRedux(response.result.userDetail));

      toast.success(`Welcome ${response.result.userDetail.role}`);
      navigate(`/${response.result.userDetail.role}`);

    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Login failed. Check backend is running.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const applyAuthResponse = (response:any) => {
    localStorage.setItem("_at", response.result.token.token);
    localStorage.setItem("_rt", response.result.token.refreshToken);
    dispatch(setloggedInUserForRedux(response.result.userDetail));
    toast.success(`Welcome ${response.result.userDetail.role}`);
    navigate(`/${response.result.userDetail.role}`);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google login did not return a credential");
      return;
    }

    try {
      setLoading(true);
      const response = await authSvc.postRequest("/auth/google", {
        credential: credentialResponse.credential
      });
      applyAuthResponse(response);
    } catch (error:any) {
      toast.error(error?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <Heading2 value="Welcome Back 👋" />
          <p className="text-gray-500 text-sm mt-2">
            Login to your account to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(login)} className="space-y-4">

          {/* Email */}
          <div>
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextInputComponent
              name="email"
              type="email"
              placeholder="Enter your email"
              control={control}
              errMsg={errors?.email?.message}
            />
          </div>

          {/* Password */}
          <div>
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextInputComponent
              name="password"
              type="password"
              placeholder="Enter your password"
              control={control}
              errMsg={errors?.password?.message}
            />
          </div>

          {/* Options */}
          <div className="flex justify-between text-sm">
            <NavLink to="/forget-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </NavLink>
          </div>

          {/* Button */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            {loading ? <LoadingComponent size="sm" /> : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        {googleClientId ? (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              text="continue_with"
              shape="pill"
              width="320"
            />
          </div>
        ) : (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Add `VITE_GOOGLE_CLIENT_ID` to enable Google login.
          </p>
        )}

        {/* Admin demo */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Admin: admin@demo.com / Admin@123
        </p>

        {/* Register */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don’t have an account?{" "}
          <NavLink to="/register" className="text-blue-600 hover:underline">
            Register
          </NavLink>
        </p>

      </div>
    </section>
  );
};

export default LoginPage;
