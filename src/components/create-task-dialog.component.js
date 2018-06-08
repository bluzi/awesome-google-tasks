import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import dateformat from 'dateformat';

class CreateTaskDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            task: props.task || {},
        };
    }

    handleClose() {
        this.props.onCancel();
    }

    handleSubmit() {
        this.props.onSubmit(this.state.task);
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
        return (
            <Dialog open={true} onClose={this.handleClose.bind(this)}>
                <DialogTitle id="form-dialog-title">
                    {this.props.isEditMode ? `Edit Task ${this.state.task.title}` : 'Create Task'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Title"
                        type="text"
                        fullWidth
                        value={this.state.task.title}
                        onChange={event => this.setState({ task: { ...this.state.task, title: event.target.value } })}
                        onKeyUp={this.handleKeyUp.bind(this)} />

                    <TextField
                        fullWidth
                        label="Due date"
                        type="date"
                        defaultValue={Date.parse(this.state.task.due) ? dateformat(new Date(this.state.task.due), 'yyyy-mm-dd').toString() : undefined}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={event => this.setState({ task: { ...this.state.task, due: event.target.value && new Date(event.target.value).toISOString() } })}
                        onKeyUp={this.handleKeyUp.bind(this)} />

                    <TextField
                        fullWidth
                        type="text"
                        label="Details"
                        multiline
                        rows="5"
                        defaultValue={this.state.task.notes}
                        onChange={event => this.setState({ task: { ...this.state.task, notes: event.target.value } })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Cancel
                        </Button>
                    <Button onClick={this.handleSubmit.bind(this)} color="primary">
                        {this.props.isEditMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default CreateTaskDialog;