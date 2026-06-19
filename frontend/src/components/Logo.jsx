import logo from "../assets/logo.svg";

const Logo = () => {
    return (
        <div className="inline-flex items-center gap-1">
            <img
                src={logo}
                alt="LabLens Logo"
                className="w-9 h-9"
            />
            <span className="text-xl font-semibold tracking-tight text-ink">
                LabLens
            </span>
        </div>
    );
};

export default Logo;
