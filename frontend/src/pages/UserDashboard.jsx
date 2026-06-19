import React, { useState } from 'react';
import { UserRound, FileText, Eye, Sparkles, Trash2, AlertTriangle, Calendar, AlertCircle } from 'lucide-react';
import UploadReport from '../components/UploadReport';
import Logo from '../components/Logo';
import { useReportsList } from '../hooks/useReportsList';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAnalyzeReport } from '../hooks/useAnalyzeReport';
import { useDeleteReport } from '../hooks/useDeleteReport';
import { useAuth } from '../context/authContext';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user: authUser, status } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [reportToDelete, setReportToDelete] = useState(null);
    const { data: user } = useUserProfile();
    const { data, isLoading, isError } = useReportsList();
    const { mutate: analyzeReport } = useAnalyzeReport();
    const { mutate: deleteReport, isPending: isDeleting } = useDeleteReport();

    // Stats calculations
    const reports = data?.reports || [];
    const totalReports = reports.length;
    const highRiskCount = reports.filter(r => r.riskLevel === 'high').length;
    const lastUploadDate = reports.length > 0
        ? new Date(reports[0].createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })
        : "N/A";
    return (
        <div className="min-h-screen bg-canvas">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full h-14 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between bg-canvas/80 backdrop-blur-xl border-b border-hairline z-50">
                <Logo />
                <div className="flex items-center gap-3">
                    <p className="hidden sm:block text-sm text-ink-subtle">{user?.name}</p>
                    <button
                        onClick={() => navigate("/userProfile", { replace: true })}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary-hover transition-all duration-200"
                    >
                        <UserRound size={16} />
                    </button>
                </div>
            </nav>

            <main className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-24 sm:pt-28 pb-8 sm:pb-12">
                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {/* Total Reports */}
                    <div className="bg-surface-1 border border-hairline rounded-2xl p-6 hover:border-hairline-strong hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-ink-subtle">Total Reports</span>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText size={18} className="text-primary" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-ink">{totalReports}</p>
                        <p className="text-xs text-ink-tertiary mt-2">All uploaded documents</p>
                    </div>

                    {/* High Risk Count */}
                    <div className="bg-surface-1 border border-hairline rounded-2xl p-6 hover:border-hairline-strong hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-ink-subtle">High Risk Flags</span>
                            <div className={`p-2 rounded-lg ${highRiskCount > 0 ? 'bg-red-500/10' : 'bg-success/10'}`}>
                                <AlertTriangle size={18} className={highRiskCount > 0 ? 'text-red-500' : 'text-success'} />
                            </div>
                        </div>
                        <p className={`text-3xl font-bold ${highRiskCount > 0 ? 'text-red-500' : 'text-success'}`}>{highRiskCount}</p>
                        <p className="text-xs text-ink-tertiary mt-2">Critical attention required</p>
                    </div>

                    {/* Last Upload Date */}
                    <div className="bg-surface-1 border border-hairline rounded-2xl p-6 hover:border-hairline-strong hover:scale-[1.01] transition-all duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-ink-subtle">Last Activity</span>
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calendar size={18} className="text-primary" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-ink tracking-tight pt-1">{lastUploadDate}</p>
                        <p className="text-xs text-ink-tertiary mt-2">Latest report uploaded</p>
                    </div>
                </div>

                <div className="add-report">
                    <h2 className="text-xl sm:text-2xl font-semibold text-ink mb-6 tracking-tight">Upload Reports</h2>

                    <div className="flex gap-4 sm:gap-6">
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="group flex items-center justify-center px-10 sm:px-14 py-10 sm:py-14 bg-surface-1 border border-hairline rounded-xl hover:bg-surface-2 hover:border-hairline-strong transition-all duration-200 cursor-pointer"
                        >
                            <div className="p-3 sm:p-4 bg-primary/10 rounded-full group-hover:bg-primary/15 transition-colors duration-200">
                                <FileText className="text-primary w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
                            </div>
                        </button>
                    </div>

                    <hr className="border-t max-w-xl border-hairline mt-8 mb-8" />

                    <div className="uploaded-report">
                        <h2 className="text-xl sm:text-2xl font-semibold text-ink mb-6 tracking-tight">Uploaded Reports</h2>

                        <div className="flex flex-col gap-3 max-w-3xl">
                            {isLoading && (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-ink-tertiary border-t-primary"></div>
                                </div>
                            )}

                            {isError && (
                                <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                    <p className="text-sm text-red-400">Failed to load reports. Please try again.</p>
                                </div>
                            )}

                            {!isLoading && !isError && data?.reports?.length === 0 && (
                                <div className="p-8 bg-surface-1 border border-hairline rounded-xl text-center">
                                    <p className="text-sm text-ink-subtle">No reports uploaded yet. Upload your first report above!</p>
                                </div>
                            )}

                            {!isLoading && !isError && data?.reports?.map((report) => (
                                <div
                                    key={report._id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-surface-1 border border-hairline rounded-xl hover:border-hairline-strong transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg shrink-0">
                                        <FileText className="text-primary w-5 h-5" strokeWidth={2} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-ink truncate">
                                            {report.title || 'Medical Report'}
                                        </h3>
                                        <p className="text-xs text-ink-tertiary mt-1">
                                            Uploaded on {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {report.summary ? (
                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
                                                Analyzed
                                            </span>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAnalyzingId(report._id);
                                                    analyzeReport(report._id, {
                                                        onSettled: () => setAnalyzingId(null)
                                                    });
                                                }}
                                                disabled={analyzingId === report._id}
                                                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {analyzingId === report._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                                                        <span className="hidden sm:inline">Analyzing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={14} />
                                                        <span>Analyze</span>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => analyzingId !== report._id && navigate(`/report/${report._id}`)}
                                            disabled={analyzingId === report._id}
                                            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                                analyzingId === report._id
                                                    ? 'opacity-50 cursor-not-allowed bg-surface-2'
                                                    : 'hover:bg-surface-2 cursor-pointer text-ink-subtle hover:text-ink'
                                            }`}
                                            title={analyzingId === report._id ? "Please wait while analyzing..." : "View report details"}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setReportToDelete(report);
                                            }}
                                            disabled={analyzingId === report._id || isDeleting}
                                            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                                analyzingId === report._id
                                                    ? 'opacity-50 cursor-not-allowed bg-surface-2'
                                                    : 'hover:bg-red-500/10 cursor-pointer text-ink-subtle hover:text-red-500'
                                            }`}
                                            title="Delete report"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {showUploadModal && <UploadReport onClose={() => setShowUploadModal(false)} />}

            {/* Confirmation Modal */}
            {reportToDelete && (
                <div className="fixed inset-0 bg-canvas/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-2 border border-hairline rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <AlertCircle size={28} />
                            <h3 className="text-lg font-bold text-ink">Delete Report</h3>
                        </div>
                        <p className="text-sm text-ink-subtle leading-relaxed mb-6">
                            Are you sure you want to delete <span className="font-semibold text-ink">"{reportToDelete.title}"</span>? This will permanently remove the report and its AI analysis from both the server and Cloudinary. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setReportToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 border border-hairline text-ink-muted text-sm font-medium rounded-lg hover:bg-surface-3 transition-colors disabled:opacity-50 cursor-pointer duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteReport(reportToDelete._id, {
                                        onSuccess: () => setReportToDelete(null)
                                    });
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer duration-150"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
