"use client";

import React from "react";
import { Oval } from "react-loader-spinner";

interface LoaderModalProps {
  show: boolean;
}

const LoaderModal: React.FC<LoaderModalProps> = ({ show }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Oval
        height={80}
        width={80}
        color="#4fa94d"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#fff"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default LoaderModal;
