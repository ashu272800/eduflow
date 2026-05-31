package com.eduflow.dto;

import com.eduflow.entity.Course;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseDto {

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Course code is required")
    private String code;

    private String schedule;
    private Long facultyId;
    private String description;

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String code;
        private String schedule;
        private Long facultyId;
        private String description;
        private int studentCount;

        public static Response from(Course c) {
            Response r = new Response();
            r.setId(c.getId());
            r.setName(c.getName());
            r.setCode(c.getCode());
            r.setSchedule(c.getSchedule());
            r.setFacultyId(c.getFacultyId());
            r.setDescription(c.getDescription());
            r.setStudentCount(c.getStudents() != null ? c.getStudents().size() : 0);
            return r;
        }
    }
}
