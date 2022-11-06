import { Fragment } from 'react';
import Footer from '../../homepage/Footer';
import Navbar from '../../homepage/Navbar';

const PublicLayout = (props: any) => {
    return (
        <Fragment>
            <Navbar />
            <main style={{ minHeight: '50vh' }}>{props.children}</main>
            <Footer />
        </Fragment>
    );
};

export default PublicLayout;
