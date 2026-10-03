interface BadgeProps {
    variant: "in-stock" | "out-of-stock";
}

export function Badge({ variant }: BadgeProps) {
    const isReady = variant === "in-stock";
    const classes = isReady
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    return (
        <span className={`text-xs px-2 py-1 rounded-full ${classes}`}>
            {isReady ? "In stock" : "Out of stock"}
        </span>
    );
}