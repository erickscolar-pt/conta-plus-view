import { ReactNode,ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';

import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
 loading?: boolean,
 bg?: string,
 color?: string,
 children: ReactNode,
}

export function ButtonPages({loading, children, bg ,color ,...rest}: ButtonProps){
    return(
        <button
        style={{ backgroundColor: bg ? bg : '#599E52', color: color ? color : '#FFF' }}
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