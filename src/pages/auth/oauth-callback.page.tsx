import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/common/loading/loading.component";
import authSvc from "./auth.service";
import { setloggedInUserForRedux } from "../../reducer/user.reducer";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { getRouteForRole } from "../../utils/role-route";

const OAuthCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      if (!isSupabaseConfigured || !supabase) {
        toast.error("Supabase is not configured");
        navigate("/login");
        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          throw error || new Error("Session not found");
        }

        localStorage.setItem("_at", data.session.access_token);
        localStorage.setItem("_rt", data.session.refresh_token);

        const role = localStorage.getItem("_oauth_role");
        if (role) {
          localStorage.removeItem("_oauth_role");
        }

        const response: any = await authSvc.postRequest(
          "/auth/profile/sync",
          role ? { role } : {},
          { auth: true }
        );

        dispatch(setloggedInUserForRedux(response.result));
        toast.success(`Welcome ${response.result.role}`);
        navigate(getRouteForRole(response.result.role));
      } catch (error: any) {
        console.log(error);
        toast.error(error?.message || "OAuth sign in failed");
        navigate("/login");
      }
    };

    completeSignIn();
  }, [dispatch, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <LoadingComponent />
        <p className="mt-4 text-sm text-gray-500">Completing sign in...</p>
      </div>
    </section>
  );
};

export default OAuthCallbackPage;
