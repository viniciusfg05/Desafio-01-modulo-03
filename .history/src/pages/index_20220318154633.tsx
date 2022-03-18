import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string;
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
        <p>{post.data.subtitle}</p>
      )) }

      </div>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['publication.title, publication.content']
  });

  const mapPostsResults = postsResponse.results.map(resultPostPrismic => {
    return {
      uid: resultPostPrismic.uid,
      first_publication_date: resultPostPrismic.data.first_publication_date,
      data: {
        title: resultPostPrismic.data.title,
        subtitle: resultPostPrismic.data.subtitle,
        author: resultPostPrismic.data.author,
      }
    }
  })

  // console.log(JSON.stringify(postsResponse, null, 2))

  return {
    props: {
      mapPostsResults
    }
  }
};
