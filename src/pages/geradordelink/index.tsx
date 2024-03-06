import LinkComponent from "@/component/linkcomponent";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";

export default function GeradorDeLink() {
  return (
    <>
      <Header/>
      <LinkComponent/>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  
  return {
    props: {}
  }
})
