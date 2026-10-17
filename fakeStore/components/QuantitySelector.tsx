'use client';

interface QuantitySelectorProps {
    value: number;
    min?: number;
    max: number;
    onChange: (next: number) => void;
    /** Optional label shown above the control. */
    label?: string;
}

/**
 * Controlled quantity stepper with built-in validation:
 * - the minus button is disabled at `min` (default 0)
 * - the plus button is disabled at `max` (stock)
 * - manual typing is clamped into [min, max]
 */
export default function QuantitySelector({
    value,
    min = 0,
    max,
    onChange,
    label,
}: QuantitySelectorProps) {
    const atMin = value <= min;
    const atMax = value >= max;

    const clamp = (n: number) => Math.max(min, Math.min(n, max));

    const btnStyle = (disabled: boolean) => ({
        width: '36px',
        height: '36px',
        fontSize: '18px',
        lineHeight: 1,
        border: '1px solid #cbd5e0',
        borderRadius: '6px',
        background: disabled ? '#edf2f7' : '#fff',
        color: disabled ? '#a0aec0' : '#1a202c',
        cursor: disabled ? 'not-allowed' : 'pointer',
    });

    return (
        <div>
            {label && (
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#4a5568' }}>
                    {label}
                </label>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={atMin}
                    onClick={() => onChange(clamp(value - 1))}
                    style={btnStyle(atMin)}
                >
                    −
                </button>
                <input
                    type="number"
                    aria-label="Quantity"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => {
                        const parsed = Number(e.target.value);
                        onChange(clamp(Number.isNaN(parsed) ? min : parsed));
                    }}
                    style={{
                        width: '56px',
                        height: '36px',
                        textAlign: 'center',
                        border: '1px solid #cbd5e0',
                        borderRadius: '6px',
                        color: '#1a202c',
                    }}
                />
                <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={atMax}
                    onClick={() => onChange(clamp(value + 1))}
                    style={btnStyle(atMax)}
                >
                    +
                </button>
            </div>
        </div>
    );
}
