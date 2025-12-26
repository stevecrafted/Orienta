package com.example.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        
        logger.info("========================================");
        logger.info("🚀 REQUÊTE ENTRANTE");
        logger.info("Méthode: {}", request.getMethod());
        logger.info("URL: {}", request.getRequestURL().toString());
        logger.info("URI: {}", request.getRequestURI());
        logger.info("Query String: {}", request.getQueryString());
        logger.info("Remote Address: {}", request.getRemoteAddr());
        logger.info("Handler: {}", handler);
        logger.info("========================================");
        
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        logger.info("📤 POST-HANDLE - Status: {}", response.getStatus());
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long executeTime = endTime - startTime;
        
        logger.info("========================================");
        logger.info("✅ REQUÊTE TERMINÉE");
        logger.info("URL: {}", request.getRequestURL().toString());
        logger.info("Status: {}", response.getStatus());
        logger.info("Temps d'exécution: {} ms", executeTime);
        if (ex != null) {
            logger.error("❌ Exception: {}", ex.getMessage());
        }
        logger.info("========================================");
    }
}
