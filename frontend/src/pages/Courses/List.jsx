import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Chip, DialogContentText, List, ListItem, ListItemText, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useForm } from 'react-hook-form';
import { courseService } from '../../services/courseService';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Common/Toast';
import { LoadingScreen } from '../../components/Common/LoadingScreen';

export const CourseList = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog / Modal states
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollingStudent, setEnrollingStudent] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);

  const {
    register: formRegister,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      schedule: '',
      description: '',
      facultyId: '',
    }
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAll();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load courses database', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  // Filter Search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = courses.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
    );
    setFilteredCourses(filtered);
    setPage(0);
  }, [searchTerm, courses]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open Form modal for Add / Edit
  const handleOpenForm = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setValue('name', course.name);
      setValue('code', course.code);
      setValue('schedule', course.schedule || '');
      setValue('description', course.description || '');
      setValue('facultyId', course.facultyId || '');
    } else {
      setEditingCourse(null);
      reset({
        name: '',
        code: '',
        schedule: '',
        description: '',
        facultyId: '',
      });
    }
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
    setEditingCourse(null);
  };

  // Submit Course Form
  const onSubmit = async (data) => {
    try {
      // Parse facultyId if provided
      const submissionData = {
        ...data,
        facultyId: data.facultyId ? parseInt(data.facultyId, 10) : null,
      };

      if (editingCourse) {
        await courseService.update(editingCourse.id, submissionData);
        showToast('Course details updated successfully', 'success');
      } else {
        await courseService.create(submissionData);
        showToast('New course created successfully', 'success');
      }
      handleCloseForm();
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Action failed. Course code might already exist.', 'error');
    }
  };

  // Delete Course Handlers
  const handleOpenDelete = (id) => {
    setDeletingCourseId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setDeletingCourseId(null);
  };

  const handleDeleteSubmit = async () => {
    try {
      await courseService.delete(deletingCourseId);
      showToast('Course terminated successfully', 'success');
      handleCloseDelete();
      fetchCourses();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete course records', 'error');
    }
  };

  // Enrollment Management Handlers
  const handleOpenEnrollment = async (course) => {
    setSelectedCourse(course);
    setEnrollingStudent(null);
    setOpenEnrollDialog(true);
    await refreshCourseStudents(course.id);
  };

  const handleCloseEnrollment = () => {
    setOpenEnrollDialog(false);
    setSelectedCourse(null);
    setCourseStudents([]);
    setEnrollingStudent(null);
    fetchCourses(); // Refresh counts
  };

  const refreshCourseStudents = async (courseId) => {
    try {
      const fullCourseDetail = await courseService.getById(courseId);
      // Backend DTO doesn't return full list in basic GET all, but full GET by ID might return students
      // If backend doesn't list, we fall back or show available records
      if (fullCourseDetail && fullCourseDetail.students) {
        setCourseStudents(fullCourseDetail.students);
      } else {
        setCourseStudents([]);
      }
    } catch (err) {
      console.error(err);
      setCourseStudents([]);
    }
  };

  const handleEnrollSubmit = async () => {
    if (!enrollingStudent) return;
    try {
      await courseService.enroll(selectedCourse.id, enrollingStudent.id);
      showToast(`${enrollingStudent.name} enrolled in course successfully`, 'success');
      setEnrollingStudent(null);
      await refreshCourseStudents(selectedCourse.id);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Enrollment failed. Student might already be enrolled.', 'error');
    }
  };

  const handleUnenrollSubmit = async (studentId, studentName) => {
    try {
      await courseService.unenroll(selectedCourse.id, studentId);
      showToast(`${studentName} unenrolled successfully`, 'success');
      await refreshCourseStudents(selectedCourse.id);
    } catch (err) {
      console.error(err);
      showToast('Failed to terminate enrollment', 'error');
    }
  };

  if (loading && courses.length === 0) {
    return <LoadingScreen message="Loading course directory database..." />;
  }

  const paginatedCourses = filteredCourses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Grid */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'Outfit', fontWeight: 800 }}>
            Course Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage course records, schedule constraints, descriptions, and student enrollments.
          </Typography>
        </Box>
        {hasRole(['ADMIN', 'FACULTY']) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm(null)}
            sx={{ borderRadius: 2 }}
          >
            Create Course
          </Button>
        )}
      </Box>

      {/* Controller Actions */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by course name or course code..."
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
              Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> courses
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Courses Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="courses table">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Faculty ID</TableCell>
              <TableCell>Enrollment Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No matching course records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCourses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell><Chip label={course.code} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{course.name}</TableCell>
                  <TableCell>{course.schedule || 'N/A'}</TableCell>
                  <TableCell>{course.facultyId || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip label={`${course.studentCount} Students`} size="small" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    {hasRole(['ADMIN', 'FACULTY']) && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<HowToRegIcon />}
                        onClick={() => handleOpenEnrollment(course)}
                        sx={{ mr: 1, borderRadius: 1.5 }}
                      >
                        Enrollment
                      </Button>
                    )}
                    {hasRole(['ADMIN', 'FACULTY']) && (
                      <IconButton color="primary" onClick={() => handleOpenForm(course)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {hasRole('ADMIN') && (
                      <IconButton color="error" onClick={() => handleOpenDelete(course.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Form Dialog for Create / Edit */}
      <Dialog open={openFormDialog} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Outfit', fontWeight: 700 }}>
          {editingCourse ? 'Modify Course Record' : 'Create Course Catalog'}
          <IconButton onClick={handleCloseForm} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent separators>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Course Title"
                  variant="outlined"
                  {...formRegister('name', { required: 'Course name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Course Code"
                  variant="outlined"
                  {...formRegister('code', { required: 'Course code is required' })}
                  error={!!errors.code}
                  helperText={errors.code?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Schedule"
                  placeholder="e.g. Mon/Wed 10:00 AM"
                  variant="outlined"
                  {...formRegister('schedule')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Faculty ID"
                  type="number"
                  placeholder="ID of assigned faculty"
                  variant="outlined"
                  {...formRegister('facultyId')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Course Description"
                  variant="outlined"
                  {...formRegister('description')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseForm} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
        <DialogTitle sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>Terminate Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to terminate this course? This action will completely remove the course catalog and unenroll all students assigned to it.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">
            Terminate Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrollment Management Dialog */}
      <Dialog open={openEnrollDialog} onClose={handleCloseEnrollment} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Outfit', fontWeight: 700 }}>
          Enrollment Manager: {selectedCourse?.name} ({selectedCourse?.code})
          <IconButton onClick={handleCloseEnrollment} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent separators sx={{ minHeight: 400 }}>
          <Grid container spacing={3}>
            {/* Left: Enroll student form */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonAddIcon color="primary" /> Enroll Student
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select an active student from the database to enroll them into this course.
              </Typography>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  options={students.filter(s => s.status === 'ACTIVE')}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={enrollingStudent}
                  onChange={(event, newValue) => setEnrollingStudent(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Active Student" variant="outlined" />
                  )}
                />
                <Button
                  variant="contained"
                  disabled={!enrollingStudent}
                  onClick={handleEnrollSubmit}
                  startIcon={<HowToRegIcon />}
                  sx={{ py: 1.2, borderRadius: 1.5 }}
                >
                  Enroll Student
                </Button>
              </Box>
            </Grid>

            {/* Right: Enrolled Students List */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Enrolled Roster ({courseStudents.length} Students)
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 280, overflowY: 'auto', p: 1, borderRadius: 2 }}>
                {courseStudents.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No students are currently enrolled in this course.
                    </Typography>
                  </Box>
                ) : (
                  <List dense>
                    {courseStudents.map((st) => (
                      <ListItem
                        key={st.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            color="error"
                            title="Unenroll student"
                            onClick={() => handleUnenrollSubmit(st.id, st.name)}
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={st.name}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondary={st.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEnrollment} variant="outlined">
            Close Manager
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
