import Prismic from '@prismicio/client'
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { useState } from 'react';

import { getPrismicClient } from '../../services/prismic';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  resultsPosts: Post;
}

export default function Post( {resultsPosts}:PostProps ) {
  console.log(resultsPosts.data)



  return (
    <>
      {/* {resultsPosts.data.content.map(content => {
        return(
          <article key={content.heading}>{content.heading}</article>
        )
      })} */}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
const prismic = getPrismicClient();
const { slug } = context.params;
const response = await prismic.getByUID<any>('posts', String(slug), {})

const posts = {
  uid: response.uid,
  first_publication_date: response.first_publication_date,
  data: {
    title:  response.data.title,
    banner: {
      url: response.data.banner.url,
    },
    author: response.data.author,
    content: response.data.content.map(content => {
      return {
        heading: content.heading,
        body: [...content.body],
      };
    }),
  }
}

console.log(JSON.stringify(posts, null, 2))

return {  
  props: { resultsPosts: posts },
}
};
