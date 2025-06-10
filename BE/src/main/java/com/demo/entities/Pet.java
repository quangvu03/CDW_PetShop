package com.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.List;

@ToString
@Getter
@Setter
@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "species", length = 50)
    private String species;

    @Column(name = "breed", length = 100)
    private String breed;

    @Column(name = "price")
    private double price;

    @Column(name = "quantity")
    private int quantity;
    @Lob
    @Column(name = "gender")
    private String gender;

    @Column(name = "age")
    private Integer age;

    @Column(name = "color", length = 50)
    private String color;

    @Lob
    @Column(name = "size")
    private String size;

    @Column(name = "origin", length = 100)
    private String origin;

    @Lob
    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "status")
    private String status;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @OneToMany(
            mappedBy = "pet",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private List<PetImage> images;
}