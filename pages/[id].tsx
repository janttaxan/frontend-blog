import React, { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostIds, getPostData } from '../lib/posts';
import { IPost } from '../interfaces';
import { Date } from '../components/Date';
import { BackLink } from '../components/BackLink';

type TPostData = {
  postData: IPost
}

const Post = ({postData}: TPostData) => {
  useEffect(() => {
    console.log(postData);
  });
  return (
    <Layout title={postData.title} metaDescription={postData.spoiler}>
      <article>
        <h1>{postData.title}</h1>
        <Date dateString={postData.date}/>
        <div
          style={{margin: '48px 0 0'}}
          dangerouslySetInnerHTML={{__html: postData.contentHtml}}
        />
      </article>
      <BackLink text='вернуться к списку'/>
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
