import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';
import iconGanhos from '../../../../public/icons/icon_ganhos_green.png'
import iconGastos from '../../../../public/icons/icon_gastos_red.png'
import iconMetas from '../../../../public/icons/icon_metas_blue.png'
import iconDashboard from '../../../../public/icons/icon_dashboard_purple.png'
import Image from "next/image";
import Head from 'next/head';


interface TitleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: 'ganhos' | 'gastos' | 'metas' | 'dashboard',
    color: string,
    text: string
    textColor: string
}

export function Title({ icon, textColor, color, text }: TitleProps) {
    return (
        <div style={{ backgroundColor: color }} className={styles.title}>
            <Head>
                <title>Conta Plus - {icon ? icon : ''}</title>
            </Head>
            <h1 style={{ color: textColor }}>
                <>{text}</>
            </h1>
            {
                icon === "ganhos" ?
                    < Image alt="" src={iconGanhos} /> :

                    icon === "gastos" ?
                        < Image alt="" src={iconGastos} /> :

                        icon === "metas" ?
                            < Image alt="" src={iconMetas} /> :

                            icon === "dashboard" ?
                                < Image alt="" src={iconDashboard} /> :


                                <></>
            }

        </div>
    )
}