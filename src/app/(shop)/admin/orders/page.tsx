export const revalidate = 0;

import { getPaginatedOrders } from '@/actions';
import { Pagination, Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

export default async function OrdersPage() {
  const { ok, orders = [] } = await getPaginatedOrders();

  if (!ok) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Todas las orders" clasName="px-2" />

      <div className="mb-10 overflow-x-auto px-2">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left whitespace-nowrap">
                Nombre completo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">
                Estado
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-2 text-left">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.split('-').at(-1)}
                </td>
                <td className="text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">
                  {order.OrderAdrress?.firstName} {order.OrderAdrress?.lastName}
                </td>
                <td className="flex items-center text-sm text-gray-900 font-light px-4 py-2 whitespace-nowrap">
                  {order.isPaid ? (
                    <>
                      <IoCardOutline className="text-green-800" />
                      <span className="mx-2 text-green-800">Pagada</span>
                    </>
                  ) : (
                    <>
                      <IoCardOutline className="text-red-800" />
                      <span className="mx-2 text-red-800">No Pagada</span>
                    </>
                  )}
                </td>
                <td className="text-sm text-gray-900 font-light px-4 py-2">
                  <Link href={`/orders/${order.id}`} className="hover:underline">
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={ 3 } />
      </div>
    </>
  );
}
