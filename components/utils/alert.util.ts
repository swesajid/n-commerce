import { ALERT_TYPE, iAlert } from '../../contexts/reducers/alert.reducer';

export const timedAlert = (alertState: any, alert_msg: string, alert_type: ALERT_TYPE, deley = 3000) => {
    const id = Date.now().toString();
    const payload: iAlert = { id, alert_msg, alert_type };
    alertState?.dispatch({ type: 'ADD_ALERT', payload });

    setTimeout(() => {
        alertState?.dispatch({ type: 'REMOVE_ALERT', payload: id });
    }, deley);
};
