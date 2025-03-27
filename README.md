# Decentralized Storage System

A decentralized storage and retrieval system built with Next.js and IPFS. This application allows users to upload files to the IPFS network and retrieve them using content-based addressing.

## Features

- File upload to IPFS network
- Content-based file addressing
- File search functionality
- Modern and responsive UI
- Error handling and user feedback

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Infura IPFS account (for IPFS access)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd decentralized-storage
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Infura IPFS credentials:
```
NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_project_secret_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Files**:
   - Click the upload area or drag and drop files
   - Select a file from your device
   - Click the "Upload" button to store the file on IPFS

2. **Search Files**:
   - Enter a search query in the search box
   - Click the "Search" button to find files
   - View search results with file details and CIDs

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- IPFS HTTP Client
- Heroicons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
