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

export default function Home({postsPagination}: HomeProps) {  
  const formattedPost = postsPagination.results.map(post => {
    // const readTime = getReadTime(post);

    return {
      ...post,
      data: {
        ...post.data,
      },
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  })



  const [ posts, setPosts ] = useState<Post[]>(formattedPost)


  return (
    


    <div className={styles.containerHome}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}> 
            <div className={styles.contentHome}>
              <strong>{post.data.title}</strong>  
              {<p>{post.data.content[0].body}</p>}
              <div className={styles.info}>
                <time><AiOutlineCalendar className={styles.infoCalender}/>{post.first_publication_date}</time>
                <cite>
                  <FiUser className={styles.infoUser}/>  { post.data.author }
                </cite> 
              </div>
              <div className={styles.divide}/>
            </div>
          </Link>
        ))}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ])

  const mapPostsResults = postsResponse.results.map(resultPostPrismic => {
    // console.log(JSON.stringify(content[0].body, null, 2))
    // console.log('Bem sucedido')
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
            body: RichText.asText(content.body).substr(0, 100),
          };
        }),
      },
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: mapPostsResults
  }

  console.log(JSON.stringify(postsPagination, null, 2))

  return {
    props: {
      postsPagination
    }
  }
};
