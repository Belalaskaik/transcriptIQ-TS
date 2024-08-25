Website: https://main.d4q1rgg2z9tw4.amplifyapp.com/

# Sales Transcript Annotator and Summary Tool

## Overview

The Sales Transcript Annotator and Summary Tool is a powerful application designed for sales managers. It allows you to annotate specific sections of a sales transcript by adding, editing, and deleting comments. You can also attach relevant files to each comment. The tool includes an AI-powered summary feature that uses advanced Large Language Models (LLMs) to generate concise overviews of transcripts and their associated comments. This feature is designed to enhance coaching and decision-making by providing actionable, data-driven feedback.

### Key Features

- **Comment Management**: Seamlessly add, edit, and delete comments on specific sections of sales transcripts.
- **File Attachments**: Attach relevant files to your comments for enhanced annotation.
- **AI-Powered Summaries**: Utilize cutting-edge LLMs to generate concise summaries of your transcripts and comments.
- **Sales Analysis**: Engage with AI to receive feedback and detailed analysis of your sales transcripts.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with AWS Lambda
- **Database**: DynamoDB for comment storage, S3 for file storage
- **AI Integration**: LLMs via AWS SageMaker or GPT API

## Getting Started

### 1. Create an Account

- Navigate to the homepage.
- Click on the **Sign Up** button.
- Complete the registration form with your name, email, and password.
- Submit the form to create your account.

### 2. Verify Your Account

- Check your email for a 6-digit verification code.
- Enter the code in the application to verify your account.
- Once verified, your account will be activated.

### 3. Log In

- Use your email and password to log in to the application.

### 4. Upload a Transcript

- Click the **Upload Transcript** button on the dashboard.
- Select the transcript file from your computer.
- The AI will process the transcript and provide initial feedback.

### 5. Edit a Transcript

- Click the **Edit Transcript** button on the transcript view page.
- Make the necessary changes to the transcript.
- Save your changes by clicking the **Save** button.

### 6. Add Comments

- Scroll through the transcript to the section where you want to add a comment.
- Highlight the text you want to annotate.
- Click the **Add Comment** button that appears.
- Enter your comment and, if necessary, attach a file.
- Your comment will be saved and displayed in the comments section.

### 7. Manage Comments

- To edit a comment, locate it in the comments section and click **Edit**.
- Make your changes and click **Save**.
- To delete a comment, click **Delete** next to the comment.

### 8. Use AI for Sales Analysis

- Interact with the AI to receive detailed feedback on your sales transcript.
- Ask the AI for clarifications, help, or a breakdown of specific parts of the review.

### 9. Generate a Summary

- Use the **Generate Summary** feature to create a concise overview of the transcript and its comments.

### 10. Log Out

- When finished, click **Sign Out** to log out of your account.

## Architecture

### Frontend

- **React with TypeScript**: Delivers an intuitive user interface for managing transcripts, comments, and AI interactions.

### Backend

- **Node.js with AWS Lambda**: Handles CRUD operations for comments and file attachments, and integrates with the LLM for generating summaries.

### Database

- **DynamoDB**: Stores comments and associated metadata.
- **S3**: Handles storage of attached files.

### AI Integration

- **GPT API (Llama)**: Used for generating concise summaries of transcripts and associated comments.

## Future Enhancements

- **Advanced Analytics**: Implement deeper AI-driven analysis, including trend detection and predictive insights.
- **User Collaboration**: Enable multiple users to annotate and comment on the same transcript in real-time.
- **Enhanced UI/UX**: Continuously improve the interface to make it more interactive and user-friendly.

---

This README provides a comprehensive guide to getting started with the Sales Transcript Annotator and Summary Tool, along with detailed information on the architecture and future enhancement plans.
