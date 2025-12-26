# API Keys Setup Guide

This document explains how to create and configure all the API keys required to run the application correctly.

The application relies on several external services for AI processing and search capabilities:
- OpenAI (ChatGPT / GPT models)
- Google Gemini
- Google Custom Search API

---

## Required Configuration

The following properties must be defined in your `application.properties` file:

```properties
# API Keys for AI and Search
openai.api.key=
google.api.key=
google.search.engine.id=
google.gemini.api.key=
Each key is explained in detail below.

1. OpenAI API (ChatGPT)
Purpose
Used to:

Generate optimized Google search queries

Perform text analysis and reasoning tasks

How to Create an OpenAI API Key
Go to the OpenAI platform:
https://platform.openai.com/

Log in or create an account.

Navigate to Dashboard → API Keys.

Click Create new secret key.

Copy the generated key and store it securely.

⚠️ The key is shown only once. Make sure to save it.

Documentation
Quickstart: https://platform.openai.com/docs/quickstart

API Reference: https://platform.openai.com/docs/api-reference

application.properties Example
properties
Copier le code
openai.api.key=YOUR_OPENAI_API_KEY
2. Google Gemini API
Purpose
Used to:

Extract structured data from CVs

Analyze skills, experience, and career profiles

How to Create a Google Gemini API Key
Open Google AI Studio:
https://ai.google.dev/

Sign in with a Google account.

Create or select a Google Cloud project.

Go to API Keys / Credentials.

Click Create API Key.

Copy and securely store the key.

Documentation
Gemini API Key Guide: https://ai.google.dev/gemini-api/docs/api-key

Gemini OpenAI-Compatible API: https://ai.google.dev/gemini-api/docs/openai

application.properties Example
properties
Copier le code
google.gemini.api.key=YOUR_GEMINI_API_KEY
3. Google Custom Search API
Purpose
Used to:

Search for job opportunities

Search for training and learning resources

This API requires two elements:

A Google API Key

A Custom Search Engine ID

3.1 Create Google API Key
Open Google Cloud Console:
https://console.cloud.google.com/

Create or select a project.

Go to APIs & Services → Credentials.

Click Create Credentials → API Key.

Copy the generated key.

application.properties Example
properties
Copier le code
google.api.key=YOUR_GOOGLE_API_KEY
3.2 Create Custom Search Engine ID
Open Programmable Search Engine:
https://programmablesearchengine.google.com/

Create a new search engine.

Configure it to Search the entire web.

Save the configuration.

Copy the Search Engine ID (cx).

application.properties Example
properties
Copier le code
google.search.engine.id=YOUR_SEARCH_ENGINE_ID
Documentation
Custom Search API: https://developers.google.com/custom-search/v1/introduction