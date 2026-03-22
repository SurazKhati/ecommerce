import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingComponent from "../../components/common/loading/loading.component";
import { setloggedInUserForRedux } from "../../reducer/user.reducer";
import { supabase } from "../../lib/supabase";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        if (supabase) {
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.log(error);
      } finally {
        localStorage.removeItem("_at");
        localStorage.removeItem("_rt");
        localStorage.removeItem("_oauth_role");
        dispatch(setloggedInUserForRedux(null));
        toast.success("Signed out successfully");
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [dispatch, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <LoadingComponent />
        <p className="mt-4 text-sm text-gray-500">Signing you out...</p>
      </div>
    </section>
  );
};

export default LogoutPage;
