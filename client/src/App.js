import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect, useRef, useCallback } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
import Keyframes from "./KeyFrames";
import React from "react";
// ─── TOAST ENGINE ────────────────────────────────────────────────────────────
let _pushToast = null;

export function toast(msg, type = "info") {
  _pushToast?.({ msg, type, id: Date.now() + Math.random() });
}


// ─── CURSOR GLOW ─────────────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - 220}px, ${e.clientY - 220}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return React.createElement("div", { ref, className: "cursor-glow" });
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ account, loading }) {
  if (loading) {
    return React.createElement("div", { className: "status-badge status--connecting" },
      React.createElement("span", { className: "status-dot" }),
      "Connecting to wallet…"
    );
  }
  if (account) {
    return React.createElement("div", { className: "status-badge status--connected" },
      React.createElement("span", ),
    "Account:   ",
      React.createElement("span", { className: "status-dot" }),
       account
    );
  }
  return React.createElement("div", { className: "status-badge status--disconnected" },
    React.createElement("span", { className: "status-dot" }),
    "Not connected"
  );
}

// ─── DRAG OVERLAY ─────────────────────────────────────────────────────────────
function DragOverlay({ visible, onDrop }) {
  const onDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onDrop(files);
  };

  return React.createElement("div", {
    className: `drag-overlay${visible ? " drag-overlay--on" : ""}`,
    onDragOver,
    onDrop: handleDrop,
  },
   
  );
}

// ─── ANIMATED TITLE ──────────────────────────────────────────────────────────
function AnimatedTitle({ text }) {
  return React.createElement("h1", null,
    text.split("").map((ch, i) =>
      React.createElement("span", {
        key: i,
        className: "title-char",
        style: { animationDelay: `${i * 28}ms` }
      }, ch === " " ? "\u00A0" : ch)
    )
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // NEW state
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null);
  const dragCounter = useRef(0);

  // staggered mount
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ── original wallet logic (untouched, just wrapped with loading + toasts) ──
  console.log("hi");
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => { window.location.reload(); });
        window.ethereum.on("accountsChanged", () => { window.location.reload(); });

        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
          setContract(contract);
          setProvider(provider);
          toast("Wallet connected", "success");
          
        } catch (err) {
          toast(err.code === 4001 ? "Connection rejected" : "Failed to connect", "error");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Metamask is not installed");
        toast("MetaMask not detected", "error");
        setLoading(false);
      }
    };

    provider && loadProvider();
  }, []);

  // ── global drag detection ──
  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) { dragCounter.current = 0; setDragActive(false); }
  }, []);

  const onDrop = useCallback((e) => {
    e?.preventDefault?.();
    dragCounter.current = 0;
    setDragActive(false);
  }, []);

  const handleFileDrop = useCallback((files) => {
    setDroppedFiles(files);
    onDrop();
    toast(`${files.length} file${files.length > 1 ? "s" : ""} ready`, "info");
  }, [onDrop]);

  useEffect(() => {
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [onDragEnter, onDragLeave, onDrop]);

  // ── render ──
  return React.createElement(React.Fragment, null,

    // NEW additions

    React.createElement(CursorGlow),
    React.createElement(DragOverlay, { visible: dragActive, onDrop: handleFileDrop }),

    // original share button (untouched logic, just added icon + guard)
    !modalOpen && React.createElement("button", {
      className: "share",
      onClick: () => {
        if (!contract) { toast("Connect your wallet first", "warning"); return; }
        setModalOpen(true);
      }
    },
      React.createElement("svg", {
        width: 13, height: 13, viewBox: "0 0 16 16", fill: "none",
        style: { marginRight: 6, verticalAlign: "middle" }
      },
        React.createElement("circle", { cx: 13, cy: 2.5, r: 1.8, stroke: "currentColor", strokeWidth: 1.4 }),
        React.createElement("circle", { cx: 13, cy: 13.5, r: 1.8, stroke: "currentColor", strokeWidth: 1.4 }),
        React.createElement("circle", { cx: 3, cy: 8, r: 1.8, stroke: "currentColor", strokeWidth: 1.4 }),
        React.createElement("path", { d: "M4.7 7.1L11.3 3.4M4.7 8.9L11.3 12.6", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" })
      ),
      "Share"
    ),

    modalOpen && React.createElement(Modal, { setModalOpen, contract }),

    React.createElement("div", { className: `App${ready ? " App--ready" : ""}` },

      // NEW animated title instead of plain h1
      React.createElement(AnimatedTitle, { text: " Decentralized File Sharing" }),

      // original bg divs (untouched)
      React.createElement("div", { className: "bg" }),
      React.createElement("div", { className: "bg bg2" }),
      React.createElement("div", { className: "bg bg3" }),

      // NEW status badge replaces plain <p>
      React.createElement(StatusBadge, { account, loading }),

      // loading skeleton OR original content
      loading
        ? React.createElement("div", { className: "skeleton-wrap" },
            React.createElement("div", { className: "skeleton sk-wide" }),
            React.createElement("div", { className: "skeleton sk-med" }),
            React.createElement("div", { className: "skeleton sk-wide" }),
          )
        : React.createElement(React.Fragment, null,
            React.createElement(FileUpload, {
              account, provider, contract,
              droppedFiles,
              onUploadStart: () => toast("Uploading to IPFS…", "info"),
              onUploadSuccess: () => { toast("File uploaded!", "success"); setDroppedFiles(null); },
              onUploadError: () => toast("Upload failed", "error"),
            }),
            React.createElement(Display, { contract, account }),
          ),

      React.createElement(Keyframes),
    )
  );
}

export default App;