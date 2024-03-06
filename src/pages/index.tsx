import { FormEvent, useContext, useState } from "react";
import Head from 'next/head';
import styles from '../../styles/Home.module.scss';
import Image from 'next/image';
import imgLogo from '../../public/logo_login.png';
import imgfundo from '../../public/img_login.png'

import { ButtonEntrar } from "@/component/ui/button";

import { AuthContexts } from '../contexts/AuthContexts';
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";
import Link from "next/link";
import Router from 'next/router'

export default function Home() {
  const { signIn } = useContext(AuthContexts)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (username === '' || password === '') {
      toast.warning("Preencha todos os campos!")
      return;
    }

    setLoading(true)

    let data = {
      username,
      password
    }

    await signIn(data)
    setLoading(false)
  }



  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <Image width={500} src={imgfundo} alt="" />

        <div className={styles.login}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h1 className={styles.titulo}>Login</h1>
            <span>E-mail</span>
            <input
              type="text"
              placeholder='Digite seu nome de usuario'
              value={username}
              onChange={(e) => setUsername(e.target.value)} />

            <span>Senha</span>
            <input
              type="password"
              placeholder='**********'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <ButtonEntrar
              type="submit"
              loading={loading}
            >
              Entrar
            </ButtonEntrar>
            <div
              className={styles.cadastro}
              onClick={()=>{Router.push('/signup')}}
            >
              Cadastrar
            </div>
            <div className={styles.container_image}>
              <Image width={50} src={imgLogo} alt="" />
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {



  return {
    props: {}
  }
})
