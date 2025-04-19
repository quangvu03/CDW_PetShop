package com.example.petshop_be.dtos;

import java.time.LocalDateTime;

public class PublickeyuserDTO {
    private Integer id;
    private Integer idUser;
    private String publicKey;
    private LocalDateTime createAt;
    private LocalDateTime expire;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdUser() {
        return this.idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public String getPublicKey() {
        return this.publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public LocalDateTime getCreateAt() {
        return this.createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public LocalDateTime getExpire() {
        return this.expire;
    }

    public void setExpire(LocalDateTime expire) {
        this.expire = expire;
    }
}
