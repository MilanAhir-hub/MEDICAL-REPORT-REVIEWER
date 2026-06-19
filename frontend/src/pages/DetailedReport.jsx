import { Download, FileText, AlertCircle, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import { useReportAnalysis } from '../hooks/useReportAnalysis';
import { useAnalyzeReport } from '../hooks/useAnalyzeReport';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const DetailedReport = () => {
    const { reportId } = useParams();
    const { data: reportAnalysis, isLoading, isError, error } = useReportAnalysis(reportId);
    const { mutate: analyzeReport, isPending: isAnalyzing } = useAnalyzeReport();

    const getRiskLevel = (backendRisk) => {
        if (!backendRisk) return 'normal';
        const riskMap = { 'low': 'normal', 'medium': 'attention', 'high': 'critical' };
        return riskMap[backendRisk] || 'normal';
    };

    const handleDownloadPDF = () => {
        if (!report) return;
        const doc = new jsPDF();
        
        // Color Palette
        const primaryColor = [94, 106, 210]; // #5e6ad2
        const textColor = [23, 23, 23]; // #171717
        const grayColor = [115, 115, 115]; // #737373
        
        // Header Banner
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');
        
        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("MEDICAL REPORT ANALYSIS", 15, 25);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("AI-Generated Patient-Friendly Translation", 15, 32);
        
        // Meta Info
        doc.setTextColor(...textColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Report Title:", 15, 55);
        doc.setFont("helvetica", "normal");
        doc.text(report.title || "N/A", 45, 55);
        
        doc.setFont("helvetica", "bold");
        doc.text("Report Type:", 15, 62);
        doc.setFont("helvetica", "normal");
        doc.text(report.reportType || "General Medical Report", 45, 62);
        
        doc.setFont("helvetica", "bold");
        doc.text("Analyzed On:", 15, 69);
        doc.setFont("helvetica", "normal");
        doc.text(reportDate, 45, 69);
        
        doc.setFont("helvetica", "bold");
        doc.text("Overall Risk:", 15, 76);
        const riskVal = report.riskLevel ? report.riskLevel.toUpperCase() : "LOW";
        if (riskVal === "HIGH") {
            doc.setTextColor(220, 38, 38); // Red
        } else if (riskVal === "MEDIUM") {
            doc.setTextColor(217, 119, 6); // Amber/Orange
        } else {
            doc.setTextColor(22, 163, 74); // Green
        }
        doc.text(riskVal, 45, 76);
        doc.setTextColor(...textColor); // Reset
        
        doc.setDrawColor(229, 229, 229);
        doc.line(15, 82, 195, 82);
        
        let yPos = 90;
        
        // 1. Patient-Friendly Summary
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("Patient-Friendly Summary", 15, yPos);
        yPos += 7;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...textColor);
        
        const summaryLines = doc.splitTextToSize(report.summary || "No summary available.", 180);
        doc.text(summaryLines, 15, yPos);
        yPos += (summaryLines.length * 5) + 10;
        
        // 2. Highlighted Abnormal Findings
        if (report.abnormalFindings && report.abnormalFindings.length > 0) {
            // Check if we need to start a new page
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text("Highlighted Abnormal Findings", 15, yPos);
            yPos += 7;
            
            report.abnormalFindings.forEach((finding, index) => {
                const explanation = (report.explanations && report.explanations[index]) || "";
                const findingText = `Finding ${index + 1}: ${finding}`;
                const expText = `Explanation: ${explanation}`;
                
                const splitFinding = doc.splitTextToSize(findingText, 175);
                const splitExp = doc.splitTextToSize(expText, 175);
                
                const blockHeight = (splitFinding.length + splitExp.length) * 5 + 10;
                if (yPos + blockHeight > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                
                // Draw finding block
                doc.setFillColor(245, 246, 246);
                doc.rect(15, yPos, 180, blockHeight - 4, 'F');
                
                doc.setDrawColor(94, 106, 210);
                doc.line(15, yPos, 15, yPos + blockHeight - 4);
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9.5);
                doc.setTextColor(220, 38, 38); // Red text for abnormal title
                doc.text(splitFinding, 18, yPos + 6);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9.5);
                doc.setTextColor(...textColor);
                doc.text(splitExp, 18, yPos + 6 + (splitFinding.length * 5));
                
                yPos += blockHeight;
            });
            yPos += 5;
        }
        
        // 3. Follow-up Suggestions
        if (report.suggestions && report.suggestions.length > 0) {
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(...primaryColor);
            doc.text("Follow-up Suggestions", 15, yPos);
            yPos += 7;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...textColor);
            
            report.suggestions.forEach((suggestion) => {
                const splitSugg = doc.splitTextToSize(`• ${suggestion}`, 180);
                const blockHeight = splitSugg.length * 5 + 2;
                
                if (yPos + blockHeight > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.text(splitSugg, 15, yPos);
                yPos += blockHeight;
            });
            yPos += 10;
        }
        
        // Disclaimer
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setDrawColor(229, 229, 229);
        doc.line(15, yPos, 195, yPos);
        yPos += 6;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...grayColor);
        doc.text("Disclaimer:", 15, yPos);
        yPos += 5;
        
        doc.setFont("helvetica", "normal");
        const discText = "This analysis is AI-generated and for informational purposes only. It should not be considered as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for proper interpretation of your medical reports and personalized medical guidance.";
        const splitDisc = doc.splitTextToSize(discText, 180);
        doc.text(splitDisc, 15, yPos);
        
        // Save PDF
        const safeTitle = (report.title || "medical_report").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`${safeTitle}_analysis.pdf`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-canvas py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-ink-tertiary border-t-primary mx-auto mb-4"></div>
                    <p className="text-ink-subtle">Loading report analysis...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-canvas py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-ink mb-2">Error Loading Report</h2>
                    <p className="text-ink-subtle">{error?.message || 'Failed to load report analysis'}</p>
                </div>
            </div>
        );
    }

    const report = reportAnalysis?.report;
    if (!report) {
        return (
            <div className="min-h-screen bg-canvas py-12 px-6 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="text-ink-tertiary mx-auto mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-ink mb-2">No Report Found</h2>
                    <p className="text-ink-subtle">Unable to find the requested report</p>
                </div>
            </div>
        );
    }

    const riskLevel = getRiskLevel(report.riskLevel);
    const reportDate = new Date(report.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-canvas py-12 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">Medical Report Analysis</h1>
                            <p className="text-ink-subtle mt-2">{report.reportType || 'Medical Report'} - {reportDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {report.summary ? (
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-success/10 text-success border border-success/20">
                                        <CheckCircle size={16} />
                                        Analyzed
                                    </span>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-all duration-200 cursor-pointer"
                                    >
                                        <Download size={16} />
                                        Download Analysis
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => analyzeReport(reportId)}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            <span>Analyze Now</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Original Report */}
                <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-6 hover:border-hairline-strong transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FileText className="text-primary" size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-ink">Original Report</h2>
                                <p className="text-sm text-ink-subtle">{report.title} • {report.fileType.toUpperCase()}</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            className="flex items-center gap-2"
                            onClick={() => window.open(report.fileUrl, '_blank')}
                        >
                            <Download size={16} strokeWidth={2} />
                            Download
                        </Button>
                    </div>
                </div>

                {/* Patient-Friendly Summary */}
                <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-6">
                    <h2 className="text-lg font-semibold text-ink mb-4">Patient-Friendly Summary</h2>
                    {report.summary ? (
                        <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                            {report.summary}
                        </p>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="text-primary mx-auto mb-3" size={32} />
                            <p className="text-ink-subtle mb-4">This report hasn't been analyzed yet.</p>
                            <button
                                onClick={() => analyzeReport(reportId)}
                                disabled={isAnalyzing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Analyzing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        <span>Analyze Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Abnormal Values */}
                <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-6">
                    <h2 className="text-lg font-semibold text-ink mb-4">Highlighted Abnormal Values</h2>
                    <div className="space-y-4">
                        {report.abnormalFindings && report.abnormalFindings.length > 0 ? (
                            report.abnormalFindings.map((finding, index) => (
                                <div key={index} className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-xl">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="text-primary shrink-0 mt-1" size={20} strokeWidth={2} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-ink">Abnormal Finding {index + 1}</h3>
                                                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Attention</span>
                                            </div>
                                            <div className="bg-surface-2 p-3 rounded-lg border border-hairline mb-3">
                                                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                                                    <span className="font-medium text-ink">Finding:</span> {finding}
                                                </p>
                                            </div>
                                            {report.explanations && report.explanations[index] && (
                                                <div className="bg-surface-2 p-3 rounded-lg border border-hairline">
                                                    <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                                                        <span className="font-medium text-ink">Explanation:</span> {report.explanations[index]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle className="text-success mx-auto mb-3" size={32} />
                                <p className="text-ink-subtle">No abnormal findings detected in this report.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Risk Level */}
                <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-6">
                    <h2 className="text-lg font-semibold text-ink mb-4">Overall Risk Level</h2>

                    {riskLevel === 'normal' && (
                        <div className="flex items-center gap-4 p-5 bg-success/5 border border-success/20 rounded-xl">
                            <div className="p-3 bg-success/10 rounded-full">
                                <CheckCircle className="text-success" size={28} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-ink">Normal</h3>
                                <p className="text-sm text-ink-muted mt-1">All values are within normal range. Continue maintaining a healthy lifestyle.</p>
                            </div>
                        </div>
                    )}

                    {riskLevel === 'attention' && (
                        <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/20 rounded-xl">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <AlertTriangle className="text-primary" size={28} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-ink">Attention Required</h3>
                                <p className="text-sm text-ink-muted mt-1">Some values need monitoring and lifestyle adjustments. Consult with your doctor for personalized advice.</p>
                            </div>
                        </div>
                    )}

                    {riskLevel === 'critical' && (
                        <div className="flex items-center gap-4 p-5 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <AlertCircle className="text-red-400" size={28} strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-ink">Critical - Immediate Action Required</h3>
                                <p className="text-sm text-ink-muted mt-1">Critical values detected. Please consult your healthcare provider immediately.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                            riskLevel === 'normal' ? 'bg-success/5 border border-success/20' : 'bg-surface-2 border border-hairline'
                        }`}>
                            <CheckCircle className={riskLevel === 'normal' ? 'text-success' : 'text-ink-tertiary'} size={18} strokeWidth={2} />
                            <span className={`text-sm font-medium ${riskLevel === 'normal' ? 'text-ink' : 'text-ink-tertiary'}`}>Normal</span>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                            riskLevel === 'attention' ? 'bg-primary/5 border border-primary/20' : 'bg-surface-2 border border-hairline'
                        }`}>
                            <AlertTriangle className={riskLevel === 'attention' ? 'text-primary' : 'text-ink-tertiary'} size={18} strokeWidth={2} />
                            <span className={`text-sm font-medium ${riskLevel === 'attention' ? 'text-ink' : 'text-ink-tertiary'}`}>Attention</span>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                            riskLevel === 'critical' ? 'bg-red-500/5 border border-red-500/20' : 'bg-surface-2 border border-hairline'
                        }`}>
                            <AlertCircle className={riskLevel === 'critical' ? 'text-red-400' : 'text-ink-tertiary'} size={18} strokeWidth={2} />
                            <span className={`text-sm font-medium ${riskLevel === 'critical' ? 'text-ink' : 'text-ink-tertiary'}`}>Critical</span>
                        </div>
                    </div>
                </div>

                {/* Follow-up Suggestions */}
                <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-6">
                    <h2 className="text-lg font-semibold text-ink mb-4">Follow-up Suggestions</h2>
                    <div className="space-y-3">
                        {report.suggestions && report.suggestions.length > 0 ? (
                            report.suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-surface-2 rounded-lg border border-hairline">
                                    <div className="p-1.5 bg-primary/10 rounded-full shrink-0 mt-0.5">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                    <p className="text-sm text-ink-muted whitespace-pre-line">{suggestion}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <Info className="text-ink-tertiary mx-auto mb-3" size={28} />
                                <p className="text-ink-subtle">No specific follow-up suggestions available.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-surface-1 border border-hairline rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <Info className="text-primary shrink-0 mt-0.5" size={20} strokeWidth={2} />
                        <div>
                            <h3 className="font-semibold text-ink mb-2">Important Disclaimer</h3>
                            <p className="text-sm text-ink-subtle leading-relaxed">
                                This analysis is AI-generated and for informational purposes only. It should not be considered as medical advice,
                                diagnosis, or treatment. Always consult with a qualified healthcare professional for proper interpretation of your
                                medical reports and personalized medical guidance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedReport;
