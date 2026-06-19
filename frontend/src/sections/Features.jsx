import { Sparkles, Scan, Globe } from "lucide-react";
import medicalReportImage from "../assets/medical_report_analysis.png";

const FeaturesSection = () => {
    const features = [
        {
            icon: Sparkles,
            iconColor: "text-primary",
            iconBg: "bg-primary/10",
            title: "AI Analysis",
            description: "Translates complex medical jargon into clinical-grade, patient-friendly summaries and follow-up guidance.",
        },
        {
            icon: Scan,
            iconColor: "text-success",
            iconBg: "bg-success/10",
            title: "OCR Support",
            description: "Automatically extracts structured data from uploaded PDF reports and scanned report images.",
        },
        {
            icon: Globe,
            iconColor: "text-primary-hover",
            iconBg: "bg-primary-hover/10",
            title: "Multi-language Support",
            description: "Translates analyses, abnormal value explanations, and health suggestions into Hindi, Gujarati, Tamil, and more.",
        },
    ];

    return (
        <div id="features" className="py-24 px-4 md:px-16 lg:px-24 xl:px-32 bg-canvas">
            {/* Section Title */}
            <div className="text-center mb-16">
                <p className="text-xs font-medium tracking-[0.4px] uppercase text-primary mb-4">Features</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                    Everything you need to understand your health
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
                {/* Product screenshot */}
                <div className="w-full max-w-2xl rounded-xl border border-hairline bg-surface-1 p-2">
                    <img
                        className="w-full rounded-lg"
                        src={medicalReportImage}
                        alt="Medical Report Analysis Interface"
                    />
                </div>

                {/* Feature cards */}
                <div className="space-y-4 w-full max-w-md">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group flex items-start gap-5 p-5 rounded-xl border border-hairline bg-surface-1 hover:bg-surface-2 hover:border-hairline-strong transition-all duration-200"
                        >
                            <div className={`p-3 rounded-lg ${feature.iconBg} shrink-0`}>
                                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} strokeWidth={2} />
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
                                <p className="text-sm text-ink-subtle leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
