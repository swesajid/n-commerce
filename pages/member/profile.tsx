import Head from 'next/head';
import PrivateRoute from '../../components/auth/PrivateRoute';
import PublicLayout from '../../components/layouts/public/Public.layout';
import ProfileBanner from '../../components/profilepage/ProfileBanner';
import ProfileInfo from '../../components/profilepage/ProfileInfo';

const ProfilePage = () => {
    return (
        <PrivateRoute>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
                />
                <link rel="stylesheet" href="/homepage.css" />
                <link rel="stylesheet" href="/profile.css" />
                <title>Skate Ontario | My Profile</title>
            </Head>

            <PublicLayout>
                <ProfileBanner />
                <ProfileInfo />
            </PublicLayout>
        </PrivateRoute>
    );
};

export default ProfilePage;
