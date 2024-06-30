import React, { useEffect } from "react";
import Footer from "@theme-original/Footer";

export default function FooterWrapper(props) {
  useEffect(() => {
    // 加载 vocechat widget
    const script = document.createElement("script");
    script.setAttribute("data-id", "vocechat-doc");
    script.setAttribute("data-auto-reg", "true");
    script.setAttribute("data-theme-color", "#333");
    if (navigator.language === "zh-CN") {
      script.setAttribute(
        "data-welcome",
        `欢迎来到 VoceChat 官方文档站点，如果您有任何问题，请<a href="mailto:han@privoce.com">联系我们</a>。`
      );
    } else {
      script.setAttribute(
        "data-welcome",
        `Welcome to VoceChat official document site, if you have any questions, please <a href="mailto:han@privoce.com">contact us</a>.`
      );
    }

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
