'use server';

import prisma from "@/lib/prisma";

export const getProductsByOrderId = async( orderId: string) => {
    try {

        const orderItems = await prisma.orderItem.findMany({
            where: {
                orderId
            }
        });

        const products = await Promise.all(orderItems.map(async (item) => {
            return await prisma.product.findFirst({
                where: {
                    id: item.productId
                }
            });
        }));

        const productsImages = await Promise.all(products.map(async (product) => {
            if (!product) return null;

            return await prisma.productImage.findFirst({
                where: {
                    productId: product.id
                }
            })
        }))


        const combinedItems = orderItems.map((orderItem) => {
            const product = products.find(p => p?.id === orderItem.productId);
            const productImage = productsImages.find( img => img?.productId === orderItem.productId )

            return {
                quantity: orderItem.quantity,
                title: product?.title,
                slug: product?.slug,
                price: product?.price,
                image: productImage?.url
            };
        });


        
        return combinedItems;
        




        
    } catch (error) {
        console.log(error);
    }
}