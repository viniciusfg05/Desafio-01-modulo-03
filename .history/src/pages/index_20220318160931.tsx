import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  mapPostsResults: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({mapPostsResults}: PostPagination) {
  

  return (

    

    <div className={styles.containerHome}>
      <div className={styles.contentHome}>

      { mapPostsResults.map(post => (
        <Link key={post.uid} href={`/posts/${post.uid}`}>
          <a>
              <time>{post.first_publication_date}</time>
              <strong>{post.data.title}</strong>
              <p></p>
          </a>
        </Link>
      )) }

      </div>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 2,
      orderings: '[document.last_publication_date desc]',
    }
  );
  
  return {
    props: {
      mapPostsResults: postsResponse,
    },
    revalidate: 1800,
  };

  // console.log(JSON.stringify(postsResponse, null, 2))

};
