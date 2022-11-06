import Head from 'next/head';
import { useRouter } from 'next/router';
import Spinner from '../../../components/helpers/Spinner';

const VideoVew = () => {
    const router = useRouter();
    const { url } = router.query;

    const res =
        typeof url !== 'undefined' ? (
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
                    <title>Video Preview</title>
                </Head>
                <video controls muted>
                    <source src={(url as string).replaceAll('%2F', '/')} />
                    Your browser does not support the video tag.
                </video>
            </div>
        ) : (
            <Spinner />
        );
    return res;
};

export default VideoVew;
