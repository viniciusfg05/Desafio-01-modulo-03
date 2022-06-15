import Prismic from '@prismicio/client'
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { Suspense, useState } from 'react';

import { getPrismicClient } from '../../services/prismic';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiClock, FiUser } from 'react-icons/fi';
import { formatDate } from '..';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  
  return (
    <>
     {router.isFallback ? (
      <div>Carregando...</div>
     ) : (
      <>
        <div className={styles.banner}>
          <img src={resultsPosts.data.banner.url} alt={resultsPosts.data.title} />
        </div>
        <div className={styles.ConteinerPosts}>
          <main className={styles.ContentMain}>
            <header>
              <strong>{resultsPosts.data.title}</strong>
              <div className={styles.Infos}>
                <time><AiOutlineCalendar className={styles.icons}/>{formatDate(resultsPosts.first_publication_date)}</time>
                <cite><FiUser className={styles.icons}/>{resultsPosts.data.author}</cite>
                <p><FiClock className={styles.icons}/> 4 min</p>
              </div>
            </header>
            <section>
              {resultsPosts.data.content.map(content => {
                return (
                  <div key={resultsPosts.uid} className={styles.contentSection}>
                    <article>{content.heading}</article>
                    <div 
                      className={styles.body}
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(content.body)}}
                    />
                </div>
                )
              })}
            </section>
          </main>
        </div>
      </>
     )}
      
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

return {  
  props: { resultsPosts: response },
}
};
