import Image from "next/image";
import { canSSRGuest } from "../../utils/canSSRGuest";
import styles from './styles.module.scss'
import Link from "next/link";
import avatar from '../../../public/Avatar.png'
import logo from '../../../public/logo.png'
import { FaBell, FaRegCopy, FaInfo } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { useContext } from "react";
import { AuthContexts } from "@/contexts/AuthContexts";


export default function Header() {
  const { signOut } = useContext(AuthContexts)

    return (
        <header className={styles.fixedheader}>
          <Image src={logo} alt="" />
        <nav>
          <ul>
            <li>
              <button onClick={signOut}><BiExit />Sair</button>
            </li>
            <li>
              <Link href="/"><FaInfo/></Link>
            </li>
            <li>
              <Link href="/"><FaBell/></Link>
            </li>
          </ul>
        </nav>
        <Image src={avatar} alt=""/>
      </header>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

    return {
        props: {}
    }
})
