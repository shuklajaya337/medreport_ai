"use client";

import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Remember what had focus before opening, so we can return to it
      triggerRef.current = document.activeElement;

      // Move focus into the dialog
      const focusable = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    } else {
      // Return focus to whatever opened the dialog
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusables = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4"
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        <div className="mb-4">{children}</div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}