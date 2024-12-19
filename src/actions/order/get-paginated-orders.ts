'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Address } from '../../interfaces/address.interface';


export const getPaginatedOrders = async() => {

    const session = await auth();

    if( session?.user.role !== 'admin' ) {
        return {
            ok: false,
            message: 'Debe de estar autenticado'
        }
    }

    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
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