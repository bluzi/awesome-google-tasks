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
                {this.props.task.parent &&
                    <div className="child-space"/>
                }
                <Tooltip title={dateformat(new Date(this.props.task.updated), 'mm/dd/yyyy')}>
                    <Checkbox readOnly={this.props.isReadOnly} checked={this.props.task.status === 'completed'} onChange={this.props.onCheck} />
                </Tooltip>

                <div className="task-container">

                <input
                    type="text"
                    ref={(titleInput) => this.titleInput = titleInput}
                    placeholder="What do you want to do?"
                    readOnly={this.props.isReadOnly}
                    value={this.props.task.title}
                    className="task-title"
                    onChange={event => this.props.onTaskUpdate(event.target.value)}
                    onKeyUp={this.handleKeyUp.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)} />
                
                <p className="task-description">{this.props.task.notes}</p>

                </div>

                {this.props.task.notes &&
                    <div className="chip-container">
                        <Tooltip title={this.props.task.notes}>
                            <Chip label="Details" />
                        </Tooltip>
                    </div>
                }

                {this.props.task.due &&
                    <div className="chip-container">
                        <Chip label={dateformat(new Date(this.props.task.due), 'mm/dd/yyyy', true)} />
                    </div>
                }

                <Tooltip title="Edit Task (Ctrl + Q)">
                    <div>
                        <IconButton disabled={this.props.isReadOnly} onClick={this.props.onEdit}>
                            <Icon>edit</Icon>
                        </IconButton>
                    </div>
                </Tooltip>

                <Tooltip title="Delete Task (Ctrl + D)">
                    <div>
                        <IconButton disabled={this.props.isReadOnly} onClick={this.props.onDelete}>
                            <Icon>delete</Icon>
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
        );
    }

    handleKeyUp(event) {
        const enterKey = 13;

        if (event.keyCode === enterKey) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleKeyDown(event) {
        const backspaceKey = 8;

        if (event.keyCode === backspaceKey && this.props.task.title.length === 0) {
            this.props.onDelete();
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

export default Task;