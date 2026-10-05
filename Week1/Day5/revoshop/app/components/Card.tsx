interface CardProps {
    children: React.ReactNode
}

export function Card({ children }: CardProps) {
    return (
        <div className="flex flex-row gap-4 border border-gray-700 rounded-lg p-4">
            {children}
        </div>
    );
}