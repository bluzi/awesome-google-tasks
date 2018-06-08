import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TextField from '@material-ui/core/TextField';

class CreateTaskListDiaog extends React.Component {
    state = {
        title: undefined,
    }

    handleClose() {
        this.props.onCancel();
        this.setState({ title: undefined });
    }

    handleSubmit() {
        this.props.onSubmit(this.state.title);
        this.setState({ title: undefined });
    }

    handleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            
            this.handleSubmit();
        }
    }

    render() {
        let value = this.state.title;
        if (this.props.isEditMode && this.state.title === undefined) {
            value = this.props.title;
        }

        return (
            <Dialog open={true} onClose={this.handleClose.bind(this)}>
                <DialogTitle id="form-dialog-title">
                { this.props.isEditMode ? `Edit ${this.props.title}` : 'Create Task List' }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a title for the task list you wish to create
                    </DialogContentText>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={value}
                        onChange={this.handleChange.bind(this)}
                        onKeyUp={this.handleKeyUp.bind(this)} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Cancel
                        </Button>
                    <Button onClick={this.handleSubmit.bind(this)} color="primary">
                        { this.props.isEditMode ? 'Update' : 'Create' }
                        </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default CreateTaskListDiaog;