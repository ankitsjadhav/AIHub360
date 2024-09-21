"use client";

import { useState } from "react";

interface FreeCounterProps {
    apiLimitCount: number;
};

export const FreeCounter = ({
    apiLimitCount = 0
}: FreeCounterProps) => {
    const [mounted, setMounted] = useState(false);
    return (
        <div>
            Free Counter
        </div>
    )
}