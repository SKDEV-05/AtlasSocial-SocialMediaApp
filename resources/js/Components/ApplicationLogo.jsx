export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/atlas-lion.svg"
            alt="Atlas Social Logo"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
