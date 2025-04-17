package com.example.dtos;

import java.time.LocalDateTime;

public class LogsDTO {
    private Integer id;
    private String ip;
    private String level;
    private String national;
    private LocalDateTime time;
    private String beforeValue;
    private String afterValue;
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
