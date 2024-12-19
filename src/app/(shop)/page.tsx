export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { ProductGrid, Title } from "@/components";
import { redirect } from 'next/navigation';
import { Pagination } from '../../components/ui/pagination/Pagination';

interface Props {
  searchParams: {
    page?: string;
  }
}

 
export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({page});

  if( products.length === 0 ) {
    redirect('/')
  }


  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        clasName="mb-2"
      />

      <ProductGrid
        products={products}
      />

      <Pagination totalPages={totalPages}/>

    </>
  );
}
