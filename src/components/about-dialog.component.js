import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogContentText } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

class AboutDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: props.task || {},
        };
    }

    handleClose() {
        this.props.onClose();
    }
    render() {
        return (
            <Dialog open={true} onClose={this.handleClose.bind(this)}>
                <DialogTitle>
                    About Awesome Google Tasks
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Awesome Google Tasks was created by <a href="https://github.com/bluzi" target="_blank" rel="noopener noreferrer">@bluzi</a> after visitng to original Google Tasks website.
                        <br />
                        This app is a client for Google Tasks, there is no server, and we do not store any of the data, so we don't steal your data, track you or whatever; If you trust Google with your data, you should trust this app.
                        <br />
                        Feel free to <a href="https://github.com/bluzi/awesome-google-tasks" target="_blank" rel="noopener noreferrer">browse the source code n GitHub</a>.
                        <br />
                        <br />
                        For the record, I do not hold any of the rights for Google Tasks, which is a Google product, we just use a public API to send and receive tasks from this client app.
                        <br />
                        Enjoy!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default AboutDialog;