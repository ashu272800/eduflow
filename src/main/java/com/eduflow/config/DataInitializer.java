package com.eduflow.config;

import com.eduflow.entity.*;
import com.eduflow.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already contains users. Skipping demo data initialization.");
            return;
        }

        log.info("Initializing demo data for recruiters...");

        // 1. Create Default Users (Recruiter credentials)
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@eduflow.com")
                .role(User.Role.ADMIN)
                .build();

        User faculty = User.builder()
                .username("faculty")
                .password(passwordEncoder.encode("faculty123"))
                .email("faculty@eduflow.com")
                .role(User.Role.FACULTY)
                .build();

        User staff = User.builder()
                .username("staff")
                .password(passwordEncoder.encode("staff123"))
                .email("staff@eduflow.com")
                .role(User.Role.STAFF)
                .build();

        userRepository.saveAll(List.of(admin, faculty, staff));
        log.info("Created default recruiter users: admin, faculty, staff");

        // 2. Create Students
        Student s1 = Student.builder().name("Aarav Mehta").email("aarav.mehta@edu.com").enrollmentDate(LocalDate.now().minusMonths(6)).status(Student.Status.ACTIVE).user(admin).build();
        Student s2 = Student.builder().name("Ananya Sharma").email("ananya.s@edu.com").enrollmentDate(LocalDate.now().minusMonths(5)).status(Student.Status.ACTIVE).user(admin).build();
        Student s3 = Student.builder().name("Kabir Malhotra").email("kabir.m@edu.com").enrollmentDate(LocalDate.now().minusMonths(12)).status(Student.Status.GRADUATED).user(admin).build();
        Student s4 = Student.builder().name("Diya Iyer").email("diya.iyer@edu.com").enrollmentDate(LocalDate.now().minusMonths(3)).status(Student.Status.ACTIVE).user(admin).build();
        Student s5 = Student.builder().name("Rohan Das").email("rohan.das@edu.com").enrollmentDate(LocalDate.now().minusMonths(1)).status(Student.Status.ACTIVE).user(admin).build();
        Student s6 = Student.builder().name("Ishaan Goel").email("ishaan.g@edu.com").enrollmentDate(LocalDate.now().minusMonths(14)).status(Student.Status.GRADUATED).user(admin).build();
        Student s7 = Student.builder().name("Meera Sen").email("meera.sen@edu.com").enrollmentDate(LocalDate.now().minusMonths(4)).status(Student.Status.INACTIVE).user(admin).build();
        Student s8 = Student.builder().name("Aditya Verma").email("aditya.v@edu.com").enrollmentDate(LocalDate.now().minusMonths(2)).status(Student.Status.ACTIVE).user(admin).build();
        Student s9 = Student.builder().name("Riya Kapoor").email("riya.k@edu.com").enrollmentDate(LocalDate.now().minusMonths(8)).status(Student.Status.INACTIVE).user(admin).build();
        Student s10 = Student.builder().name("Dev Patel").email("dev.patel@edu.com").enrollmentDate(LocalDate.now().minusMonths(10)).status(Student.Status.ACTIVE).user(admin).build();

        studentRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10));
        log.info("Created 10 demo students");

        // 3. Create Courses
        Course c1 = Course.builder()
                .name("Advanced Software Engineering")
                .code("CS-302")
                .schedule("Mon/Wed 10:00 AM - 11:30 AM")
                .description("In-depth study of software design patterns, agile workflows, and full-stack system architecture principles.")
                .facultyId(faculty.getId())
                .students(Set.of(s1, s2, s4, s10))
                .build();

        Course c2 = Course.builder()
                .name("Database Management Systems")
                .code("CS-204")
                .schedule("Tue/Thu 2:00 PM - 3:30 PM")
                .description("Covers relational databases, query optimization, indexing strategies, and PostgreSQL administration.")
                .facultyId(faculty.getId())
                .students(Set.of(s1, s2, s5, s8, s10))
                .build();

        Course c3 = Course.builder()
                .name("Machine Learning & Neural Networks")
                .code("CS-410")
                .schedule("Wed/Fri 4:00 PM - 5:30 PM")
                .description("Introduction to statistical machine learning models, gradient descent optimization, and artificial neural networks.")
                .facultyId(faculty.getId())
                .students(Set.of(s2, s4, s8))
                .build();

        Course c4 = Course.builder()
                .name("Introduction to Java & Spring Boot")
                .code("CS-102")
                .schedule("Mon/Fri 12:00 PM - 1:30 PM")
                .description("Covers object-oriented programming in Java, dependency injection, and building RESTful web services with Spring Boot.")
                .facultyId(faculty.getId())
                .students(Set.of(s4, s5, s7, s8, s10))
                .build();

        courseRepository.saveAll(List.of(c1, c2, c3, c4));
        log.info("Created 4 demo courses with student enrollments");

        // 4. Create Notification Logs
        Notification n1 = Notification.builder().recipientId(s1.getId()).type(Notification.Type.EMAIL).message("Enrollment in CS-302 (Advanced Software Engineering) confirmed!").status(Notification.Status.SENT).sentAt(LocalDateTime.now().minusHours(2)).build();
        Notification n2 = Notification.builder().recipientId(s2.getId()).type(Notification.Type.EMAIL).message("Enrollment in CS-302 (Advanced Software Engineering) confirmed!").status(Notification.Status.SENT).sentAt(LocalDateTime.now().minusHours(3)).build();
        Notification n3 = Notification.builder().recipientId(s5.getId()).type(Notification.Type.SMS).message("Welcome Rohan! Your profile has been successfully added to the EduFlow database.").status(Notification.Status.SENT).sentAt(LocalDateTime.now().minusHours(5)).build();
        Notification n4 = Notification.builder().recipientId(s7.getId()).type(Notification.Type.EMAIL).message("Warning: Your profile status has been marked as INACTIVE. Please contact administration.").status(Notification.Status.FAILED).sentAt(LocalDateTime.now().minusHours(10)).build();
        Notification n5 = Notification.builder().recipientId(s8.getId()).type(Notification.Type.IN_APP).message("New course CS-410 (Machine Learning) has been added to your schedule.").status(Notification.Status.SENT).sentAt(LocalDateTime.now().minusHours(12)).build();

        notificationRepository.saveAll(List.of(n1, n2, n3, n4, n5));
        log.info("Created 5 demo notification logs");

        log.info("Recruiter demo data initialization complete!");
    }
}
