import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from './styles.module.scss'
import iconGanhos from '../../../public/icons/icon_ganhos_green.png'
import Image from "next/image";
import { Title } from "@/component/ui/title";

export default function Ganhos() {
    return (
        <>
            <Header />
            <div className={styles.component}>
                <MenuLateral />
                <div className={styles.ganhosComponent}>
                    <Title textColor="#0E5734" color="#B5E1A0" icon="ganhos" text="MEUS GANHOS" />
                    <div className={styles.ganhos}>
                        <h1>teste</h1>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
                        <p>teste teste teste teste teste teste teste teste</p>
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
