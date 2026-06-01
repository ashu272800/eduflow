import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Chip, DialogContentText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Common/Toast';
import { LoadingScreen } from '../../components/Common/LoadingScreen';

export const StudentList = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog / Modal states
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  const {
    register: formRegister,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    }
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch students list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.status.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
    setPage(0);
  }, [searchTerm, students]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open Form modal for Add / Edit
  const handleOpenForm = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setValue('name', student.name);
      setValue('email', student.email);
      setValue('enrollmentDate', student.enrollmentDate);
      setValue('status', student.status);
    } else {
      setEditingStudent(null);
      reset({
        name: '',
        email: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
    }
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
    setEditingStudent(null);
  };

  // Form Submission
  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, data);
        showToast('Student details updated successfully', 'success');
      } else {
        await studentService.create(data);
        showToast('New student registered successfully', 'success');
      }
      handleCloseForm();
      fetchStudents();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Action failed. Email might already be registered.', 'error');
    }
  };

  // Delete Handlers
  const handleOpenDelete = (id) => {
    setDeletingStudentId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setDeletingStudentId(null);
  };

  const handleDeleteSubmit = async () => {
    try {
      await studentService.delete(deletingStudentId);
      showToast('Student deleted successfully', 'success');
      handleCloseDelete();
      fetchStudents();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete student records', 'error');
    }
  };

  if (loading && students.length === 0) {
    return <LoadingScreen message="Loading student records directory..." />;
  }

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
            Student Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage student enrollments, details, status tracks, and records.
          </Typography>
        </Box>
        {hasRole(['ADMIN', 'FACULTY']) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm(null)}
            sx={{ borderRadius: 2 }}
          >
            Register Student
          </Button>
        )}
      </Box>

      {/* Control Actions (Search & Stats) */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'flex-start' } }}>
            <Typography variant="body2" color="text.secondary">
              Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> registered students
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Data Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="students table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Status</TableCell>
              {hasRole(['ADMIN', 'FACULTY']) && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={hasRole(['ADMIN', 'FACULTY']) ? 6 : 5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No matching student records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      size="small"
                      color={
                        student.status === 'ACTIVE'
                          ? 'success'
                          : student.status === 'GRADUATED'
                          ? 'primary'
                          : 'default'
                      }
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  {hasRole(['ADMIN', 'FACULTY']) && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenForm(student)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {hasRole('ADMIN') && (
                        <IconButton color="error" onClick={() => handleOpenDelete(student.id)} size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Form Dialog for Register / Edit */}
      <Dialog open={openFormDialog} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Outfit', fontWeight: 700 }}>
          {editingStudent ? 'Edit Student Details' : 'Register New Student'}
          <IconButton onClick={handleCloseForm} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent separators>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Full Name"
                  variant="outlined"
                  {...formRegister('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  {...formRegister('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Enrollment Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  {...formRegister('enrollmentDate', { required: 'Enrollment date is required' })}
                  error={!!errors.enrollmentDate}
                  helperText={errors.enrollmentDate?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  variant="outlined"
                  {...formRegister('status', { required: 'Status is required' })}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="GRADUATED">GRADUATED</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseForm} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingStudent ? 'Save Changes' : 'Register Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student's record? This action is permanent and cannot be undone. All active course enrollments for this student will also be terminated.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
