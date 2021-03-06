package com.sap.sf.ar.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.sap.sf.ar.util.SessionHolder;

public class LoginRequiredInterceptor extends HandlerInterceptorAdapter {

    private static final Logger LOGGER = Logger.getLogger(LoginRequiredInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {
    	
    		String loginPage = "/arui/index.html";
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute(SessionHolder.USER_ID);
        String usrFullName = (String) session.getAttribute(SessionHolder.USER_FULLNAME);
        String usrRole = (String) session.getAttribute(SessionHolder.USER_ROLE);

        LOGGER.debug(String.format("=======request preHandle: userId: %s, request url: %s, query string: %s, method: %s", 
        		userId, request.getRequestURL(), request.getQueryString(), request.getMethod()));

        if (userId == null && !loginPage.equals(request.getRequestURI())) {
            LOGGER.warn("---[Login]--- NO authorized user in the session, should login");
            SessionHolder.setContext(null, null, null);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());

//            LOGGER.warn("---[Login]--- redirect to login page");
//            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
//            response.sendRedirect(baseUrl + loginPage);
            return false;
        } else {
            SessionHolder.setContext(userId, usrFullName, usrRole);
        }
        
        return userId != null;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    }

}
