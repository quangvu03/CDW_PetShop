package com.example.petshop_be.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "publickeyuser")
public class Publickeyuser {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_user")
    private Integer idUser;

    @Column(name = "public_key")
    private String publicKey;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "expire")
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
