import Image from "next/image";
import { canSSRGuest } from "../../utils/canSSRGuest";
import styles from './styles.module.scss'
import iconGanhos from '../../../public/icons/icon_ganhos.png'
import iconGastos from '../../../public/icons/icon_gastos.png'
import iconMetas from '../../../public/icons/icon_metas.png'
import iconDashboard from '../../../public/icons/icon_dashboard.png'
import exit from '../../../public/icons/ci_exit.png'
import { useEffect, useState, useContext } from "react";
import Router from 'next/router'
import { AuthContexts } from "@/contexts/AuthContexts";

export default function MenuLateral() {
    const [id, setId] = useState(0)
    const { signOut } = useContext(AuthContexts)

    useEffect(() => {
        if (window) {
            setId(parseInt(sessionStorage.getItem('id')))
        }
    }, [])

    return (
        <div className={styles.content}>
            <div className={styles.menuLateral}>

                <div className={styles.listbutton}>
                    <button className={styles.ganhos}
                        onClick={() => { Router.push('/ganhos') }}>
                        <Image alt="" src={iconGanhos} />
                    </button>

                    <button className={styles.gastos}
                        onClick={() => { Router.push('/gastos') }}>
                        <Image alt="" src={iconGastos} />
                    </button>

                    <button className={styles.metas}
                        onClick={() => { Router.push('/metas') }}>
                        <Image alt="" src={iconMetas} />
                    </button>

                    <button className={styles.dashboard}
                        onClick={() => { Router.push('/dashboard') }}>
                        <Image alt="" src={iconDashboard} />
                    </button>


                    <button className={styles.exit}
                        onClick={() => { signOut() }}>
                        <Image alt="" src={exit} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

    return {
        props: {}
    }
})
