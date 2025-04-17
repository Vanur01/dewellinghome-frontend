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
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-6 px-4 flex justify-between items-center focus:outline-none group transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
          {item.question}
        </span>
        <span
          className={`transform transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180 text-gray-900" : "text-gray-400"
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
        <div className="px-4 pb-6 pt-2">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="pt-20 md:py-32 px-4 max-w-6xl mx-auto min-h-[80vh]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="rounded-xl">
          {faqData.map((item, index) => (
            <FaqItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
