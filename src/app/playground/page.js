"use client";

import { useState } from "react";
import { Modal } from "../../../playground/Modal";
import { Tabs } from "../../../playground/Tabs";
import { Disclosure } from "../../../playground/Disclosure";

export default function PlaygroundPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Accessibility Playground</h1>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Modal Dialog</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Open Modal
        </button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
        >
          <p>This is a focus-trapped, keyboard-accessible modal.</p>
          <input
            type="text"
            placeholder="Try tabbing to me"
            className="mt-2 w-full p-2 border rounded"
          />
        </Modal>
      </section>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Tabs</h2>
        <Tabs
          tabs={[
            { id: "one", label: "Overview", content: <p>This is the overview panel.</p> },
            { id: "two", label: "Details", content: <p>This is the details panel.</p> },
            { id: "three", label: "Settings", content: <p>This is the settings panel.</p> },
          ]}
        />
      </section>
        <section className="mb-10">
        <h2 className="font-semibold mb-3">Disclosure</h2>
        <Disclosure summary="What is an accessible disclosure?">
            <p>A disclosure is a button that reveals or hides additional content, commonly used for FAQs.</p>
        </Disclosure>
        </section>
    </div>
  );
}