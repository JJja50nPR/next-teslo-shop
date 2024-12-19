'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Address } from '../../interfaces/address.interface';


export const getOrdersByUser = async() => {

    const session = await auth();

    if( !session?.user ) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            OrderAdrress: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    })

    return {
        ok: true,
        orders: orders
    }


}