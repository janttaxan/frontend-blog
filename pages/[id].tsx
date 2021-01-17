import React from 'react';
import { Layout } from '../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData } from '../lib/posts';
import { IPost } from '../interfaces';
import { Date } from '../components/Date';

type TPostData = {
  postData: IPost
}

const Post = ({postData}: TPostData) => {
  return (
    <Layout title={postData.title}>
      <article>
        <h1>{postData.title}</h1>
        <Date dateString={postData.date}/>
        <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!params) return {props: {}};
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export default Post;
