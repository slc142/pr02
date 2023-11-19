import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Checkbox from '@mui/material/Checkbox';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Stack from '@mui/material/Stack';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import './App.css';
import TaskDialog from './TaskDialog.tsx';


function App() {
  const dayjs = require('dayjs');

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [message, setMessage] = React.useState('');

  // true if the user is adding a new task, false if the user is editing an existing task
  const [action, setAction] = React.useState(true);

  function createData(title, description, deadline, priority, isComplete) {
    return { title, description, deadline, priority, isComplete };
  }

  const [rows, setRows] = React.useState([]);

  const [taskToUpdate, setTaskToUpdate] = React.useState(-1);

  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false);

  const [task, setTask] = React.useState({
    title: '',
    description: '',
    deadline: dayjs().format('MM/DD/YYYY'),
    priority: 'Low',
    isComplete: false
  });

  const [taskInputError, setTaskInputError] = React.useState({
    title: '',
    description: ''
  });

  function checkbox(index) {
    return <Checkbox onChange={(e) => {
      const updatedTasks = [...rows];
      updatedTasks[index].isComplete = e.target.checked;
      setRows(updatedTasks);
      setTaskToUpdate(-1);
    }}></Checkbox>
  }

  const openTaskDialog = () => {
    setTaskDialogOpen(true);
  };

  const closeTaskDialog = () => {
    setTaskDialogOpen(false);
    setTaskInputError({
      title: '',
      description: ''
    })
  };

  const closeTaskDialogAndDoAction = () => {
    let isError = false;
    if (task.title === '') {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, title: 'Title must not be empty' });
    } else if (rows.some((row) => row.title === task.title)) {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, title: 'Title must be unique' });
    }
    if (task.description === '') {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, description: 'Description must not be empty' });
    }

    if (isError) {
      return;
    }
    if (action) {
      // add new task
      setRows([...rows, createData(task.title, task.description, task.deadline, task.priority, task.isComplete)]);
      setTask({
        title: '',
        description: '',
        deadline: dayjs().format('MM/DD/YYYY'),
        priority: 'Low',
        isComplete: false
      });
      setMessage('Task was added successfully.')
      setOpen(true);
    } else {
      // edit existing task
      if (taskToUpdate !== -1) {
        const updatedTasks = [...rows];
        updatedTasks[taskToUpdate] = createData(task.title, task.description, task.deadline, task.priority, task.isComplete);
        setRows(updatedTasks);
        setTaskToUpdate(-1);
        setMessage('Task was updated successfully.')
        setOpen(true);
      }
    }
    setTaskDialogOpen(false);
    setTaskInputError({
      title: '',
      description: ''
    })
  }

  function deleteTask(index) {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
    setMessage('Task was deleted successfully.')
    setOpen(true);
  }

  function deleteButton(index) {
    return <Button onClick={() => deleteTask(index)}><HighlightOffIcon ></HighlightOffIcon>&nbsp;Delete</Button>
  }

  function updateButton(index) {
    return <Button onClick={() => {
      setAction(false);
      setTaskToUpdate(index);
      openTaskDialog();
    }}><EditIcon></EditIcon>&nbsp;Edit</Button>
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ position: 'relative', bottom: 2 }}>
              <MenuIcon />
            </IconButton>
            FRAMEWORKS
          </Typography>
          <Button color="inherit" variant="outlined" onClick={() => {
            setAction(true);
            openTaskDialog();
          }}><AddCircleIcon ></AddCircleIcon>&nbsp;Add</Button>
        </Toolbar>
      </AppBar>
      {<TaskDialog taskDialogOpen={taskDialogOpen} closeTaskDialog={closeTaskDialog} closeTaskDialogAndDoAction={closeTaskDialogAndDoAction} action={action} task={task} setTask={setTask} taskInputError={taskInputError} setTaskInputError={setTaskInputError} setTaskToUpdate={setTaskToUpdate} />}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Is Complete</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.title}
                </TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.deadline}</TableCell>
                <TableCell align="center">{row.priority}</TableCell>
                <TableCell align="center">{checkbox(index)}</TableCell>
                <TableCell align="center">{<Stack>{row.isComplete ? deleteButton(index) : [updateButton(index), deleteButton(index)]}</Stack>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={5000}
      // handleClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
