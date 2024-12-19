import type { Size } from '@/interfaces'
import clsx from 'clsx';

interface Props {
    selectedSize?: Size;
    availablleSizes: Size[]; // ['SX', 'M']

    onSizeChanged: ( size: Size ) => void;
}


export const SizeSelector = ({ selectedSize, availablleSizes, onSizeChanged }: Props ) => {
  return (
    <div className='my-5'>
      <h3 className='font-bold mb-4'>Tallas disponibles</h3>

      <div className='flex'>
        {
          availablleSizes.map( size => (
            <button 
              key={size}
              onClick={ () => onSizeChanged(size) }
              className={
                clsx(
                  'mx-2 hover:underline text-lg',
                  {
                    'underline': size === selectedSize
                  }
                )
              }
            >
              {size}
            </button>
          ))

        }
      </div>

    </div>
  )
}
