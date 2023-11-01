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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './App.css';


function App() {
  const dayjs = require('dayjs');

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
    title: false,
    description: false
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
      title: false,
      description: false
    })
  };

  const closeTaskDialogAndDoAction = () => {
    let isError = false;
    if (task.title === '') {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, title: true });
    } else if (rows.some((row) => row.title === task.title)) {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, title: true });
    }
    if (task.description === '') {
      // TODO: display message showing the error to the user
      isError = true;
      setTaskInputError({ ...taskInputError, description: true });
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
    } else {
      // edit existing task
      if (taskToUpdate !== -1) {
        const updatedTasks = [...rows];
        updatedTasks[taskToUpdate] = createData(task.title, task.description, task.deadline, task.priority, task.isComplete);
        setRows(updatedTasks);
        setTaskToUpdate(-1);
      }
    }
    setTaskDialogOpen(false);
  }

  function deleteTask(index) {
    // setRows(rows.filter(row => row.id !== id));
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
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

  function taskDialog() {
    return <Dialog open={taskDialogOpen} onClose={closeTaskDialog}>
      <DialogTitle>{action ? 'Add Task' : 'Edit Task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => {
            setTask({ ...task, title: e.target.value });
            setTaskInputError({ ...taskInputError, title: e.target.value.length === 0 });
          }}
          required
          error={taskInputError.title}
        />
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
            setTaskInputError({ ...taskInputError, description: e.target.value.length === 0 });
          }}
          required
          error={taskInputError.description}
        />
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
      {taskDialog()}
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
    </div>
  );
}

export default App;
