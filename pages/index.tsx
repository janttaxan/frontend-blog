import React from 'react';
import styles from './index.module.scss';
import { Layout } from '../components/Layout/';
import { GetStaticProps } from 'next';
import { getSortedPostsData } from '../lib/posts';
import { IPost } from '../interfaces';
import { PostList } from '../components/PostList';

const Home = ({allPostsData}: {allPostsData: IPost[]}) => (
  <Layout home>
    <section className={styles.posts}>
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
