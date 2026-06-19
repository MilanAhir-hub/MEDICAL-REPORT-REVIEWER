import React from "react";
import { ChevronDown } from "lucide-react";

const Questions = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
        {
            question: "What is LabLens?",
            answer:
                "LabLens is an AI-powered platform that helps patients understand medical lab reports by generating simplified explanations and highlighting important values in easy-to-understand language.",
        },
        {
            question: "How does the AI analyze reports?",
            answer:
                "The AI extracts key test values from uploaded reports, identifies abnormal results, compares them with normal ranges, and generates a patient-friendly summary with clear explanations.",
        },
        {
            question: "Does this replace a doctor?",
            answer:
                "No. LabLens only explains uploaded reports and provides general follow-up suggestions. It does not give medical diagnoses. Always consult your doctor for medical advice.",
        },
        {
            question: "Can I ask questions about my report?",
            answer:
                "Yes. You can ask questions related only to your uploaded report, and the AI will explain the report in simple terms, helping you understand what the values mean.",
        },
        {
            question: "Is my data secure?",
            answer:
                "Yes. All uploaded reports are encrypted and stored securely. We follow strict privacy standards to protect your health information.",
        },
    ];

    return (
        <div id="questions" className="py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-surface-1">
            {/* Section Title */}
            <div className="text-center mb-16">
                <p className="text-xs font-medium tracking-[0.4px] uppercase text-primary mb-4">FAQ</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                    Frequently Asked Questions
                </h2>
                <p className="text-ink-subtle mt-4 max-w-xl mx-auto">
                    Everything you need to know about LabLens
                </p>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-16">
                {/* Image */}
                <div className="w-full max-w-md rounded-xl border border-hairline bg-surface-2 p-2">
                    <img
                        className="w-full rounded-lg object-cover h-auto"
                        src="https://i.pinimg.com/1200x/8d/fb/b5/8dfbb566cd74a2165b6beca5492ca90e.jpg"
                        alt="Medical consultation"
                    />
                </div>

                {/* FAQ Accordion */}
                <div className="flex-1 w-full">
                    <h3 className="text-xl text-ink font-semibold mb-2 tracking-tight">Looking for answers?</h3>
                    <p className="text-sm text-ink-subtle mb-8">
                        Clear answers about how our AI-powered platform simplifies medical
                        reports while keeping your health information secure.
                    </p>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                className="border border-hairline rounded-xl p-5 cursor-pointer hover:border-hairline-strong transition-all duration-200 bg-surface-2"
                                key={index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-ink pr-4">{faq.question}</h4>
                                    <ChevronDown
                                        className={`w-4 h-4 text-ink-subtle flex-shrink-0 transition-transform duration-200 ${
                                            openIndex === index ? "rotate-180" : ""
                                        }`}
                                    />
                                </div>

                                <div
                                    className={`text-sm text-ink-subtle leading-relaxed transition-all duration-200 overflow-hidden ${
                                        openIndex === index
                                            ? "opacity-100 max-h-[300px] mt-3"
                                            : "opacity-0 max-h-0"
                                    }`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questions;
