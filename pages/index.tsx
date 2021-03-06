import React from 'react';
import { Layout } from '../components/Layout/';
import { getSortedPostsData } from '../lib/posts';
import { IPost } from '../interfaces/IPost';
import { PostList } from '../components/PostList';
import { GetStaticProps } from 'next';

const Home = ({allPostsData}: {allPostsData: IPost[]}) => (
  <Layout home>
    <section>
      <PostList posts={allPostsData}/>
    </section>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default Home;
