import { Upload, Sparkles, CheckCircle } from "lucide-react";

const BuildProcess = () => {
    const steps = [
        {
            number: "01",
            icon: Upload,
            title: "Upload Medical Report",
            description: "Upload your lab report in PDF or image format securely to our platform.",
        },
        {
            number: "02",
            icon: Sparkles,
            title: "AI Analysis",
            description: "Our AI extracts test values and identifies abnormalities automatically.",
        },
        {
            number: "03",
            icon: CheckCircle,
            title: "Get Clear Results",
            description: "Receive a simplified summary with actionable health suggestions.",
        },
    ];

    return (
        <div id="how-it-works" className="py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-surface-1">
            {/* Section Title */}
            <div className="text-center mb-16">
                <p className="text-xs font-medium tracking-[0.4px] uppercase text-primary mb-4">How It Works</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                    Three steps to clarity
                </h2>
                <p className="text-ink-subtle mt-4 max-w-xl mx-auto">
                    Get your medical reports analyzed in three simple steps
                </p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {steps.map((step, index) => (
                    <div
                        key={step.number}
                        className="group relative p-8 rounded-xl border border-hairline bg-surface-2 hover:border-hairline-strong transition-all duration-200"
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Step Number */}
                        <div className="text-5xl font-bold text-surface-3 group-hover:text-ink-tertiary transition-colors mb-6 tracking-tight">
                            {step.number}
                        </div>

                        {/* Icon */}
                        <div className="mb-5">
                            <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                <step.icon className="w-5 h-5 text-primary" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-ink mb-2 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-sm text-ink-subtle leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuildProcess;
