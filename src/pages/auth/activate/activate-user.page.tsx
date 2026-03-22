import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../components/common/loading/loading.component";
import { toast } from "react-toastify";
import authSvc from "../auth.service";
import { MessageConstants } from "../../../config/constants";
import { Button, Modal } from "flowbite-react";

const UserActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [counter, setCounter] = useState(10);

  const hasActivatedRef = useRef(false);
  const intervalRef = useRef(null);

  // ✅ Activate User
  const activateUser = async () => {
    try {
      await authSvc.getRequest(`/auth/activate/${token}`);
      setMessage("Your account has been successfully activated. Please login to continue.");
      toast.success("Account activated successfully!");
    } catch (exception) {
      if (
        exception.status === 422 &&
        exception.data.message === MessageConstants.TOKEN_EXPIRED
      ) {
        setOpenModal(true);
        toast.error("Activation link expired");
      } else {
        toast.error(exception?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
      startTimer();
    }
  };

  // ✅ Start countdown safely
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ✅ Resend Token
  const resendToken = async () => {
    try {
      setBtnLoading(true);
      await authSvc.getRequest(`/auth/resend-activationtoken/${token}`);
      toast.success("A new activation link has been sent to your email.");
      setMessage("A new activation link has been sent. Please check your email.");
    } catch (error) {
      toast.error("Error sending activation token");
    } finally {
      setBtnLoading(false);
      setOpenModal(false);
      startTimer();
    }
  };

  // ✅ Run once only
  useEffect(() => {
    if (!hasActivatedRef.current) {
      hasActivatedRef.current = true;
      activateUser();
    }
  }, []);

  // ✅ Cleanup interval (important!)
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <section className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-8 text-center">

          {loading ? (
            <LoadingComponent />
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Account Activation
              </h2>

              <p className="text-gray-700 mb-6">{message}</p>

              <p className="text-sm text-gray-500">
                Redirecting to login in{" "}
                <span className="font-bold text-black">{counter}</span> seconds...
              </p>
            </>
          )}
        </div>
      </section>

      {/* MODAL */}
      <Modal show={openModal} dismissible={false}>
        <Modal.Header theme={{ close: { base: "hidden", icon: "hidden" } }}>
          Token Expired
        </Modal.Header>

        <Modal.Body>
          <p className="text-gray-600">
            Your activation link has expired. Click below to receive a new one.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={resendToken} disabled={btnLoading}>
            {btnLoading ? <LoadingComponent size="sm" /> : "Resend Token"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserActivation;