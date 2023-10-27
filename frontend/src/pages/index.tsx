import { GetServerSideProps } from "next";
import React from "react";

const Home = ({ data }: any) => {
  return <div>Home {data}</div>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("server side props home : ", context.req.url);
  return {
    props: context.query,
  };
};
