import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Alert = ({
    type = "success",
    message = "Operation completed!",
    onClose
}) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 2700);

        const closeTimer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 3000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 300);
    };

    const variants = {
        success: {
            icon: CheckCircle2,
            iconColor: "text-success",
            borderColor: "border-success/30",
            bgColor: "bg-success/10"
        },
        error: {
            icon: AlertCircle,
            iconColor: "text-red-400",
            borderColor: "border-red-500/30",
            bgColor: "bg-red-500/10"
        }
    };

    const variant = variants[type] || variants.success;
    const Icon = variant.icon;

    return (
        <div
            className={`${variant.bgColor} inline-flex items-start gap-3 p-4 text-sm rounded-xl border ${variant.borderColor} backdrop-blur-sm transition-all duration-300 ${
                isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
        >
            <Icon
                size={18}
                className={`${variant.iconColor} shrink-0 mt-0.5`}
                strokeWidth={1.5}
            />
            <div>
                <h3 className="text-ink font-medium">{message}</h3>
            </div>
            {onClose && (
                <button
                    type="button"
                    aria-label="close"
                    onClick={handleClose}
                    className="cursor-pointer ml-auto text-ink-tertiary hover:text-ink active:scale-95 transition"
                >
                    <X size={14} strokeWidth={2} />
                </button>
            )}
        </div>
    );
};

export default Alert;
