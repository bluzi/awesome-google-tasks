import { Chip, Tooltip } from '@material-ui/core';
import React, { Component } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import dateformat from 'dateformat';

class Task extends Component {
    // this.props.index === 0

    componentDidUpdate() {
        if (this.props.isSelected) {
            this.titleInput.focus();
        } else {
            this.titleInput.blur();
        }
    }

    render() {
        return (
            <div className={classNames({
                task: true,
                completed: this.props.task.status === 'completed',
                selected: this.props.isSelected,
            })} onMouseOver={this.props.onMouseOver}>
                <Tooltip title={
                    <div>
                        Last changed at {this.beautifyDate(this.props.task.updated)}
                        {this.props.task.notes && <div><br /><strong>Notes:</strong><br />{this.props.task.notes}</div>}
                    </div>
                }>
                    <Checkbox readOnly={this.props.isReadOnly} checked={this.props.task.status === 'completed'} onChange={this.props.onCheck} />
                </Tooltip>

                <input
                    type="text"
                    ref={(titleInput) => this.titleInput = titleInput}
                    placeholder="What do you want to do?"
                    readOnly={this.props.isReadOnly}
                    value={this.props.task.title}
                    className="task-title"
                    onChange={event => this.props.onTaskUpdate(event.target.value)}
                    onKeyUp={this.handleKeyUp.bind(this)} />

                {this.props.task.due &&
                    <div className="chip-container">
                        <Chip label={dateformat(new Date(this.props.task.due), 'dd/mm/yyyy')} />
                    </div>
                }

                <Tooltip title="Edit Task">
                    <IconButton disabled={this.props.isReadOnly} onClick={this.props.onEdit}>
                        <Icon>edit</Icon>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete Task">
                    <IconButton disabled={this.props.isReadOnly} onClick={this.props.onDelete}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Tooltip>
            </div>
        );
    }

    beautifyDate(dateString) {
        const dateTime = new Date(dateString);
        return `${dateTime.getDate()}/${dateTime.getMonth()}/${dateTime.getFullYear()}`;
    }

    handleKeyUp(event) {
        const enterKey = 13;
        const backspaceKey = 8;

        if (event.keyCode === enterKey) {
            event.preventDefault();
            event.stopPropagation();
        } else if (event.keyCode === backspaceKey && this.props.task.title.length === 0) {
            this.props.onDelete();
        }
    }
}

export default Task;