import { FileUp, X, FileText, Loader2, Info } from 'lucide-react';
import { useUploadReport } from '../hooks/useUploadReport';
import { useState } from 'react';
import toast from 'react-hot-toast';

const UploadReport = ({ onClose }) => {
    const [file, setFile] = useState(null);
    const uploadMutation = useUploadReport();
    const isUploading = uploadMutation.isPending;

    const handleUpload = () => {
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10 MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        uploadMutation.mutate(formData, {
            onSuccess: () => {
                setFile(null);
                onClose();
            }
        });
    };

    return (
        <div onClick={isUploading ? undefined : onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="max-w-md w-full p-6 bg-surface-1 rounded-xl border border-hairline shadow-2xl text-sm">
                <h2 className="text-xl text-ink font-semibold mt-3">Upload your report</h2>

                {isUploading && (
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
                        <Loader2 className="text-primary animate-spin" size={20} />
                        <p className="text-sm text-ink-muted font-medium">Uploading and processing your report...</p>
                    </div>
                )}

                <div className={`border-2 border-dotted border-hairline p-8 mt-6 flex flex-col items-center gap-4 relative rounded-xl ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {!file ? (
                        <label htmlFor="fileInput" className="flex flex-col items-center gap-4 cursor-pointer w-full">
                            <FileUp className="text-primary" size={32} />
                            <p className="text-ink-subtle">Drag files here to upload</p>
                            <p className="text-ink-tertiary">Or <span className="text-primary underline">click here</span> to select a file</p>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".pdf,image/*"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                                disabled={isUploading}
                            />
                        </label>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            <FileText className="text-primary shrink-0" size={32} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-ink font-medium truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-ink-tertiary mt-1">
                                    Size: {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="shrink-0 p-1 hover:bg-surface-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove file"
                                disabled={isUploading}
                            >
                                <X className="text-ink-subtle hover:text-red-400" size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Upload Guidelines */}
                <div className="mt-4 p-3 bg-surface-2 rounded-lg border border-hairline">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={14} className="text-primary" />
                        <span className="text-xs font-semibold text-ink">Upload Guidelines</span>
                    </div>
                    <ul className="text-xs text-ink-tertiary space-y-1 ml-1">
                        <li>• Supported formats: <strong>PDF, PNG, JPG, JPEG</strong></li>
                        <li>• Maximum file size: <strong>10 MB</strong></li>
                        <li>• Example reports: Blood tests, Lipid profiles, Thyroid panels</li>
                        <li>• Your files are encrypted and securely stored</li>
                    </ul>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-6 py-2 border border-hairline bg-surface-2 hover:bg-surface-3 active:scale-95 transition-all text-ink-subtle rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        type="button"
                        className="px-6 py-2 bg-primary hover:bg-primary-hover active:scale-95 transition-all text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                        disabled={isUploading || !file}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <span>Upload File</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadReport;
