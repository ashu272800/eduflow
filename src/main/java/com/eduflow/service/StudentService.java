package com.eduflow.service;

import com.eduflow.dto.StudentDto;
import com.eduflow.entity.Student;
import com.eduflow.exception.ResourceAlreadyExistsException;
import com.eduflow.exception.ResourceNotFoundException;
import com.eduflow.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Transactional
    public Student createStudent(StudentDto dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Student already exists with email: " + dto.getEmail());
        }

        Student student = Student.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .enrollmentDate(dto.getEnrollmentDate() != null ? dto.getEnrollmentDate() : LocalDate.now())
                .status(dto.getStatus() != null ? dto.getStatus() : Student.Status.ACTIVE)
                .build();

        Student saved = studentRepository.save(student);
        log.info("Student created: {} ({})", saved.getName(), saved.getId());
        return saved;
    }

    @Transactional
    public Student updateStudent(Long id, StudentDto dto) {
        Student student = getStudentById(id);

        if (!student.getEmail().equals(dto.getEmail()) && studentRepository.existsByEmail(dto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already in use: " + dto.getEmail());
        }

        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        if (dto.getEnrollmentDate() != null) student.setEnrollmentDate(dto.getEnrollmentDate());
        if (dto.getStatus() != null) student.setStatus(dto.getStatus());

        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
        log.info("Student deleted: {}", id);
    }
}
