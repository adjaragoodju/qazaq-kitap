#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== QazaqKitap Flask Backend Setup ===${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.11 or higher.${NC}"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d " " -f 2)
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || [ "$PYTHON_MAJOR" -eq 3 -a "$PYTHON_MINOR" -lt 11 ]; then
    echo -e "${YELLOW}Warning: Python version $PYTHON_VERSION detected. We recommend Python 3.11 or higher.${NC}"
else
    echo -e "${GREEN}Python $PYTHON_VERSION detected.${NC}"
fi

# Create virtual environment
echo -e "\n${GREEN}Creating virtual environment...${NC}"
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create virtual environment.${NC}"
    exit 1
fi

# Activate virtual environment
echo -e "\n${GREEN}Activating virtual environment...${NC}"
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to activate virtual environment.${NC}"
    exit 1
fi

# Install dependencies
echo -e "\n${GREEN}Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\n${GREEN}Creating .env file from template...${NC}"
    cp .env.example .env
    
    # Generate a random secret key
    SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(16))')
    sed -i "s/dev-key-please-change-in-production/$SECRET_KEY/g" .env
    
    echo -e "${YELLOW}Please check and edit the .env file with your database credentials.${NC}"
fi

# Create uploads directory
echo -e "\n${GREEN}Creating uploads directory...${NC}"
mkdir -p app/static/uploads

# Setup database
echo -e "\n${GREEN}Setting up database...${NC}"
echo -e "${YELLOW}Note: Make sure PostgreSQL is running and the database is created.${NC}"
echo -e "${YELLOW}To create database manually, run: createdb qazaq_kitap${NC}"

flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Final instructions
echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\n${YELLOW}To run the application:${NC}"
echo -e "  1. Make sure your PostgreSQL and Redis servers are running"
echo -e "  2. Run: ${GREEN}flask run -p 3000${NC}"
echo -e "  3. Seed the database: Visit ${GREEN}http://localhost:3000/api/books/seed${NC} in your browser"
echo -e "\n${YELLOW}For more information, please see README.md${NC}"