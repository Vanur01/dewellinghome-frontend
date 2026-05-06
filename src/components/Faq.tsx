import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What services do you offer?",
    answer:
      "We offer comprehensive home interior design and renovation services, including modular kitchen design, bedroom design, living room makeovers, and complete home interior solutions.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope and complexity. A typical room renovation might take 4-6 weeks, while a complete home interior project could take 8-12 weeks.",
  },
  {
    question: "Do you provide warranty on your services?",
    answer:
      "Yes, we provide warranty on all our products and installations. The warranty period varies by product category and is clearly specified in our service agreement.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Our pricing is transparent and competitive, based on your specific requirements and chosen materials. We provide detailed quotes after initial consultation and design approval.",
  },
];

const FaqItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-300">
      <button
        className="w-full py-6 px-6 flex justify-between items-center focus:outline-none group transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left text-lg font-medium text-gray-800 group-hover:text-red-600 transition-colors flex-1 pr-4">
          {item.question}
        </span>
        <span
          className={`transform transition-all duration-300 ease-out p-2 rounded-full bg-gray-50 group-hover:bg-red-50 ${
            isOpen ? "rotate-180 text-red-600 bg-red-50" : "text-gray-400"
          }`}
        >
          <ChevronDown size={20} />
        </span>
      </button>
      <div
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          height: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-6 pt-2">
          <p className="text-gray-600 leading-relaxed border-l-4 border-red-100 pl-4">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="pt-10 md:py-16 px-4 max-w-6xl mx-auto min-h-[80vh]">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our services, process, and commitments.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 shadow-lg bg-white overflow-hidden">
          {faqData.map((item, index) => (
            <FaqItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
