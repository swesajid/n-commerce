import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSingleProfileFromAPI, iAPIProfile } from '../../api_calls/profile.api';
import { authContext } from '../../contexts/auth.context';
import parse from 'html-react-parser';

export default function ProfileInfo() {
    const [loading, setLoading] = useState(true);
    const [profileInfo, setProfileInfo] = useState<iAPIProfile | null>(null);
	const router = useRouter();
    const userInfo = useContext(authContext);

	const id = userInfo?.user?._id;

	useEffect(() => {
        const getProfileInfo = async () => {
			
            const profileinfo = await getSingleProfileFromAPI(id as string);
			if (!profileinfo) {
                router.push('/');
            }
			
            setProfileInfo(profileinfo);
			setLoading(false);
        };
        getProfileInfo();

    }, [userInfo, router, id]);

	const getExcellenceDetails = (value: any) => {
		const value1 = value ? value.canskateexcellence: "";
		let excellenceDetails = "";
		if ( value1 === "engaged" ) {
			excellenceDetails = `Engaged <img width="22" height="22" src='/images/icons/engaged.png' />`;
		} else if (value1 === "achieved") {
			excellenceDetails = `Achieved <img width="22" height="22" src='/images/icons/achived.png' />`;
		} else if (value1 === "exceeded") {
			excellenceDetails = `Exceeded <img width="22" height="22" src='/images/icons/exceeded.png' />`;
		}
		return excellenceDetails;
	}


  return (
    <div className='profile_ionfo common_css'>
        <div className='container homeSecOne'>
            <div className='row'>
                <div className='col-md-4 member_personal_info'>
                    <div className='person_image'>
                        <div className='profile_image'>
                            <img src={profileInfo?.profile_image} />
                        </div>
                        <p className='person_name'>{ profileInfo?.contact_name }</p>
                        <p className='person_position'>({ profileInfo?.job_title })</p>
                    </div>
                    <div className='personal_info'>
                        <div className='info_holder'>
                            <div className='info_icon'>
                                <img src='/images/icons/tel-ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Tel</p>
                                <p className='info_des_data'>{ profileInfo?.tel }</p>
                            </div>
                        </div>
                        <div className='info_holder'>
                            <div className='info_icon'>
                                <img src='/images/icons/tel-ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Cell</p>
                                <p className='info_des_data'>{ profileInfo?.cell }</p>
                            </div>
                        </div>
                        <div className='info_holder mail_ic'>
                            <div className='info_icon'>
                                <img src='/images/icons/mail-ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Email</p>
                                <p className='info_des_data'>{ profileInfo?.email }</p>
                            </div>
                        </div>
                        <div className='info_holder location_ic'>
                            <div className='info_icon'>
                                <img src='/images/map_ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Location</p>
                                <p className='info_des_data'>{ profileInfo?.address }</p>
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.6694812004744!2d-80.30885208496093!3d43.3630237791323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c77c6e46e08ab%3A0x3698f14c39faed2e!2sGalt%20Arena%20Gardens!5e0!3m2!1sen!2sbd!4v1653269154399!5m2!1sen!2sbd" width="100%" height="150" loading="lazy"></iframe>
                            </div>
                        </div>
                        <div className='info_holder website_ic'>
                            <div className='info_icon'>
                                <img src='/images/icons/earth-ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Website</p>
                                <p className='info_des_data'><a>{ profileInfo?.website }</a></p>
                            </div>
                        </div>
                        <div className='info_holder inc_ic'>
                            <div className='info_icon'>
                                <img src='/images/icons/doc-ic.png' />
                            </div>
                            <div className='info_des'>
                                <p className='info_des_title'>Incorporation Number</p>
                                <p className='info_des_data'>{ profileInfo?.incorporation_number }</p>
                            </div>
                        </div>

                    </div>
                    <div className='person_social_media'>
                        <ul className='social_info'>
                            <li><Link href={`https://${profileInfo?.facebook}`}><a><img src='/images/icons/fb-ic.png' /></a></Link></li>
                            <li><Link href={`https://${profileInfo?.instagram}`}><a><img src='/images/icons/tw-ic.png' /></a></Link></li>
                            <li><Link href={`https://${profileInfo?.youtube}`}><a><img src='/images/icons/you-ic.png' /></a></Link></li>
                            <li><Link href={`https://${profileInfo?.linkedin}`}><a><img src='/images/icons/linkdin-ic.png' /></a></Link></li>
                        </ul>
                    </div>
                </div>
                <div className='col-md-8 member_bio'>
                    <div className='bio_head'>
                        <div className='club_logo'>
                            <img src={ profileInfo?.club_logo } />
                        </div>
                        <div className='clud_info'>
                            <h2 className='club_title'>{ profileInfo?.club_name }</h2>
                            <p className='class_ncp'><b>NCCP: </b>#{ profileInfo?.nccp_number } <span><b>Club/Skating School: </b></span> #{ profileInfo?.club_number }</p>
                        </div>
                        <div className='clear_both'></div>
                        <div className='edit_profile_links'>
							<Link href='/'><a><img src='/images/icons/pen-ic.png' /></a></Link>
                        </div>
                    </div>
                    <div className='bio_description'>
                        <div className='bio_desc_field'>
                            <h3 className='bio_info_title'>About Us</h3>
                            {parse(profileInfo ? profileInfo.about_us : '')}
                        </div>
                        <div className='bio_desc_field'>
                            <h3 className='bio_info_title'>Skate Excellence {parse(getExcellenceDetails(profileInfo))}</h3>
							{parse(profileInfo ? profileInfo.excellencedetails : '')}
                        </div>
                        <div className='bio_desc_field'>
                            <h3 className='bio_info_title'>Programs We Offer</h3>
                            <ul>
								{ profileInfo?.offered_programms.map((program, key) => {              
								return <li key={key}>{program}</li> 
								})}
                            </ul>
                        </div>
                        <div className='bio_desc_field'>
                            <h3 className='bio_info_title'>Coaches</h3>
                            <ul>
								{ profileInfo?.coaches.map((coach, key) => {              
									return <li key={key}>{coach.name}</li> 
								})}
                            </ul>
                        </div>
                        <div className='bio_desc_field'>
                            <h3 className='bio_info_title'>Owners/Directord</h3>
                            <ul>
								{ profileInfo?.owners.map((owner, key) => {              
									return <li key={key}>{owner.name}</li> 
								})}
                            </ul>
                        </div>
                        <Link href="/"><a className='btn btn-secondary'>Edit My Profile <img className='arrow_btn' src='/images/arrow-blue.png' alt="Button arrow" /></a></Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
