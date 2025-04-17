package com.example.Services.impl;

import com.example.Services.MailService;
import com.example.Services.Userservice;
import com.example.configurations.Usermapper;
import com.example.dtos.UsersDTO;
import com.example.entities.Users;
import com.example.helpers.RandomHepler;
import com.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class UserserviceImpl implements Userservice {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Usermapper usermapper;

    @Autowired
    Environment environment;

    @Autowired
    MailService mailService;

    @Override
    public boolean save(UsersDTO usersDTO) {
        try {
            Users users = usermapper.convertToUsersEntity(usersDTO);
            users.setStatus((byte) 0);
            String securytyCode = RandomHepler.random();
            users.setSecurityCode(securytyCode);
            Users savedUser = userRepository.save(users);

            if (savedUser != null) {
                /*Gui emal kich hoat tai khoan*/

                String content = "Nhan vao <a href='" + environment.getProperty("BASE_URL") + "api/account/verify?email=" + users.getEmail() + "&securitycode=" + securytyCode + "'>day<a/>";
                String from = environment.getProperty("spring.mail.username");
                mailService.send(from, savedUser.getEmail(), "Verify", content);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
		}
        return false;
    }

    @Override
    public UsersDTO findByEmail(String email) {
        try {
            Users user = userRepository.findByEmail(email);
            if (user != null) {
                return usermapper.convertToUsersDTO(user);
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
