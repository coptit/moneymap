# MoneyMap

Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/en)

- [npm](https://www.npmjs.com/)

```bash
# Clone the repo
git clone https://github.com/coptit/moneymap.git

# Change Directory to the repo
cd moneymap

# Install the Dependencies
npm install

# Move to Server Directory (Backend Code)
cd server

# Create a SQLite3 Database with [Prisma](https://prisma.io)
npx prisma migrate dev --name init

# Move back to the root directory
cd ../

# Run Backend + Frontend Simultaneously
npm run dev
```

### or Run with Docker

```bash
sudo docker run -it --rm -p 4000:4000 -p 4001:4001 ghcr.io/coptit/moneymap:latest
```

> Here Frontend will run on `4000` and Backend will run on `4001`


#### Frontend is build with `React` + `Vite` + `Tailwind CSS` + `Typescript`

#### Backend is build with `tRPC` + `Prisma` + `SQLite3` + `Typescript`

About:

Innothon is a 2 Day Hackathon organized by NRI College, Bhopal, it was great experience.

Our Team got 2nd Rank.

This repository is the project created during the hackathon.

Team:

![team-image](https://tiddi.kunalsin9h.com/L1OUVMI)

[Kunal Singh](https://github.com/kunalsin9h)

[Anurag Kumar Yadav](https://github.com/anurag41682)

[Srijan Soni](https://github.com/srijan0412)

[Sudhakar Singh](https://github.com/naaam-h-siddhu)

[Amey Paliwal](https://linkedin.com/in/amey-paliwal-b6a0b9257)

### Demo

![demo-image](https://tiddi.kunalsin9h.com/pjfom2e)
