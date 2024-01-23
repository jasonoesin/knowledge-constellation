# knowledge-constellation
 
## Backend (Nest.js) Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jasonoesin/knowledge-constellation.git

2. **Install dependecies:**

   ```bash
   cd backend
   npm install
3. **Configure environment variables:**
   <br>Create a .env file in the root of your project and configure the necessary environment variables based on the .env.example.
   ```bash
   NEO4J_USERNAME=example // Neo4j Graph Database Username
   NEO4J_PASSWORD=example // Neo4j Graph Database Password
   NEO4J_URI=example // Neo4j Graph Database URI
   AZURE_OPENAI_ENDPOINT = example // LLM Endpoint
   AZURE_OPENAI_KEY = example // LLM Key
   MODEL_DEPLOYMENT_NAME = example // LLM Model Name
   JWT_SECRET=example // JWT Secrets
   JWT_EXPIRES=example // JWT Expires
4. Start the backend service.
   ```bash
   npm run start

 Additional Information:
 - Make sure your Neo4j Graph Database is running and accessible with the provided credentials and URI.
 - Replace the placeholder values (e.g., 'example') in the environment variables with your actual configuration.
 - Ensure that Node.js and npm are installed on your machine.
 - The backend service will be available at the specified endpoint after successful startup.

## Frontend (Next.js) Installation

1. Navigate to the frontend directory

    ```bash
    cd ../
    cd frontend
2. Install dependencies:
    ```bash
    npm install

3. Start the frontend development server:
    ```bash
    npm run dev

Additional Information:
- The frontend development server will be available at http://localhost:3000.
