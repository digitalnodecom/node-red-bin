# Node-RED Standalone Binaries

Standalone executable binaries of Node-RED for multiple platforms. No Node.js installation required.

## Projects

This repository contains two projects:

1. **Node-RED CLI Binaries** (this directory) - Standalone command-line binaries
2. **[Node-RED Desktop](./node-red-desktop/)** - Cross-platform desktop application with GUI for managing multiple Node-RED instances

## Features

- Standalone binaries for macOS, Linux, and Windows
- No Node.js or npm installation required
- Multiple platform support (Intel & ARM)
- Simple CLI interface
- Portable and easy to distribute

## Download

Download the latest binaries from the [Releases](https://github.com/digitalnodecom/node-red-bin/releases) page:

| Platform | Binary | Architecture |
|----------|--------|--------------|
| macOS Intel | `node-red-macos-x64` | x86_64 |
| macOS Apple Silicon | `node-red-macos-arm64` | ARM64 |
| Linux | `node-red-linux-x64` | x86_64 |
| Windows | `node-red-win-x64.exe` | x86_64 |

## Installation

### macOS

1. Download the appropriate binary for your Mac:
   - Intel Macs: `node-red-macos-x64`
   - Apple Silicon (M1/M2/M3): `node-red-macos-arm64`

2. Make the binary executable:
   ```bash
   chmod +x node-red-macos-x64
   # or
   chmod +x node-red-macos-arm64
   ```

3. Run Node-RED:
   ```bash
   ./node-red-macos-x64
   # or
   ./node-red-macos-arm64
   ```

### Linux

1. Download `node-red-linux-x64`

2. Make the binary executable:
   ```bash
   chmod +x node-red-linux-x64
   ```

3. Run Node-RED:
   ```bash
   ./node-red-linux-x64
   ```

### Windows

1. Download `node-red-win-x64.exe`

2. Double-click to run, or use Command Prompt:
   ```cmd
   node-red-win-x64.exe
   ```

## Usage

### Default Usage

Simply run the binary without any arguments:

```bash
./node-red-macos-x64
```

Node-RED will start on port **6878** by default and create a `.node-red` directory in your home folder.

Access the Node-RED editor at: `http://localhost:6878/admin`

### CLI Options

```bash
-p, --port <number>        Port number (default: 6878)
-u, --userDir <path>       Path to user directory (default: ~/.node-red)
-s, --settings <path>      Path to settings.json file
-h, --help                 Display help
```

### Examples

Start on a different port:
```bash
./node-red-macos-x64 --port 1880
```

Use a custom user directory:
```bash
./node-red-macos-x64 --userDir /path/to/data
```

Use a settings file:
```bash
./node-red-macos-x64 --settings ./my-settings.json
```

Combine options:
```bash
./node-red-macos-x64 --port 7878 --userDir ./node-red-data --settings ./settings.json
```

## Configuration

### Settings File

You can customize Node-RED using a settings.json file. See [example-settings.json](example-settings.json) for a template.

Example settings file:
```json
{
  "uiPort": 7878,
  "flowFile": "flows.json",
  "credentialSecret": "my-secret-key",
  "logging": {
    "console": {
      "level": "info",
      "metrics": false,
      "audit": false
    }
  },
  "editorTheme": {
    "projects": {
      "enabled": false
    }
  }
}
```

### Configuration Priority

Configuration values are merged in this order (later overrides earlier):
1. Default values
2. Settings file (if provided via `--settings`)
3. CLI arguments

### User Directory

The user directory stores your flows, credentials, and installed nodes. Default locations:

- **macOS/Linux**: `~/.node-red`
- **Windows**: `%USERPROFILE%\.node-red`

## Platform-Specific Notes

### macOS

- On macOS Catalina and later, you may see a security warning when first running the binary
- Right-click the binary and select "Open" to bypass the warning
- Or use: `xattr -d com.apple.quarantine node-red-macos-x64`

### Linux

- Ensure the binary has execute permissions: `chmod +x node-red-linux-x64`
- Some distributions may require additional dependencies

### Windows

- Windows Defender may scan the binary on first run
- You may need to allow the binary through Windows Firewall

## Building from Source

### Prerequisites

- Node.js 22.x or later
- npm

### Build Steps

1. Clone the repository:
   ```bash
   git clone git@github.com:digitalnodecom/node-red-bin.git
   cd node-red-bin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for your platform:
   ```bash
   # macOS Intel
   npm run build:macos-x64

   # macOS Apple Silicon
   npm run build:macos-arm64

   # Linux
   npm run build:linux-x64

   # Windows
   npm run build:win-x64
   ```

4. Find the binary in the `build/` directory

### Build All Platforms

```bash
npm run build:macos-x64
npm run build:macos-arm64
npm run build:linux-x64
npm run build:win-x64
```

Note: Cross-platform builds may have limitations depending on your host OS.

## Troubleshooting

### Port Already in Use

If you see "port already in use" error, either:
- Stop the process using port 6878
- Use a different port: `./node-red-macos-x64 --port 7878`

### Permission Denied (Linux/macOS)

Make sure the binary is executable:
```bash
chmod +x node-red-macos-x64
```

### Windows Security Warning

If Windows blocks the binary:
1. Click "More info"
2. Click "Run anyway"

Or add an exception in Windows Defender.

### Cannot Find Module

If you see module errors, ensure you're using the correct binary for your platform and architecture.

## Version Information

This binary packages Node-RED v5.0.0-beta.4 with Node.js 22.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [Node-RED Official Site](https://nodered.org/)
- [Node-RED Documentation](https://nodered.org/docs/)
- [Report Issues](https://github.com/digitalnodecom/node-red-bin/issues)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### Development

To run Node-RED without building:
```bash
npm start
```

This runs the source directly using Node.js.

## Credits

Built with [pkg](https://github.com/vercel/pkg) for packaging Node.js applications as standalone executables.
