import { OrderStatus, PayPalButton, Title } from "@/components";

import Image from "next/image";
import { getOrderById } from "@/actions";
import { currencyFormat } from "@/utils";
import { redirect } from "next/navigation";


interface Props {
  params: {
    id: string;
  }
}

export default async function OrdersByIdPage({params}: Props) {

  const {id} = params;

  // Todo: Llamar server actions
  const {ok, order} = await getOrderById(id);

  if( !ok ) {
    redirect('/')
  }

  console.log(order?.OrderItem)


  const address = order!.OrderAdrress;



  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">
        <Title
          title={`Orden #${id.split('-').at(-1)}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={ order?.isPaid ?? false}/>
          


          {/* Items */}
          {
            order?.OrderItem.map( item =>(
              <div key={item.product.slug + '-'+item.size} className="flex mb-5">
                <Image
                  src={`/products/${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>${item.price} x {item.quantity}</p>
                  <p className="font-bold">Subtotal: { currencyFormat(item.price * item.quantity) }</p>

                </div>

       
              </div>
            ))
          }
          </div>


          {/* Checkout */}

          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2 ">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{order?.OrderAdrress?.firstName} {order?.OrderAdrress?.lastName}</p>
              <p>{order?.OrderAdrress?.address}</p>
              <p>{order?.OrderAdrress?.address2}</p>
              <p>{order?.OrderAdrress?.postalCode}</p>
              <p>
                {order?.OrderAdrress?.city}, {order?.OrderAdrress?.countryId}
              </p>
              <p>{order?.OrderAdrress?.phone}</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>


            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Products</span>
              <span className="text-right">
                { order?.itemsInOrder === 1 ? "1 artículo" : `${order?.itemsInOrder} artículos` }
              </span>

              <span>Subtotal</span>
              <span className="text-right">{ currencyFormat(order!.subTotal) }</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{ currencyFormat(order!.tax) }</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-right text-2xl">{ currencyFormat(order!.total) }</span>
            </div>

            <div className="mt-5 mb-2 w-full relative z-0">

              {
                order?.isPaid 
                ? (
                  <OrderStatus isPaid={ order?.isPaid ?? false}/>

                )
                : (

                  <PayPalButton 
                    amount={order!.total}
                    orderId={order!.id}
                  />

                )
              }

              


            </div>

          </div>

        </div>
      </div>

    </div>
  );
}