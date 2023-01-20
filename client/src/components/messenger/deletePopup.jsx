import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeletePopup(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    props.setPopupOpen(true);
  };

  const handleClose = () => {
    props.setAnchorEl(null)
    props.setPopupOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props.popupOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{padding: "3rem 2rem 1rem 2rem"}}>
            Are you sure to delete all messages.
            <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure to delete all messages.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button variant='contained' color="primary" onClick={props.handleDeleteAllMessages}>Yes</Button>
          <Button variant='contained' color="warning" onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
