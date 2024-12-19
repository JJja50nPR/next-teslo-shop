'use server';

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );

export const deleteProductImage = async( imageId: number, imageUrl: string ) => {

    if( !imageUrl.startsWith('http') ) {
        return {
            ok: false,
            error: 'No se pueden borrar imagenes de FS'
        }
    }


    const imageName = imageUrl
        .split('/')
        .pop()
        ?.split('.')[0] ?? '';


    try {
        
        await cloudinary.uploader.destroy( imageName );
        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                Product: {
                    select: {
                        slug: true
                    }
                }
            }
        });

        // Revaliar los paths
        revalidatePath(`/admin/products`);
        revalidatePath(`/admin/products/${deletedImage.Product.slug}`);
        revalidatePath(`/product/${deletedImage.Product.slug}`);

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
    }
}