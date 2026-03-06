import React from "react";
import { Grid, Skeleton, Box } from "@mui/material";

const ProductSkeleton = ({ count = 4 }) => {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: count }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box
                        sx={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid rgba(15,23,42,0.06)",
                            boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: "100%",
                                height: 200,
                                bgcolor: "rgba(30,60,114,0.06)",
                            }}
                            animation="wave"
                        />
                        <Box sx={{ p: 2.5 }}>
                            <Skeleton
                                variant="text"
                                width="70%"
                                height={28}
                                animation="wave"
                                sx={{ bgcolor: "rgba(30,60,114,0.08)" }}
                            />
                            <Box sx={{ display: "flex", gap: 1, my: 1.5 }}>
                                <Skeleton
                                    variant="rounded"
                                    width={70}
                                    height={24}
                                    animation="wave"
                                    sx={{ borderRadius: 3, bgcolor: "rgba(30,60,114,0.06)" }}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width={70}
                                    height={24}
                                    animation="wave"
                                    sx={{ borderRadius: 3, bgcolor: "rgba(30,60,114,0.06)" }}
                                />
                            </Box>
                            <Skeleton
                                variant="text"
                                width="40%"
                                height={20}
                                animation="wave"
                                sx={{ mb: 1, bgcolor: "rgba(30,60,114,0.06)" }}
                            />
                            <Skeleton
                                variant="text"
                                width="30%"
                                height={36}
                                animation="wave"
                                sx={{ mb: 2, bgcolor: "rgba(30,60,114,0.08)" }}
                            />
                            <Skeleton
                                variant="rounded"
                                width="100%"
                                height={42}
                                animation="wave"
                                sx={{ borderRadius: 2, bgcolor: "rgba(30,60,114,0.08)" }}
                            />
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductSkeleton;
