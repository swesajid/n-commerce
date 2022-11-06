import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FC } from 'react';

interface iProps {
    title: string;
    description?: string;
    open: boolean;
    onClose: () => void;
    onAgree?: () => void;
    onDisagree?: () => void;
}

const AgreementModal: FC<iProps> = ({ title, description, open, onClose, onAgree, onDisagree }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            {description && (
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={onDisagree ? onDisagree : onClose}>Disagree</Button>
                <Button onClick={onAgree ? onAgree : onClose} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AgreementModal;
