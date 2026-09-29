interface ModalProps {
    header: string;
    children: React.ReactNode;
}

export function Modal({ header, children }: ModalProps) {
    return (
        <div className="border border-blue-500 rounded-lg max-w-sm">
            <header>{header}</header>
            <body>{children}</body>
        </div>
    );
}