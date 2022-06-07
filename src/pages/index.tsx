import { GetStaticProps } from 'next';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai'

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import styles from './home.module.scss';
import Prismic from '@prismicio/client'
import Link from 'next/link';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface ContentProp {
  content: {
    heading: string;
    body: {
      text: string;
    }[];
  }[];
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export function formatDate(date: string): string {
  const formattedDate = format(new Date(date), 'dd  MMM yyyy', {
    locale: ptBR,
  });
  return formattedDate;
}

export default function Home({postsPagination}: HomeProps) { 
  const { next_page, results } = postsPagination;

  const [ posts, setPosts ] = useState<Post[]>(results)
  const [ nextPage, setNextPage ] = useState(next_page)
  
  async function handleNextPage(): Promise<void> {
    const response = await (await fetch(nextPage)).json();
      setNextPage(response.next_page)
      setPosts([...posts, ...response.results]);
  }

  return (
    <div className={styles.containerHome}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}> 
            <div className={styles.contentHome}>
              <strong>{post.data.title}</strong>  
              {<p>{post.data.subtitle}</p>}
              <div className={styles.info}>
                <time><AiOutlineCalendar className={styles.infoCalender}/>{formatDate(post.first_publication_date)}</time>
                <cite>
                  <FiUser className={styles.infoUser}/>  { post.data.author }
                </cite> 
              </div>
              <div className={styles.divide}/>
            </div>
          </Link>
        ))}
        
          {nextPage && (
            <button onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );
  

  const mapPostsResults = postsResponse.results.map(resultPostPrismic => {
    // console.log('Bem sucedido')
  console.log(JSON.stringify(resultPostPrismic.data, null, 2))

    return {
      
      uid: resultPostPrismic.uid,
      first_publication_date: resultPostPrismic.first_publication_date,
      data: {
        title: resultPostPrismic.data.title,
        subtitle: resultPostPrismic.data.subtitle,
        author: resultPostPrismic.data.author,
        content: resultPostPrismic.data.content.map(content => {
          return {
            heading: content.heading,
            body: [...content.body],
          };
        }),
      },
    }
  })


  const postsPagination = {
    next_page: postsResponse.next_page,
    results: mapPostsResults
  }



  console.log(postsPagination)
  return {
    props: {
      postsPagination
    }
  }
};
