package com.eduflow.controller;

import com.eduflow.dto.StudentDto;
import com.eduflow.entity.Student;
import com.eduflow.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<List<StudentDto.Response>> getAllStudents() {
        List<StudentDto.Response> students = studentService.getAllStudents()
                .stream()
                .map(StudentDto.Response::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<StudentDto.Response> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(StudentDto.Response.from(studentService.getStudentById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<StudentDto.Response> createStudent(@Valid @RequestBody StudentDto dto) {
        Student student = studentService.createStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(StudentDto.Response.from(student));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<StudentDto.Response> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDto dto) {
        return ResponseEntity.ok(StudentDto.Response.from(studentService.updateStudent(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
