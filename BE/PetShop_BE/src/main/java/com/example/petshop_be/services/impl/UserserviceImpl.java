package com.example.petshop_be.services.impl;

import com.example.petshop_be.dtos.ChangepassRequetsDTO;
import com.example.petshop_be.services.Userservice;
import com.example.petshop_be.services.MailService;
import com.example.petshop_be.configurations.Usermapper;
import com.example.petshop_be.dtos.UsersDTO;
import com.example.petshop_be.entities.Users;
import com.example.petshop_be.helpers.RandomHepler;
import com.example.petshop_be.repositories.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
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
            if (usersDTO.getPassword() != null && !usersDTO.getPassword().isEmpty()) {
                String hashedPassword = BCrypt.hashpw(usersDTO.getPassword(), BCrypt.gensalt());
                users.setPassword(hashedPassword);
            }
            Users savedUser = userRepository.save(users);

            if (savedUser != null) {

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

    @Override
    public boolean login(String username, String password) {
        try {
            Users acc = userRepository.findByUserName(username);
            if (acc != null && BCrypt.checkpw(password, acc.getPassword())) {
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public UsersDTO findByUserName(String userName) {
        try {
            Users user = userRepository.findByUserName(userName);
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

    @Override
    public String changePassword(ChangepassRequetsDTO changepassRequetsDTO) {
        try {
            Users user = userRepository.findByUserName(changepassRequetsDTO.getUserName());

            if (user == null) {
                return "User không tồn tại";
            }

            if (changepassRequetsDTO.getNewPassword().trim().length() < 2) {
                return "Mật khẩu mới phải hơn 2 kí tự";
            }

            if (!BCrypt.checkpw(changepassRequetsDTO.getOldPassword(), user.getPassword())) {
                return "Mật khẩu cũ không đúng";
            }

            user.setPassword(BCrypt.hashpw(changepassRequetsDTO.getNewPassword(), BCrypt.gensalt()));
            userRepository.save(user);
            return "done";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi " + e.getMessage();
        }
    }

    @Override
    public String updateUser(UsersDTO usersDTO) {
        try {
            Users user = userRepository.findByUserName(usersDTO.getUserName());
            if (user == null) {
                return "User không tồn tại";
            }
            if (usersDTO.getFullName() == null || usersDTO.getFullName().trim().length() < 2) {
                return "Full name phải có ít nhất 2 ký tự";
            }
            if (usersDTO.getPhoneNumber() == null ||
                    usersDTO.getPhoneNumber().trim().length() < 9 ||
                    !usersDTO.getPhoneNumber().matches("^0[0-9]{9}$")) {
                return "Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số và bắt đầu bằng số 0";
            }
            if (usersDTO.getGender() == null || usersDTO.getGender().trim().length() < 2) {
                return "Giới tính phải có ít nhất 2 ký tự";
            }
            if (usersDTO.getBirthday() == null) {
                return "Ngày sinh không được để trống";
            }
            user.setFullName(usersDTO.getFullName());
            user.setPhoneNumber(usersDTO.getPhoneNumber());
            user.setGender(usersDTO.getGender());
            user.setBirthday(usersDTO.getBirthday());
            userRepository.save(user);
            return "done";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi: " + e.getMessage();
        }
    }


}


