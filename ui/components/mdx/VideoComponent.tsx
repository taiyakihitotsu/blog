import { layout } from "@/engine/layout.js";

export const VideoComponent = (props: { src: string; alt?: string }) => (
  <video
    autoPlay
    loop
    muted
    playsInline
    style={{ ...layout.video, borderRadius: "8px" }}
    aria-label={props.alt}
  >
    <source src={props.src} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);
