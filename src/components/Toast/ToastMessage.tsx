import React from "react";
import { toast } from "react-toastify";

export const ToastMessage = ({
  type,
  message,
}: {
  type: string;
  message: string;
}) =>
  toast[type](
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
        {message}
      </div>
    </div>
  );

export const notify = (type: string, message: string) =>
  ToastMessage({ type, message });
