'use client';

import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";
import { useCartStore } from "@/store";

import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function CheckoutPage() {

  const products = useCartStore( state => state.cart );
  const router = useRouter();

  useEffect(() => {


    if (products.length === 0) {
      router.push('/');
    }
  }, [products, router])

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">
        <Title
          title="Verificar orden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span>Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>
          


          {/* Items */}
          
          <ProductsInCart/>
          </div>


          {/* Checkout */}
          <PlaceOrder/>


        </div>
      </div>

    </div>
  );
}