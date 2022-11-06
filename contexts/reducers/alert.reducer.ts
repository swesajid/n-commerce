export type ALERT_TYPE = 'success' | 'error' | 'warning' | 'info';
export type ALERT_ACTION_TYPE = 'ADD_ALERT' | 'REMOVE_ALERT';

export interface iAlert {
    id: number | string;
    alert_msg: string;
    alert_type: ALERT_TYPE;
}

export interface iAlertActions {
    type: ALERT_ACTION_TYPE;
    payload: iAlert | number | string;
}

export const alertReducer = (state: iAlert[], action: iAlertActions) => {
    const { type, payload } = action;
    switch (type) {
        case 'ADD_ALERT': {
            const { id, alert_msg, alert_type } = <iAlert>payload;

            return [...state, { id, alert_msg, alert_type }];
        }
        case 'REMOVE_ALERT': {
            return state.filter((alert) => alert.id !== payload);
        }
        default:
            return state;
    }
};
