"use client";

import React from "react";

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    width,
    height,
    borderRadius,
    style,
}) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width,
                height: height,
                borderRadius: borderRadius,
                ...style,
            }}
        />
    );
};

export const CardSkeleton = () => (
    <div className="card" style={{ padding: "1.5rem" }}>
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-text" />
        <Skeleton className="skeleton-text" width="80%" />
    </div>
);
