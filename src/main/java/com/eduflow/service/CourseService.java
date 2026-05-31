package com.eduflow.service;

import com.eduflow.dto.CourseDto;
import com.eduflow.entity.Course;
import com.eduflow.entity.Student;
import com.eduflow.exception.ResourceAlreadyExistsException;
import com.eduflow.exception.ResourceNotFoundException;
import com.eduflow.repository.CourseRepository;
import com.eduflow.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    @Transactional
    public Course createCourse(CourseDto dto) {
        if (courseRepository.existsByCode(dto.getCode())) {
            throw new ResourceAlreadyExistsException("Course already exists with code: " + dto.getCode());
        }

        Course course = Course.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .schedule(dto.getSchedule())
                .facultyId(dto.getFacultyId())
                .description(dto.getDescription())
                .build();

        Course saved = courseRepository.save(course);
        log.info("Course created: {} ({})", saved.getName(), saved.getCode());
        return saved;
    }

    @Transactional
    public Course updateCourse(Long id, CourseDto dto) {
        Course course = getCourseById(id);

        if (!course.getCode().equals(dto.getCode()) && courseRepository.existsByCode(dto.getCode())) {
            throw new ResourceAlreadyExistsException("Course code already in use: " + dto.getCode());
        }

        course.setName(dto.getName());
        course.setCode(dto.getCode());
        course.setSchedule(dto.getSchedule());
        course.setFacultyId(dto.getFacultyId());
        course.setDescription(dto.getDescription());

        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
        log.info("Course deleted: {}", id);
    }

    @Transactional
    public Course enrollStudent(Long courseId, Long studentId) {
        Course course = getCourseById(courseId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        if (course.getStudents().contains(student)) {
            throw new ResourceAlreadyExistsException(
                    "Student " + studentId + " already enrolled in course " + courseId);
        }

        course.getStudents().add(student);
        Course saved = courseRepository.save(course);

        // Async notification
        notificationService.sendEnrollmentNotification(student, course);

        log.info("Student {} enrolled in course {}", studentId, courseId);
        return saved;
    }

    @Transactional
    public Course unenrollStudent(Long courseId, Long studentId) {
        Course course = getCourseById(courseId);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        course.getStudents().remove(student);
        return courseRepository.save(course);
    }
}
