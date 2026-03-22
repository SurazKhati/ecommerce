import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "flowbite-react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { InputLabel, TextInputComponent } from "../../../components/common/form/input.component";
import { Heading2 } from "../../../components/common/title/title";
import LoadingComponent from "../../../components/common/loading/loading.component";
import authSvc from "../auth.service";
import { setloggedInUserForRedux } from "../../../reducer/user.reducer";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

const LoginPage = () => {
  const schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((root: any) => root.auth.loggedInUser || null);

  useEffect(() => {
    if (loggedInUser) {
      toast.info("You are already logged in");
      navigate(`/${loggedInUser.role}`);
    }
  }, [loggedInUser, navigate]);

  const applyAuthResponse = (response: any) => {
    localStorage.setItem("_at", response.result.token.token);
    localStorage.setItem("_rt", response.result.token.refreshToken);
    dispatch(setloggedInUserForRedux(response.result.userDetail));
    toast.success(`Welcome ${response.result.userDetail.role}`);
    navigate(`/${response.result.userDetail.role}`);
  };

  const login = async (data: any) => {
    try {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error || !authData.session) {
          throw error || new Error("Login failed");
        }

        localStorage.setItem("_at", authData.session.access_token);
        localStorage.setItem("_rt", authData.session.refresh_token);

        const profileResponse: any = await authSvc.getRequest("/auth/me", { auth: true });
        dispatch(setloggedInUserForRedux(profileResponse.result));
        toast.success(`Welcome ${profileResponse.result.role}`);
        navigate(`/${profileResponse.result.role}`);
      } else {
        const response = await authSvc.postRequest("/auth/login", data);
        applyAuthResponse(response);
      }
    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured");
      return;
    }

    try {
      setLoading(true);
      localStorage.removeItem("_oauth_role");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error?.message || "Google login failed");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Heading2 value="Welcome Back 👋" />
          <p className="mt-2 text-sm text-gray-500">
            Login to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(login)} className="space-y-4">
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

          <div className="flex justify-between text-sm">
            <NavLink to="/forget-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </NavLink>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            {loading ? <LoadingComponent size="sm" /> : "Login"}
          </Button>
        </form>

        <div className="my-5 flex items-center">
          <div className="h-px flex-grow bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="h-px flex-grow bg-gray-300"></div>
        </div>

        {isSupabaseConfigured ? (
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-lg border border-gray-300 py-2 transition hover:bg-gray-100"
          >
            Continue with Google
          </button>
        ) : (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable Supabase auth.
          </p>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Admin: admin@demo.com / Admin@123
        </p>

        <p className="mt-5 text-center text-sm text-gray-500">
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
