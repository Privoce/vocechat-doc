import React, { useEffect } from "react";
import Footer from "@theme-original/Footer";

export default function FooterWrapper(props) {
  useEffect(() => {
    // 加载vocechat widget
    const script = document.createElement("script");
    script.setAttribute("data-origin", "https://privoce.voce.chat");
    script.src = "https://privoce.voce.chat/widget.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <Footer {...props} />
    </>
  );
}
