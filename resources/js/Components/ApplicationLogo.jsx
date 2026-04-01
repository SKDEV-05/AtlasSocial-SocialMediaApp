export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            src="/Twasel.svg"
            alt="Twasel Logo"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
