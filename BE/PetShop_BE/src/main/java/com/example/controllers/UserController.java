package com.example.controllers;

import com.example.Services.Userservice;
import com.example.Services.impl.MailserviceImple;
import com.example.dtos.UsersDTO;
import com.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/account")
public class UserController {

    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private MailserviceImple mailserviceImple;

    @Autowired
    private Environment environment;

    @Autowired
    private Userservice userservice;


//    @PostMapping(value = { "login" })
//    public String login(@RequestParam("username") String username,@RequestParam("password") String password
//            ,RedirectAttributes redirectAttributes,HttpSession session) {
//        if(accountJPAService.login(username, password)) {
//            session.setAttribute("username", username);
//            redirectAttributes.addFlashAttribute("msg", "Done!");
//        }else {
//            redirectAttributes.addFlashAttribute("msg", "Faile!");
//        }
//        return "accountjpa/login";
//
//    }

//    @GetMapping(value = { "register" })
//    public String register(ModelMap modelMap) {
//        Account account = new Account();
//        modelMap.put("account", account);
//        modelMap.put("roles", roleJPAService.findAll());
//        return "accountjpa/register";
//    }

//    @PostMapping(value = { "register" },consumes = MimeTypeUtils.APPLICATION_JSON_VALUE, produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
//    public String register(@RequestBody UsersDTO users, RedirectAttributes redirectAttributes) {
//        account.setStatus(false);
//        String securytyCode = RandomHelpers.random();
//
//        account.setSecurityCode(securytyCode);
//        if (accountJPAService.save(account)) {
//            /*Gui emal kich hoat tai khoan*/
//
//            String content = "Nhan vao <a href='"+environment.getProperty("BASE_URL")+"accountjpa/verify?email="+account.getEmail()+"&securitycode="+securytyCode+"'>day<a/>";
//            String from = environment.getProperty("spring.mail.username");
//            mailService.send(from, account.getEmail(), "Verify", content);
//            redirectAttributes.addFlashAttribute("msg", "Done!");
//            return "redirect:/accountjpa/login";
//        } else {
//            redirectAttributes.addFlashAttribute("msg", "Faile!");
//            return "redirect:/accountjpa/register";
//        }
//    }
//
//    @GetMapping("verify")
//    public String verify(@RequestParam("email") String email,
//                         ModelMap modelMap,@RequestParam("scurity") String code) {
//        Account account = accountJPAService.findbyEmail(email);
//        if(account!=null) {
//            if(account.getSecurityCode().equals(code)) {
//                account.setStatus(true);
//                accountJPAService.save(account);
//                modelMap.put("msg", "Kich hoat tai khoan thanh cong. Nhan vao <a href='"+environment.getProperty("BASE_URL")+"accountjpa/login'>Day</a> ");
//            }else {
//                modelMap.put("msg", "Khong the khich hoat tai khoan");
//            }
//        }else {
//            modelMap.put("msg", "Email khong ton tai");
//        }
//        return  "redirect:/accountjpa/verify";
//    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam("email") String email,
                                                      @RequestParam("scurity") String code) {
        Map<String, String> result = new HashMap<>();
        UsersDTO account = userservice.findByEmail(email);

        if (account == null) {
            result.put("err", "Email không tồn tại");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        if (!account.getSecurityCode().equals(code)) {
            result.put("err", "Không thể kích hoạt tài khoản");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        account.setStatus((byte) 1);
        userservice.save(account);
        result.put("successfully", "done!");
        return ResponseEntity.ok(result);
    }


}
