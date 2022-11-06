import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Alert } from '@mui/material';
import { useContext } from 'react';
import { alertContext } from '../../contexts/alert.context';

const Alerts = () => {
    const alertState = useContext(alertContext);
    return (
        <AlertHolder>
            {alertState?.alerts.map((alert) => (
                <AlertWrapper key={alert.id}>
                    <Alert
                        severity={alert.alert_type}
                        onClose={() => {
                            alertState.dispatch({ type: 'REMOVE_ALERT', payload: alert.id });
                        }}
                    >
                        {alert.alert_msg}
                    </Alert>
                </AlertWrapper>
            ))}
        </AlertHolder>
    );
};

export default Alerts;

const slideFromRight = keyframes`
    0% {
        transform: translateX(250px);
    }
    50% {
        transform: translateX(0%);
    }
`;

const AlertWrapper = styled.div`
    animation: ${slideFromRight} 0.4s ease-in-out;
    margin-bottom: 0.5rem;
`;

const AlertHolder = styled.div`
    position: fixed;
    top: 7vh;
    right: 10px;
    min-height: 40vh;
    min-width: 30vw;
    //background: lightcoral;
    padding: 10px;

    display: flex;
    flex-direction: column;
`;
