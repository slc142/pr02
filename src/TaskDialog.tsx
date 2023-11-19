import * as React from 'react';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CancelIcon from '@mui/icons-material/Cancel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import EditIcon from '@mui/icons-material/Edit';
import FormHelperText from '@mui/material/FormHelperText';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './App.css';

export default function TaskDialog({
    taskDialogOpen,
    closeTaskDialog,
    closeTaskDialogAndDoAction,
    action,
    task,
    setTask,
    taskInputError,
    setTaskInputError,
    taskToUpdate
}) {
    const dayjs = require('dayjs');
    return <Dialog open={taskDialogOpen} onClose={closeTaskDialog}>
        <DialogTitle>{action ? 'Add Task' : 'Edit Task'}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="text"
                defaultValue={taskToUpdate !== -1 ? task.title : ''}
                fullWidth
                variant="standard"
                onChange={(e) => {
                    setTask({ ...task, title: e.target.value });
                }}
                // hidden={!action}
                disabled={!action}
                required
                error={taskInputError.title !== ''}
            />
            <FormHelperText>{taskInputError.title}</FormHelperText>
            <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => {
                    setTask({ ...task, description: e.target.value });
                }}
                required
                error={taskInputError.description !== ''}
            />
            <FormHelperText>{taskInputError.description}</FormHelperText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker label="Basic date picker" defaultValue={dayjs()} onChange={(e) => setTask({ ...task, deadline: e.format('MM/DD/YYYY') })} />
                </DemoContainer>
            </LocalizationProvider>
            <FormControl>
                <FormLabel id="radio-buttons-group-label">Priority</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e) => setTask({ ...task, priority: e.target.value })}
                    defaultValue="Low"
                >
                    <FormControlLabel value="Low" control={<Radio />} label="Low" />
                    <FormControlLabel value="Med" control={<Radio />} label="Med" />
                    <FormControlLabel value="High" control={<Radio />} label="High" />
                </RadioGroup>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeTaskDialogAndDoAction}>{action ? <AddCircleIcon ></AddCircleIcon> : <EditIcon></EditIcon>}&nbsp;{action ? 'Add' : 'Update'}</Button>
            <Button onClick={closeTaskDialog}><CancelIcon ></CancelIcon>&nbsp;Cancel</Button>
        </DialogActions>
    </Dialog>
}