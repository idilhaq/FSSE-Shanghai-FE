interface PageSectionProps {
    title: string;
    children: React.ReactNode
}

export function PageSection({ title, children }: PageSectionProps) {
    return (
        <section className="mb-6">
            <h2>{title}</h2>
            {children}
        </section>
    );
}