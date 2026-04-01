export default function Text({ className = '', children, as = 'span', ...props }) {
    const Component = as;
    return (
        <Component className={`font-sora ${className}`} {...props}>
            {children}
        </Component>
    );
}
