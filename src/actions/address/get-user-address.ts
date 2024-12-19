'use server';

import prisma from "@/lib/prisma";

export const getUserAddress = async( userId: string ) => {
    try {

        const address = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        });

        if ( !address ) return null;
        
        const { countryId, adress2, ...rest} = address;

        return {
            ...rest,
            country: countryId,
            address2: adress2 ? adress2 : '',
        };
        
    } catch (error) {
        console.log(error);
        return null;
        
    }
}