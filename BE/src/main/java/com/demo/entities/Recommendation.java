package com.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "recommendations", indexes = {
        @Index(name = "user_id", columnList = "user_id")
})
public class Recommendation {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    @Column(name = "recommended_product_ids")
    private String recommendedProductIds;

    @ColumnDefault("current_timestamp()")
    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt;

}