import mixpanel from "mixpanel-browser";
import { useEffect } from 'react';

export const AnalyticsTrackingEvent = (trackEvent: string, userName: string, userEmail: string, Name: string) => {

        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_ID || '', {
            debug: true,
            ignore_dnt: true
        });
        mixpanel.identify(userName);
        mixpanel.people.set({ "Username": Name, "Email": userEmail});
        mixpanel.track(trackEvent , {"distinct_id": userName});
        
    
};
