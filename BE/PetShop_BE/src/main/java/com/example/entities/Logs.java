package com.example.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "logs")
public class Logs {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ip")
    private String ip;

    @Column(name = "level")
    private String level;

    @Column(name = "national")
    private String national;

    @Column(name = "time")
    private LocalDateTime time;

    @Column(name = "beforeValue")
    private String beforeValue;

    @Column(name = "afterValue")
    private String afterValue;

    @Column(name = "userId")
    private Integer userId;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIp() {
        return this.ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getLevel() {
        return this.level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getNational() {
        return this.national;
    }

    public void setNational(String national) {
        this.national = national;
    }

    public LocalDateTime getTime() {
        return this.time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public String getBeforeValue() {
        return this.beforeValue;
    }

    public void setBeforeValue(String beforeValue) {
        this.beforeValue = beforeValue;
    }

    public String getAfterValue() {
        return this.afterValue;
    }

    public void setAfterValue(String afterValue) {
        this.afterValue = afterValue;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
