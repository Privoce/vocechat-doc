import React from "react";
const downloads = [
  {
    title: "download Android APP from Google Play",
    icon: `/img/icon.app.google.play.png`,
    alt: "Google Play Icon",
    link: "https://play.google.com/store/apps/details?id=com.privoce.vocechatclient",
  },
  {
    title: "download Android APP from APK file",
    icon: `/img/icon.app.apk.png`,
    alt: "APK Icon",
    link: "https://s.voce.chat/vocechat.android.apk",
  },
  {
    title: "download iOS APP from app store",
    icon: `/img/icon.app.ios.png`,
    alt: "App Store Icon",
    link: "https://apps.apple.com/app/vocechat/id1631779678",
  },
  {
    title: "download desktop version from github releases",
    icon: `/img/icon.app.desktop.png`,
    alt: "Desktop Download Icon",
    link: "https://github.com/Privoce/vocechat-desktop/releases/latest",
  },
];
type Props = {};

const Downloads = ({}: Props) => {
  return (
    <div
      id="download"
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {downloads.map(({ title, link, alt, icon }) => (
        <a
          key={link}
          title={title}
          style={{ display: "flex" }}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img width={200} height={66} alt={alt} src={icon}></img>
        </a>
      ))}
    </div>
  );
};

export default Downloads;
