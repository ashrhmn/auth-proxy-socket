// import SocketComponent from "@/components/socket";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
const SocketComponent = dynamic(() => import("@/components/socket"), {
  ssr: false,
});

const AboutPage = ({ data }: any) => {
  const router = useRouter();

  return (
    <div>
      <span>
        AboutPage {data} {router.query.id}
      </span>
      <SocketComponent />
    </div>
  );
};

export default AboutPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("server side props about : ", context.req.url);
  return {
    props: context.query,
  };
};
