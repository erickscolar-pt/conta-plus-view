import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from './styles.module.scss'
import iconGanhos from '../../../public/icons/icon_ganhos_green.png'
import Image from "next/image";
import { Title } from "@/component/ui/title";

export default function Metas() {
    return (
        <>
            <Header />
            <div className={styles.component}>
                <MenuLateral />
                <div className={styles.ganhosComponent}>
                    <Title textColor="#0E1557" color="#B7C1DA" icon="metas" text="MINHAS METAS" />
                    <div className={styles.ganhos}>
                        <h1>teste</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {
        props: {}
    }
})
