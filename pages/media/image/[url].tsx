import Fragment from 'react';
import { useRouter } from 'next/router';
import Spinner from '../../../components/helpers/Spinner';
import Head from 'next/head';

const MediaVew = () => {
    const router = useRouter();
    const { url } = router.query;

    const res = typeof url !== 'undefined' ? <img src={(url as string).replaceAll('%2F', '/')} /> : <Spinner />;
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Head>
                <title>Image Preview</title>
            </Head>
            {res}
        </div>
    );
};

export default MediaVew;
