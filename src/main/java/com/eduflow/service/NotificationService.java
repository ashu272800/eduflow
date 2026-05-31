package com.eduflow.service;

import com.eduflow.entity.Course;
import com.eduflow.entity.Notification;
import com.eduflow.entity.Student;
import com.eduflow.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Async
    public void sendEnrollmentNotification(Student student, Course course) {
        String message = String.format(
                "Dear %s, you have been successfully enrolled in course: %s (%s).",
                student.getName(), course.getName(), course.getCode()
        );
        sendAsync(student.getId(), message, Notification.Type.EMAIL);
    }

    @Async
    public void sendAsync(Long recipientId, String message, Notification.Type type) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .message(message)
                .type(type)
                .status(Notification.Status.PENDING)
                .build();

        try {
            notification = notificationRepository.save(notification);

            // Simulate sending (replace with actual email/SMS integration)
            log.info("Sending {} notification to recipient {}: {}", type, recipientId, message);

            // TODO: Integrate with JavaMail / Twilio SMS here
            // For email: mailSender.send(...)
            // For SMS: twilioService.send(...)

            notification.setStatus(Notification.Status.SENT);
            notification.setSentAt(LocalDateTime.now());

        } catch (Exception e) {
            log.error("Failed to send notification to {}: {}", recipientId, e.getMessage());
            notification.setStatus(Notification.Status.FAILED);
        } finally {
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findByRecipientId(recipientId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
