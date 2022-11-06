import { createContext, Dispatch, useReducer } from 'react';
import { alertReducer, iAlert, iAlertActions } from './reducers/alert.reducer';

interface AlertDefinition {
    alerts: iAlert[];
    dispatch: Dispatch<iAlertActions>;
}

export const alertContext = createContext<AlertDefinition | null>(null);

export const AlertProvider = (props: any) => {
    const [alerts, dispatch] = useReducer(alertReducer, []);

    return <alertContext.Provider value={{ alerts, dispatch }}>{props.children}</alertContext.Provider>;
};
