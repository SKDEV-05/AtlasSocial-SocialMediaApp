export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logo-gradient)" strokeWidth="8" opacity="0.2" />
            <path 
                d="M30 40C30 31.7157 36.7157 25 45 25H65C73.2843 25 80 31.7157 80 40V60C80 68.2843 73.2843 75 65 75H45C41.134 75 37.634 73.5447 35 71.1716L22 78V65C22 65 22 64.9126 22 64.7368C22 64.1209 22.1818 63.5455 22.5 63.0526C24.47 59.97 27 56 30 52.5V40Z" 
                fill="url(#logo-gradient)" 
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
            />
            <circle cx="45" cy="50" r="4" fill="white" />
            <circle cx="55" cy="50" r="4" fill="white" opacity="0.8" />
            <circle cx="65" cy="50" r="4" fill="white" opacity="0.6" />
        </svg>
    );
}
