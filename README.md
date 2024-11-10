# Admin Frontend

This is the admin frontend for the Odin Blog project, providing control over blog content and user roles. Here, admins and authors can manage posts and control who has publishing rights.

## Overview

The admin frontend allows for the management of posts and user permissions. It offers restricted access to essential tools for content creators and blog managers.

- **Authors** can:

  - Create, edit, and delete their own posts.
  - Publish or unpublish their posts.

- **Admins** have additional capabilities:
  - Grant "Author" roles to other users, giving them permission to write and publish posts.

## Features

- **Post Management**: Create, update, delete, publish, or unpublish blog posts.
- **Role Management**: Admins can assign the "Author" role to users.
- **Access Control**: Restricted access; only authorized users (Admins/Authors) can access this interface.

## Tech Stack

- **Framework**: React, using Vite.
- **Styling**: CSS modules for component-specific styles.
- **State Management**: Context API for managing user roles and session information.
- **API Integration**: Connects to the backend API for CRUD operations on posts and user data.

## Links

- [Frontend](https://github.com/Uruwhy1/odin-blog-frontend): Regular frontend for browsing and reading posts.
- [Backend](https://github.com/Uruwhy1/odin-blog): Backend API and database setup for this blog system.

---
