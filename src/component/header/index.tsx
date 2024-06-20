import Image from "next/image";
import { canSSRGuest } from "../../utils/canSSRGuest";
import styles from "./styles.module.scss";
import Link from "next/link";
import avatar from "../../../public/Avatar.png";
import logo from "../../../public/logo_branco.png";
import { FaBell, FaRegCopy, FaInfo } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { useContext } from "react";
import { AuthContexts } from "@/contexts/AuthContexts";
import Router from "next/router";

export default function Header() {
  const { signOut } = useContext(AuthContexts);

  return (
    <header className={styles.fixedheader}>
      <Image src={logo} alt="" />
      <div className={styles.direita}>
        <Link href="/manual" className="flex items-center space-x-1">
          <span>Manual</span>
        </Link>
        <Image
          onClick={() => {
            Router.push("/perfil");
          }}
          className={styles.perfil}
          src={avatar}
          alt=""
        />
      </div>
    </header>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
