# Honeypot Enabled Authentication System

## Overview
The **Honeypot Enabled Authentication System** is a web security platform designed to enhance traditional authentication mechanisms by integrating honeypot-based attack detection. The system monitors suspicious login behavior and redirects malicious users to a controlled decoy environment while logging attack details for analysis.

This approach helps detect automated attacks such as brute-force attempts and bot interactions without affecting legitimate users.

---

## Features

- User Registration and Login System
- Honeypot-based Attack Detection
- Bot Filtering Mechanism
- SQL Injection Prevention Module
- Decoy (Dummy) Environment for Attackers
- Centralized Activity Logging
- Interactive Security Dashboard
- User-specific Activity Monitoring
- Settings Page for Profile Management

---

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- MongoDB Compass

---

## System Modules

### Authentication Module
Handles user registration and login verification using secure credential 

### Honeypot Detection Module
Monitors login attempts and triggers a honeypot trap when abnormal behavior is detected.

### Activity Logging Module
Records all authentication and security-related events such as login attempts and blocked attacks.

### Dashboard Monitoring Module
Displays real-time insights including:
- Total login attempts
- Blocked malicious attempts
- Active security services

---

## System Architecture

The system follows a **Client–Server–Database architecture**.
