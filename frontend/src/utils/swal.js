import Swal from "sweetalert2";

// Theme Constants
const BACKGROUND_COLOR = "#ffffff";
const TEXT_COLOR = "#374151"; // gray-700
const CONFIRM_BUTTON_COLOR = "#4F46E5"; // indigo-600
const CANCEL_BUTTON_COLOR = "#EF4444"; // red-500
const CONFIRM_BUTTON_TEXT = "Yes, proceed!";
const MESSAGE_DISPLAY_TIME = 3000;

// Custom CSS classes for SweetAlert
const customStyles = `
  .custom-swal-popup {
    border-radius: 1rem !important;
    background: ${BACKGROUND_COLOR} !important;
    box-shadow: 0 8px 30px rgb(0,0,0,0.12) !important;
  }

  .custom-swal-container {
    backdrop-filter: blur(4px);
  }

  .swal2-title {
    color: ${TEXT_COLOR} !important;
    font-weight: 600 !important;
  }

  .swal2-html-container {
    color: ${TEXT_COLOR} !important;
  }

  .swal2-confirm {
    background: linear-gradient(to right, #3B82F6, #8B5CF6) !important;
    border-radius: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
    transition: all 0.2s !important;
  }

  .swal2-confirm:hover {
    transform: scale(1.02) !important;
    opacity: 0.9 !important;
  }

  .swal2-cancel {
    border-radius: 0.75rem !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
    transition: all 0.2s !important;
  }

  .swal2-cancel:hover {
    transform: scale(1.02) !important;
    opacity: 0.9 !important;
  }

  .swal2-timer-progress-bar {
    background: linear-gradient(to right, #3B82F6, #8B5CF6) !important;
  }

  .swal2-success-circular-line-left,
  .swal2-success-circular-line-right,
  .swal2-success-fix {
    background: transparent !important;
  }

  .swal2-toast {
    background: linear-gradient(to right, #3B82F6, #8B5CF6) !important;
    border-radius: 0.75rem !important;
    color: white !important;
  }

  .swal2-toast .swal2-title,
  .swal2-toast .swal2-html-container {
    color: white !important;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

// Alert functions
export const errorDisplay = (error) => {
  Swal.fire({
    background: BACKGROUND_COLOR,
    color: TEXT_COLOR,
    icon: "error",
    title: "Oops...",
    confirmButtonColor: BACKGROUND_COLOR,
    text: titleCase(error),
    customClass: {
      popup: "custom-swal-popup",
      container: "custom-swal-container",
    },
  });
};

export const successDisplay = (msg = "Success!", position = null) => {
  let alertBody = {
    icon: "success",
    background: BACKGROUND_COLOR,
    color: TEXT_COLOR,
    title: "Success",
    text: titleCase(msg),
    showConfirmButton: false,
    timer: MESSAGE_DISPLAY_TIME,
    customClass: {
      popup: "custom-swal-popup",
      container: "custom-swal-container",
    },
  };

  if (position) alertBody.position = position;

  Swal.fire(alertBody);
};

export const successToaster = (msg = "Success!") => {
  const Toast = Swal.mixin({
    toast: true,
    background: BACKGROUND_COLOR,
    color: TEXT_COLOR,
    position: "top-end",
    showConfirmButton: false,
    timer: MESSAGE_DISPLAY_TIME,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    text: msg,
  });
};

export const failureToaster = (msg) => {
  const Toast = Swal.mixin({
    toast: true,
    background: BACKGROUND_COLOR,
    color: TEXT_COLOR,
    position: "top-end",
    showConfirmButton: false,
    timer: MESSAGE_DISPLAY_TIME,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    text: msg,
  });
};

export const confirmationAlert = (onConfirmation) => {
  const alertConfig = {
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: CONFIRM_BUTTON_COLOR,
    cancelButtonColor: CANCEL_BUTTON_COLOR,
    confirmButtonText: CONFIRM_BUTTON_TEXT,
    customClass: {
      popup: "custom-swal-popup",
      container: "custom-swal-container",
    },
  };

  Swal.fire(alertConfig).then((result) => {
    if (result.isConfirmed) {
      onConfirmation();
    }
  });
};

// Helper function for title case
const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
