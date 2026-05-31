package com.eduflow.controller;

import com.eduflow.dto.CourseDto;
import com.eduflow.entity.Course;
import com.eduflow.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<List<CourseDto.Response>> getAllCourses() {
        List<CourseDto.Response> courses = courseService.getAllCourses()
                .stream()
                .map(CourseDto.Response::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'STAFF')")
    public ResponseEntity<CourseDto.Response> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(CourseDto.Response.from(courseService.getCourseById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<CourseDto.Response> createCourse(@Valid @RequestBody CourseDto dto) {
        Course course = courseService.createCourse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(CourseDto.Response.from(course));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<CourseDto.Response> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseDto dto) {
        return ResponseEntity.ok(CourseDto.Response.from(courseService.updateCourse(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/enroll/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> enrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        Course course = courseService.enrollStudent(courseId, studentId);
        return ResponseEntity.ok(Map.of(
                "message", "Student enrolled successfully",
                "course", CourseDto.Response.from(course)
        ));
    }

    @DeleteMapping("/{courseId}/unenroll/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<?> unenrollStudent(
            @PathVariable Long courseId,
            @PathVariable Long studentId) {
        courseService.unenrollStudent(courseId, studentId);
        return ResponseEntity.ok(Map.of("message", "Student unenrolled successfully"));
    }
}
