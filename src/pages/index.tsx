import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { AiOutlineCalendar } from 'react-icons/ai'


interface BodyContentProps{
  body: {
    type: string;
    text: string;
  }
}

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
      <div className={styles.contentHome}>
        {posts.map(post => (
          <div>
            <strong>{post.data.title}</strong>

            {post.data.content.map(content => (
              <p>{content.heading}</p>
            ))}
            


            <div className={styles.info}>
              <time><AiOutlineCalendar className={styles.infoCalender}/>  15 Mar 2021</time>
              <cite>
                <FiUser className={styles.infoUser}/>  Joseph Oliveira
              </cite> 
            </div>
          </div>
        ))}



      </div>

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

  // console.log(JSON.stringify(content, null, 2))

  return {
    props: {
      postsPagination
    }
  }
};
