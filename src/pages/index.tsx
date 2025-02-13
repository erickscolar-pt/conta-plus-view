import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import styles from "../../styles/Home.module.scss";
import Image from "next/image";
import imgLogo from "../../public/logo_login.png";
import imgfundo from "../../public/img_login.png";
import { Button } from "@/component/ui/button";
import { AuthContexts } from "../contexts/AuthContexts";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";
import Router from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setupAPIClient } from "@/services/api";
import FloatingButton from "@/component/floatingbutton";
import Link from "next/link";
import Chat from "@/pages/chat";

export default function Home() {
  const { signIn } = useContext(AuthContexts);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (username === "" || password === "") {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    let data = {
      username,
      password,
    };

    await signIn(data);
    setLoading(false);
  }

  const colors = ["#0E5734", "#570E0E", "#0E1557"];
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <ul className={styles.shapes}>
          {[...Array(20)].map((_, i) => (
            <li
              key={i}
              style={{ "--i": i + 4, backgroundColor: colors[i % 3] }}
            ></li>
          ))}
        </ul>
        <FloatingButton />

        <div className={styles.login}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h1 className={styles.titulo}>Login</h1>
            <span>Nome de usuario ou E-mail</span>
            <input
              type="text"
              placeholder="Nome de usuário ou e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <span>Senha</span>
            <div className={styles.passwordInputContainer}>
              <input
                className={styles.inputPassword}
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Link href="/forgotpassword" className="w-full m-2 justify-center">Esqueci minha senha</Link>
            <Button
              type="submit"
              loading={loading}
              className={styles.buttonLogin}
            >
              Entrar
            </Button>
            <div
              className={styles.cadastro}
              onClick={() => {
                Router.push("/signup");
              }}
            >
              Cadastrar
            </div>
            <div className={styles.container_image}>
              <Image width={50} src={imgLogo} alt="" />
            </div>
          </form>
          <div className={styles.fButton}>
            <FloatingButton />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  return {
    props: {},
  };
});
