import * as React from 'react';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import Navbar from '../../../components/homepage/Navbar';
import HomeBanner from '../../../components/homepage/HomeBanner';
import HomeAnnouncement from '../../../components/homepage/HomeAnnouncement';
import HomeEvent from '../../../components/homepage/HomeEvent';
import HomeMembership from '../../../components/homepage/HomeMembership';
import HomeResources from '../../../components/homepage/HomeResources';
import HomeJob from '../../../components/homepage/HomeJob';
import Footer from '../../../components/homepage/Footer';
import Head from 'next/head';
import PublicLayout from '../../../components/layouts/public/Public.layout';

const Homepage = () => {
    return (
        <PrivateRoute>
            <Head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
                />
                <link rel="stylesheet" href="/homepage.css" />
                <title>Skate Ontario</title>
            </Head>
            <PublicLayout>
                <HomeBanner />
                <HomeAnnouncement />
                <HomeMembership />
                <HomeResources />
                <HomeEvent />
                <HomeJob />
            </PublicLayout>
        </PrivateRoute>
    );
};

export default Homepage;