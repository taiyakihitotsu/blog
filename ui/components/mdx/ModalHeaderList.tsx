import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type FC, type ReactNode, type RefObject, useRef } from "react";
import { modalContentAnimation } from "@/animation/timeline.js";
import { colors } from "@/common/color.js";
import { zIndex } from "@/common/z-index.js";
import { CloseIcon } from "@/components/icon/Close.js";
import { MenuIcon } from "@/components/icon/Menu.js";
import { UpIcon } from "@/components/icon/UpIcon.js";
import {
  closeButtonLayout,
  generatePxLayout,
  layout,
  openButtonLayout,
  upButtonLayout,
} from "@/engine/layout.js";
import { handleHeaderClick } from "@/lib/handler/handleHeaderClick.js";
import { handleScrollToTop } from "@/lib/handler/handleScrollToTop.js";

/** ==================
      Internal
=================== */

const openIconStyle = {
  ...generatePxLayout(openButtonLayout),
  position: "fixed",
  zIndex: zIndex.openIcon,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  color: colors.openIconColor,
  backgroundColor: colors.openIconBack,
  border: `1px solid ${colors.openIconBorder}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  outline: "none",
} as const;

const upIconStyle = {
  ...openIconStyle,
  ...generatePxLayout(upButtonLayout),
};

const modalStyle = {
  position: "fixed",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.modalBack,
  backdropFilter: "blur(8px)",
  zIndex: zIndex.modal,
  width: "100%",
} as const;

const closeIconStyle = {
  ...generatePxLayout(closeButtonLayout),
  position: "absolute",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: zIndex.closeIcon,
  borderRadius: "12px",
  background: colors.closeIconBack,
  border: `1px solid ${colors.closeIconBorder}`,
  color: colors.closeIconColor,
  transition: "transform 0.2s ease",
} as const;

const contentStyle = {
  position: "relative",
  background: colors.contentBack,
  borderRadius: "12px",
  border: `1px solid ${colors.headersContentsBorder}`,
  ...layout.contentList,
} as const;

type OpenButtonProps = {
  handleOpen: () => void;
};

const OpenButton: FC<OpenButtonProps> = ({ handleOpen }) => (
  <>
    <button
      id={"float-jump-list-open-button"}
      className={"float-menu-button"}
      type={"button"}
      onClick={handleOpen}
      style={openIconStyle}
      onKeyDown={() => {}}
      aria-label="Open menu"
    >
      <MenuIcon />
    </button>

    <button
      id={"float-jump-list-jump-button"}
      className={"float-menu-button"}
      type={"button"}
      onClick={() => handleScrollToTop()}
      style={upIconStyle}
      onKeyDown={() => {}}
      aria-label="Open menu"
    >
      <UpIcon />
    </button>
  </>
);

type CloseButtonProps = {
  handleClose: () => void;
};

const CloseButton: FC<CloseButtonProps> = ({ handleClose }) => (
  <button
    id={"float-jump-list-close-button"}
    className={"float-jump-list-content"}
    type={"button"}
    onClick={handleClose}
    style={closeIconStyle}
    onKeyDown={() => {}}
    aria-label="Close menu"
  >
    <CloseIcon />
  </button>
);

type ModalOuterProps = {
  ref: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  handleClose: () => void;
};

const ModalOuter: FC<ModalOuterProps> = ({ children, handleClose, ref }) => (
  <div
    ref={ref}
    id={"float-jump-list-close-modal"}
    className={"float-jump-list-content"}
    role={"dialog"}
    style={modalStyle}
    onClick={handleClose}
    onKeyDown={() => {}}
    aria-modal={"true"}
  >
    {children}
  </div>
);

/** ==================
      Main
=================== */

type ModalHeaderListProps = {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
  handleOpen: () => void;
};

export const ModalHeaderList: FC<ModalHeaderListProps> = ({
  children,
  isOpen,
  handleOpen,
  handleClose,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      const tl = gsap.timeline();

      tl.fromTo(
        modalRef.current,
        modalContentAnimation[0].animation,
        modalContentAnimation[1].animation,
      ).to(modalRef.current, modalContentAnimation[2].animation, modalContentAnimation[2].timecode);
    }
  }, [isOpen]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;

    const href = target.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    e.preventDefault();

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const offset = 80;
      const scrollPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });

      handleHeaderClick(targetId);
      handleClose();
    }
  };

  return (
    <div className={"float-jump-list-parent"}>
      <OpenButton handleOpen={handleOpen} />

      {isOpen && (
        <ModalOuter handleClose={handleClose} ref={modalRef}>
          <div
            ref={contentRef}
            style={contentStyle}
            onClick={(e) => {
              e.stopPropagation();
              handleAnchorClick(e);
            }}
          >
            <CloseButton handleClose={handleClose} />
            {children}
          </div>
        </ModalOuter>
      )}
    </div>
  );
};

export default ModalHeaderList;
