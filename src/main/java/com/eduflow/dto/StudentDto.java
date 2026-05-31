package com.eduflow.dto;

import com.eduflow.entity.Student;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentDto {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Valid email required")
    @NotBlank(message = "Email is required")
    private String email;

    private LocalDate enrollmentDate;
    private Student.Status status;

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String email;
        private LocalDate enrollmentDate;
        private Student.Status status;

        public static Response from(Student s) {
            Response r = new Response();
            r.setId(s.getId());
            r.setName(s.getName());
            r.setEmail(s.getEmail());
            r.setEnrollmentDate(s.getEnrollmentDate());
            r.setStatus(s.getStatus());
            return r;
        }
    }
}
