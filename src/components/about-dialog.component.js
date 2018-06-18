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
                        <em>Awesome Google Tasks</em> is an alternative web client for <em>Google Tasks</em>.
                        <br />
                        This project is open-source, and you can <a href="https://github.com/bluzi/awesome-google-tasks" target="_blank" rel="noopener noreferrer">view the source code on GitHub</a>.
                        <br />
                        <br />
                        If you have any questions, feel free to reach out on <a href="https://github.com/bluzi" target="_blank" rel="noopener noreferrer">GitHub</a>, <a href="https://twitter.com/eliranpeer" target="_blank" rel="noopener noreferrer">Twitter</a> or <a href="mailto:info@awesomegoogletasks.com" target="_blank" rel="noopener noreferrer">via email</a>.
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