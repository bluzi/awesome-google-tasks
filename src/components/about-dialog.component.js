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
                        <br />
                        Use CTRL + left/right arrows to navigate between the tasks and the lists panel
                        <br />
                        Use up/down arrows to navigate between tasks/lists
                        <br />
                        Press Enter when selecting a list to navigate into it
                        <br />
                        Press Enter when selecting a task to create a new task
                        <br />
                        Use CTRL + Enter when selecting a task to mark it as completed
                        <br />
                        Use CTRL + N to create new tasks or lists
                        <br />
                        Use CTRL + Q to edit a task or a list
                        <br />
                        Use CTRL + D to delete a task or a list
                        <br />
                        Use CTRL + A to navigate to All Tasks view
                        <br />
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