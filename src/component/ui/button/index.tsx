import { ReactNode,ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
 loading?: boolean,
 children: ReactNode,
}

export function ButtonEntrar({loading, children,...rest}: ButtonProps){
    return(
        <button
        className={styles.btn}
        disabled={loading}
        {...rest}
        >
            {loading ? (
                <FaSpinner color='#fff' size={16}/>
            ) : (
            <>{children}</>
            )}
        </button>
    )
}