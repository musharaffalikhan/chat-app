import { toast } from "react-toastify";

const notify = (error, msg, autoClose = 2000) => {
  if (error) {
    return toast.error(msg, {
      position: "top-center",
      autoClose: autoClose,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#F75D59",
        color: "white",
        borderRadius: "10px",
        margin: "10px",
      },
    });
  } else {
    return toast.success(msg, {
      position: "top-center",
      autoClose: autoClose,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        background: "#027A48",
        color: "white",
        borderRadius: "10px",
        margin: "10px",
      },
    });
  }
};

export default notify;
