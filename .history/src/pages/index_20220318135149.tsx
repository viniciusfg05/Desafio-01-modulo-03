import { GetStaticProps } from 'next';
import Link from 'next/link'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <div className={styles.containerHome}>
      <div className={styles.contentHome}>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero fugit, inventore accusamus maiores eum commodi, perspiciatis, repellendus officia similique saepe iste labore odit distinctio illo fugiat totam ex vel a.
        </p>
      </div>
    </div>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  // const postsResponse = await prismic.query(TODO);

  return {
    props: {}
  }
};
