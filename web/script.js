const socket = io();

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}

function updateDevices(devices) {
    const devicesDiv = document.getElementById('devices');
    devicesDiv.innerHTML = devices.map(device => `
        <div class="device-card bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium">${device.name}</h3>
            <p><strong>IP:</strong> ${device.ip}</p>
            <p><strong>Port:</strong> ${device.port}</p>
            <p><strong>Status:</strong> <span class="inline-block px-2 py-1 text-white text-sm rounded ${
                device.status === 'Connected' ? 'status-connected' :
                device.status === 'Disconnected' ? 'status-disconnected' :
                'status-error'
            }">${device.status}</span></p>
        </div>
    `).join('');
}

socket.on('init', (data) => {
    document.getElementById('server-name').textContent = data.server.name;
    document.getElementById('server-name-detail').textContent = data.server.name;
    document.getElementById('server-version').textContent = data.server.version;
    document.getElementById('server-uptime').textContent = formatUptime(data.server.uptime);
    document.getElementById('server-endpoint').textContent = data.server.endpoint;
    updateDevices(data.devices);
});

socket.on('status', (data) => {
    document.getElementById('server-uptime').textContent = formatUptime(data.server.uptime);
    updateDevices(data.devices);
});
