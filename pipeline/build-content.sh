#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'
CHECK=""
STEP="🚀"
ERROR=""

// Get the root path.
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

run_step() {
  local title=$1
  local cmd=$2
  
  echo -e "${BLUE}${STEP} ${title}...${NC}"
  
  if (cd "$PROJECT_ROOT" && eval "$cmd"); then
    echo -e "${GREEN}${CHECK} ${title} completed!${NC}\n"
  else
    echo -e "${RED}${ERROR} ${title} failed!${NC}"
    exit 1
  fi
}

echo -e "${BLUE}=== Starting Deployment Pipeline ===${NC}\n"

run_step "Generating Markdown from TS" "cd content/typescript && sh ts2md.sh"

run_step "Linting with Biome" "pnpm biome ci"
run_step "Type Checking: src" "pnpm type"
run_step "Type Checking: test" "pnpm type:test"
run_step "Type Checking: scripts" "pnpm type:pipe"
run_step "Type Checking: playwright" "pnpm type:playwright"

run_step "Running Tests" "pnpm test"

run_step "Building HTML (SSG)" "pnpm build"
run_step "Verifying SSG Output" "pnpm test:ssg"
run_step "Running Playwright" "pnpm test:ui"

echo -e "${GREEN}✨ All steps completed successfully! Ready to deploy.${NC}"
