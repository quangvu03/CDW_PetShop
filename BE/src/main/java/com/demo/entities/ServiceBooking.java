package com.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "service_bookings", indexes = {
        @Index(name = "user_id", columnList = "user_id"),
        @Index(name = "service_id", columnList = "service_id"),
        @Index(name = "pet_id", columnList = "pet_id")
})
public class ServiceBooking {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private PetService service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ColumnDefault("current_timestamp()")
    @Column(name = "scheduled_date", nullable = false)
    private Instant scheduledDate;

    @Lob
    @Column(name = "status")
    private String status;

}