
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Dashboard Data for Seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        const storeId = await authSeller(userId);

        // Validate seller authorization before querying Prisma
        if (typeof storeId !== "string" || !storeId) {
            return NextResponse.json(
                { error: "Seller not authorized or store not active" },
                { status: 403 }
            );
        }

        // Get all orders for seller
        const orders = await prisma.order.findMany({
            where: { storeId }
        });

        // Get all products for seller
        const products = await prisma.product.findMany({
            where: { storeId }
        });

        // Get ratings for seller products
        const ratings = await prisma.rating.findMany({
            where: {
                productId: {
                    in: products.map(product => product.id)
                }
            },
            include: {
                user: true,
                product: true
            }
        });

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(
                orders.reduce((acc, order) => acc + order.total, 0)
            ),
            totalProducts: products.length
        };

        return NextResponse.json({ dashboardData });

    } catch (error) {
        console.error("Seller Dashboard Error:", error);

        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}
