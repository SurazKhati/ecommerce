import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import image from "../../../assets/images/the-growth-of-e-commerce-platforms-with-javascript.png";
import { InputLabel, RoleSelectComponent, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input.component";
import authSvc from "../auth.service";
import LoadingComponent from "../../../components/common/loading/loading.component";
import { setloggedInUserForRedux } from "../../../reducer/user.reducer";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";
import { getRouteForRole } from "../../../utils/role-route";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const RegisterPage = () => {
  const registerDTO = Yup.object({
    name: Yup.string().min(2).max(50).required(),
    phone: Yup.string().nullable(),
    email: Yup.string().email().required(),
    address: Yup.string().nullable(),
    password: Yup.string()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,25}$/,
        "Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and be between 8-25 characters."
      )
      .required(),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Password and confirm password must match"),
    role: Yup.string().matches(/^(seller|customer)$/).default("customer"),
    image: Yup.mixed(),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerDTO),
  });

  const loggedInUser = useSelector((root: any) => root.auth.loggedInUser || null);

  useEffect(() => {
    if (loggedInUser) {
      toast.info("You are already logged in");
      navigate(getRouteForRole(loggedInUser.role));
    }
  }, [loggedInUser, navigate]);

  const applyAuthResponse = (response: any) => {
    localStorage.setItem("_at", response.result.token.token);
    localStorage.setItem("_rt", response.result.token.refreshToken);
    dispatch(setloggedInUserForRedux(response.result.userDetail));
    toast.success(`Welcome ${response.result.userDetail.role}`);
    navigate(getRouteForRole(response.result.userDetail.role));
  };

  const submitForm = async (data: any) => {
    try {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              name: data.name,
              phone: data.phone || null,
              address: data.address || null,
              role: data.role || "customer",
            },
          },
        });

        if (error) {
          throw error;
        }

        toast.success("Registration is done. Check your email to verify your account.");
        navigate("/");
      } else {
        await authSvc.postRequest("/auth/register", data, { file: true });
        toast.success("Registration is done. You can login now.");
        navigate("/login");
      }
    } catch (exception: any) {
      if (+exception?.status === 400 && exception?.data?.result) {
        Object.keys(exception.data.result).forEach((field: any) => {
          setError(field, { message: exception.data.result[field] });
        });
      }
      toast.error(exception?.data?.message || exception?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        setLoading(true);
        localStorage.setItem("_oauth_role", watch("role") || "customer");
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
        toast.error(error?.message || "Google sign up failed");
        setLoading(false);
      }
    }
  };

  const handleGoogleCredential = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign up did not return a credential");
      return;
    }

    try {
      setLoading(true);
      const response = await authSvc.postRequest("/auth/google", {
        credential: credentialResponse.credential,
        role: watch("role") || "customer",
      });
      applyAuthResponse(response);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Google sign up failed");
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src={image}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="#">
              <span className="sr-only">Home</span>
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to our family
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Join us today! Create your account to enjoy seamless shopping and exclusive offers.
            </p>

            {isSupabaseConfigured ? (
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  className="rounded-lg border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100"
                >
                  Sign up with Google
                </button>
                <p className="text-sm text-gray-500">
                  Google sign up uses the selected role below for new accounts.
                </p>
              </div>
            ) : googleClientId ? (
              <div className="mt-6 space-y-3">
                <div className="flex justify-start">
                  <GoogleLogin
                    onSuccess={handleGoogleCredential}
                    onError={() => toast.error("Google sign up failed")}
                    text="signup_with"
                    shape="pill"
                    width="320"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Google sign up uses the selected role below for new accounts.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(submitForm)} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <InputLabel htmlFor="name">Full Name</InputLabel>
                <TextInputComponent
                  name="name"
                  errMsg={errors?.name?.message as string}
                  required={true}
                  control={control}
                />
              </div>

              <div className="col-span-6">
                <InputLabel htmlFor="email">Email</InputLabel>
                <TextInputComponent
                  name="email"
                  errMsg={errors?.email?.message as string}
                  type="email"
                  required={true}
                  control={control}
                />
              </div>

              <div className="col-span-6">
                <InputLabel htmlFor="phone">Phone</InputLabel>
                <TextInputComponent
                  name="phone"
                  errMsg={errors?.phone?.message as string}
                  required={true}
                  control={control}
                  type="tel"
                />
              </div>

              <div className="col-span-6">
                <InputLabel htmlFor="role">Role</InputLabel>
                <RoleSelectComponent
                  name="role"
                  errMsg={errors?.role?.message as string}
                  required={true}
                  control={control}
                />
              </div>

              <div className="col-span-6">
                <InputLabel htmlFor="image">Profile Picture</InputLabel>
                <input
                  type="file"
                  id="image"
                  onChange={(e: any) => {
                    const selectedImage = e.target.files["0"];
                    setValue("image", selectedImage);
                  }}
                  name="image"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <InputLabel htmlFor="address">Address</InputLabel>
                <TextAreaInputComponent
                  name="address"
                  errMsg={errors?.address?.message as string}
                  required={true}
                  control={control}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextInputComponent
                  name="password"
                  errMsg={errors?.password?.message as string}
                  required={true}
                  control={control}
                  type="password"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <TextInputComponent
                  name="confirmPassword"
                  errMsg={errors?.confirmPassword?.message as string}
                  required={true}
                  control={control}
                  type="password"
                />
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <a href="#" className="text-gray-700 underline"> terms and conditions </a>
                  and
                  <a href="#" className="text-gray-700 underline">privacy policy</a>.
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className={`inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring ${loading ? "bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed" : "bg-blue-600 text-white border-blue-600 hover:bg-transparent hover:text-blue-600 active:text-blue-500"}`}
                  disabled={loading}
                >
                  {loading ? <LoadingComponent /> : "Create an account"}
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <NavLink to="/login" className="text-gray-700 underline"> Log in</NavLink>.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default RegisterPage;
