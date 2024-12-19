import { Title } from '@/components';
import { AdressForm } from './ui/AdressForm';
import { getCountries, getUserAddress } from '@/actions';
import { countries } from '../../../../seed/seed-countries';
import { auth } from '@/auth.config';

export default async function AdressPage() {

  const countries = await getCountries();

  const session = await auth();

  if( !session?.user ) {
    return (
      <h3 className='text-5xl'>500 - No hay sesión del usuario</h3>
    )
  }

  const userAddress = await getUserAddress(session.user.id) ?? undefined;

  console.log(userAddress)



  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">



      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AdressForm countries={countries} userStoreAddress={ userAddress }/>

      </div>

    </div>
  );
}