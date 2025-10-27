# Bufferstack.IO MCProtocol OPC UA Server

**Version:** 6.7.0  
**Developer:** Bufferstack.IO Analytics Technology, LLP  
**Copyright:** 2025 Harshad Joshi. All rights reserved.

***

## Overview

Professional-grade OPC UA server providing seamless connectivity between Mitsubishi PLCs and industrial SCADA/HMI systems. This server eliminates the need for expensive proprietary software by implementing native SLMP/MC Protocol communication with support for both Binary and ASCII formats.

### What It Does

The Bufferstack.IO MCProtocol OPC UA Server acts as a gateway that:

- Connects to Mitsubishi PLCs via Ethernet using SLMP/MC Protocol
- Exposes PLC data through industry-standard OPC UA interface
- Enables any OPC UA-compliant SCADA system to communicate with Mitsubishi PLCs
- Eliminates vendor lock-in by providing an open-standard integration path

### Why It Matters

Traditional integration with Mitsubishi PLCs requires expensive licensed software or complex custom development. This solution provides:

- Cost savings of 80-90% compared to official Mitsubishi OPC UA modules
- Faster project deployment with plug-and-play connectivity
- Vendor-neutral architecture supporting any OPC UA client
- Production-ready reliability with intelligent reconnection and error handling

***

## Key Features

### Protocol Support
- Mitsubishi SLMP/MC Protocol (Seamless Link Messaging Protocol)
- Frame Types: 1E, 3E, and 4E
- Communication Modes: Binary and ASCII
- Compatible PLCs: FX5U, FX5UC, Q-Series, L-Series, iQ-R Series

### Performance
- High-speed data polling with optimized algorithms
- Automatic reconnection with intelligent exponential backoff
- Real-time web dashboard with Socket.IO integration
- Single instance lock prevents multiple server conflicts

### Reliability
- Production-ready error handling with user-friendly messages
- Comprehensive logging with optional debug mode
- Network stability monitoring and automatic recovery
- Value retention during temporary communication loss

### Data Types Supported
- Boolean (Bit devices: M, X, Y, L, S, SM, TS, CS)
- 16-bit integers (Int16, UInt16)
- 32-bit integers (Int32, UInt32)
- 32-bit floating point (IEEE 754)

### Supported PLC Device Codes
- Word Devices: D, R, SD
- Bit Devices: M, X, Y, L, S, SM
- Counter/Timer: C, T, TN, CN, TS, CS

***

## System Requirements

### Minimum Requirements
- Windows 10/11, Windows Server 2016 or later
- 2 GB RAM minimum
- 100 MB disk space
- Ethernet network adapter
- Network connectivity to target Mitsubishi PLC(s)

### Network Requirements
- TCP port 4840 available for OPC UA server (configurable)
- TCP port 8080 available for web dashboard (configurable)
- Firewall configured to allow outbound connections to PLC IP addresses
- Static IP addresses recommended for PLCs

***

## Installation

1. Extract the application package to your desired installation directory
2. Ensure the following files are present:
   - Application executable
   - Configuration file template (config.conf)
   - Web dashboard files (web folder)
   - Required library files

3. The application will automatically create the following directories on first run:
   - log/ - Contains application logs
   - pki/ - Contains OPC UA security certificates

***

## Configuration

### Configuration File Format

The server uses configuration file named `config.conf` that must be placed in the same directory as the executable.

### Basic Configuration Structure

The configuration file contains three main sections:

**OPC UA Server Settings**
- Port number for OPC UA endpoint
- URL path for the server

**Web Dashboard Settings**
- Port number for web interface
- Socket.IO server address

**Device Configuration**
- One or more PLC device definitions
- Each device includes connection parameters and address mappings

### Device Connection Parameters

For each PLC device, you must specify:

- Device Name: Unique identifier used in OPC UA node structure
- Host: IP address of the PLC
- Port: TCP port number (typically 5007 for MC Protocol)
- Frame Type: Select 1E, 3E, or 4E based on your PLC model
- Format: Choose "binary" for performance or "ascii" for debugging
- Poll Rate: Data refresh interval in milliseconds (minimum 10ms)

### Address Mapping Configuration

Each device requires an address space definition that maps PLC registers to OPC UA nodes:

- Address: PLC register identifier (e.g., D100, M0, X10)
- Node Name: Unique name for the OPC UA node
- Data Type: Boolean, Int16, UInt16, Int32, UInt32, or Float
- Access Mode: "read" for read-only, "readwrite" for bidirectional

### Array Data Configuration

For consecutive register blocks, you can define array structures:

- Specify the starting address
- Define the number of elements (count)
- Provide sub-node definitions with offset values
- Each sub-node gets its own OPC UA node

### Frame Type Selection Guide

**1E Frame**: Legacy format for older PLC models  
**3E Frame**: Standard format, most widely used (recommended)  
**4E Frame**: Extended format with routing information for complex networks

### Binary vs ASCII Format

**Binary Format:**
- Faster data transmission speed
- Lower network bandwidth usage
- Recommended for production environments
- Better performance with large data sets

**ASCII Format:**
- Human-readable protocol messages
- Easier to debug with network analyzers
- Compatible with some legacy systems
- Slightly higher latency

***

## Running the Server

### Starting the Application

**Normal Mode:**
Execute the application directly. The server will start with standard logging.

**Debug Mode:**
Launch with the `-d` command line flag for verbose diagnostic logging. This mode logs all communication details and is useful for troubleshooting.

### Successful Startup Indicators

When the server starts successfully, you will see:

- Application lock confirmation (prevents duplicate instances)
- Configuration validation results
- Device initialization status for each PLC
- OPC UA server endpoint information
- Web interface URL
- Device connection attempts and results

### Automatic Behavior

The server automatically:

- Creates log and certificate directories on first run
- Validates all configuration before starting
- Attempts to connect to all configured PLCs
- Retries failed connections with exponential backoff
- Monitors connection health and reconnects if needed

### Runtime Limitations

Demo Mode: The server runs for 1 hour and then automatically shuts down. This limitation is removed in licensed versions.

***

## OPC UA Connectivity

### Connection Information

**Endpoint URL Format:**
opc.tcp://[hostname]:4338/UA/BufferstackMCProtocol

Replace [hostname] with:
- localhost (if connecting from the same machine)
- Server IP address (if connecting from network)

**Security Settings:**
- Security Mode: None
- Security Policy: None
- Authentication: Anonymous access enabled

**Namespace Information:**
- Namespace Index: 1
- Device nodes located under: Root > Objects > MCDevices

### OPC UA Node Structure

The server creates the following hierarchy:

Root
- Objects
  - MCDevices
    - [DeviceName1]
      - Status (connection status)
      - [NodeName1] (configured data point)
      - [NodeName2] (configured data point)
      - [ArrayName] (folder for array data)
        - [SubNode1]
        - [SubNode2]
    - [DeviceName2]
      - Status
      - [Additional nodes]

### Node Addressing

To access a specific data point, use the format:
ns=1;s=[DeviceName].[NodeName]

Example:
ns=1;s=PLC_Line1.Temperature

### Data Quality Indicators

The server provides OPC UA quality codes:

- Good: PLC connected and data valid
- Uncertain: Using last known value due to validation failure
- BadNotConnected: PLC disconnected
- BadDataUnavailable: No valid data available

***

## Web Dashboard

### Accessing the Dashboard

Open a web browser and navigate to:
http://localhost:8080

(Replace localhost with server IP if accessing remotely)

### Dashboard Features

**Server Information:**
- Application version
- Server uptime
- OPC UA endpoint address

**Device Status:**
- Real-time connection status for each PLC
- Device IP addresses and ports
- Communication format (binary/ascii)
- Polling rate configuration

**Live Updates:**
The dashboard automatically refreshes status information every 2 seconds .
---

## Error Handling and Diagnostics

### User-Friendly Error Messages

This server features production-grade error handling that converts technical errors into clear, actionable messages. You will never see cryptic error codes or stack traces.

### Common Error Categories

**Network Errors:**
- Connection refused: PLC is not accepting connections
- Connection timeout: PLC not responding within expected timeframe
- Host unreachable: Network path to PLC is unavailable
- Connection reset: PLC unexpectedly closed connection

**Configuration Errors:**
- Missing configuration file
- Invalid config.conf syntax
- Missing required parameters
- Invalid parameter values
- Duplicate node names

**Device Errors:**
- PLC communication failures
- Invalid address formats
- Unsupported device codes
- Data type mismatches

**System Errors:**
- Port already in use (another application conflict)
- File permission issues
- Insufficient system resources

### Logging

**Log File Location:**
All logs are written to: /log/daemon.log in installation directory

**Log Levels:**
- INFO: Normal operational messages
- WARN: Non-critical issues and recoverable errors
- ERROR: Critical errors requiring attention
- DEBUG: Detailed diagnostic information (debug mode only)

**Log Rotation:**
Logs append continuously. Implement external log rotation if running long-term.

***

## Troubleshooting

### Server Won't Start

**Check Configuration File:**
- Ensure config.conf exists in the application directory
- Verify syntax is correct
- Confirm all required parameters are present

**Check Port Availability:**
- Verify OPC UA port (default 4840) is not in use
- Verify web dashboard port (default 8080) is not in use
- Close other instances of the application

**Check Permissions:**
- Ensure write access to application directory
- Confirm Windows Firewall allows the application

### Cannot Connect to PLC

**Verify Network Connectivity:**
- Ping the PLC IP address from server machine
- Confirm PLC Ethernet port is configured correctly
- Check network cables and switches

**Verify PLC Configuration:**
- Ensure MC Protocol is enabled on the PLC
- Verify PLC IP address matches configuration
- Confirm port number (typically 5007)
- Check PLC firewall settings if applicable

**Check Frame Type:**
- Verify frame type matches PLC model (usually 3E)
- Consult PLC documentation for supported frame types

**Test Format:**
- Try switching between binary and ascii formats
- Some PLC models prefer one format over the other

### OPC UA Client Connection Issues

**Verify Endpoint URL:**
- Confirm hostname and port are correct
- Try using IP address instead of hostname
- Check for typos in URL path

**Check Security Settings:**
- Ensure client accepts MessageSecurityMode.None
- Verify client allows anonymous authentication
- Some clients require manual security configuration

**Firewall Configuration:**
- Confirm Windows Firewall allows OPC UA port
- Check corporate firewall rules
- Test from local machine first, then network

### Data Not Updating

**Check Connection Status:**
- View web dashboard for device connection status
- Check logs for connection errors
- Verify PLC is powered on and responsive

**Verify Address Configuration:**
- Confirm PLC register addresses exist
- Check data type matches register type
- Verify device code is supported by PLC model

**Review Poll Rate:**
- Ensure poll rate is not too slow
- Check for error messages in logs
- Monitor CPU usage (poll rate may be too fast)

***

## Performance Optimization

### Polling Configuration

**Recommended Poll Rates:**
- Standard applications: 200-500ms
- High-speed monitoring: 100-200ms
- Low-priority data: 500-1000ms
- Minimum supported: 10ms (use with caution)

### Network Considerations

**Binary vs ASCII:**
Binary format provides 20-30% better performance. Use binary unless debugging or compatibility requires ASCII.

**Batch Operations:**
The server automatically optimizes read operations by batching consecutive registers when possible. Group related registers together in the PLC memory map.

**Multiple Devices:**
The server handles multiple PLCs efficiently through parallel connection management. Each device operates independently with its own polling cycle.

### Resource Usage

**Typical Resource Consumption:**
- CPU: Less than 5% on modern systems
- RAM: 50-100 MB depending on configured nodes
- Network: Minimal bandwidth usage
- Disk: Log file growth only

---

## Best Practices

### Configuration Management

- Use descriptive device names and node names
- Document custom configurations with comments
- Keep backup copies of working configurations
- Test configuration changes in non-production first

### Network Architecture

- Use static IP addresses for PLCs
- Implement managed switches for industrial networks
- Keep OPC UA server on same subnet as PLCs when possible
- Document network topology and IP assignments

### Security Considerations

- Run server on dedicated machine when possible
- Implement network segmentation between office and plant networks
- Use VPN for remote access rather than exposing OPC UA port
- Regularly review access logs
- Update Windows and security software regularly

### Maintenance

- Monitor log files regularly for warnings
- Test backup configurations periodically
- Document any custom modifications
- Keep notes on PLC register assignments

***

## Support and Documentation

### Log Files

The most important diagnostic tool is the log file located at:
./log/daemon.log

Always check this file first when troubleshooting issues.

### Technical Support

For technical support, provide the following information:
- Application version number
- Operating system version
- Configuration file (remove sensitive IP addresses)
- Relevant log file entries
- Description of issue and steps to reproduce

### Product Information

**Manufacturer:** Bufferstack.IO Analytics Technology, LLP  
**Product Version:** 6.7.0  
**Product Type:** Industrial Automation Gateway Software  
**License:** Proprietary - Commercial Use

***

## Limitations and Notices

### Demo Version Restrictions

- Runtime limited to 1 hour per session
- Full features available during demo period
- Configuration and data persist between restarts

### Known Limitations

- Maximum 500 subscriptions per OPC UA server instance
- Maximum 5000 monitored items per subscription
- Single instance only (cannot run multiple copies simultaneously)
- Web dashboard requires modern web browser (Chrome, Edge, Firefox)

### Legal Notice

This software is proprietary and confidential. Unauthorized copying, distribution, modification, or reverse engineering is strictly prohibited. All rights reserved by Bufferstack.IO Analytics Technology, LLP.

***

## Appendix

### Supported Mitsubishi PLC Models

**FX Series:**
FX5U, FX5UC, FX5UJ, FX5S

**Q Series:**
Q03UDE, Q04UDE, Q06UDE, Q13UDE, Q26UDE

**L Series:**
L02CPU, L06CPU, L26CPU

**iQ-R Series:**
R04CPU, R08CPU, R16CPU, R32CPU, R120CPU

### TCP Port Reference

- 4840: Default OPC UA server port (configurable)
- 8080: Default web dashboard port (configurable)
- 5007: Default Mitsubishi MC Protocol port
- 
### Data Type Memory Requirements

- Boolean: 1 bit
- Int16/UInt16: 1 word (16 bits)
- Int32/UInt32/Float: 2 words (32 bits / 1 DWORD)

### Configuration File Backup Location

Keep backup copies of working configurations in a separate location. The application does not automatically backup configurations.

***
