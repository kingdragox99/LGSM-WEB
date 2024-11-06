# LGSM-WEB

LGSM-WEB is a modern web interface for managing your Linux game servers using [LinuxGSM](https://linuxgsm.com/). This application simplifies game server management by providing an intuitive and responsive user interface.

## Features

- 🎮 Game server management (start, stop, restart)
- 🔐 Secure authentication with Supabase
- 🌍 Multilingual interface (French, English)
- 🖥️ SSH connection management
- 📱 Responsive interface

## Prerequisites

- Node.js (v18 or higher)
- Yarn (v1.22 or higher)
- Supabase database
- Linux server with LinuxGSM installed

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/LGSM-WEB.git
cd LGSM-WEB
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the project root:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
ENCRYPTION_KEY=your_encryption_key
```

4. Configure your Supabase database by importing the schema provided in `database/schema.sql`

## Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Production

1. Build the application:
```bash
yarn build
```

2. Start the production server:
```bash
yarn start
```

## Project Structure

```
LGSM-WEB/
├── components/        # Reusable Vue components
├── pages/            # Application pages
├── i18n/             # Translation files
├── public/           # Static assets
└── server/           # API and middleware
```

## Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT](LICENSE)

## Support

If you encounter any issues or have questions, feel free to:
- Open an issue on GitHub
- Check the [documentation](link_to_your_documentation)
