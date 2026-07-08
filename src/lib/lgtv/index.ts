import { getRegistrationPayload, COMMANDS } from './protocol';
import { useTvStore } from '@/store/tvStore';

type CommandCallback = (err: Error | null, res: any) => void;

class LGTVClient {
  private ws: WebSocket | null = null;
  private pointerWs: WebSocket | null = null;
  private ip: string = '';
  private reqId: number = 1;
  private callbacks: Map<string, CommandCallback> = new Map();
  private isConnecting: boolean = false;
  
  // Connection loop
  private pingInterval: any = null;
  private reconnectTimeout: any = null;

  connect(ip: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) return;
    
    this.ip = ip;
    this.isConnecting = true;
    useTvStore.getState().setIsConnecting(true);
    
    // Attempt WSS first (port 3001) as it's required for mixed-content/HTTPS
    // Fallback to WS (port 3000) if it fails
    this.tryConnect(`wss://${ip}:3001`)
      .catch(() => this.tryConnect(`ws://${ip}:3000`))
      .catch(() => {
        this.cleanup();
        this.scheduleReconnect();
      });
  }

  private tryConnect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Attempting to connect to', url);
      try {
        const ws = new WebSocket(url);
        
        const timeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
            reject(new Error('Timeout'));
          }
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          this.ws = ws;
          this.register();
          resolve();
        };

        ws.onmessage = this.handleMessage.bind(this);
        
        ws.onerror = (err) => {
          clearTimeout(timeout);
          console.error('WebSocket Error:', err);
          reject(err);
        };
        
        ws.onclose = () => {
          if (this.ws === ws) {
            this.cleanup();
            this.scheduleReconnect();
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private register() {
    if (!this.ws) return;
    const clientKey = useTvStore.getState().clientKey;
    const payload = getRegistrationPayload(clientKey);
    this.ws.send(JSON.stringify(payload));
  }

  private handleMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);
      
      if (msg.type === 'registered') {
        const newClientKey = msg.payload['client-key'];
        if (newClientKey) {
          useTvStore.getState().setClientKey(newClientKey);
        }
        useTvStore.getState().setIsConnected(true);
        useTvStore.getState().setIsConnecting(false);
        this.isConnecting = false;
        
        this.onConnected();
        return;
      }
      
      if (msg.type === 'response' || msg.type === 'error') {
        const callback = this.callbacks.get(msg.id);
        if (callback) {
          if (msg.type === 'error') {
            callback(new Error(msg.error), null);
          } else {
            callback(null, msg.payload);
          }
          this.callbacks.delete(msg.id);
        }
      }
    } catch (err) {
      console.error('Error parsing TV message:', err);
    }
  }

  private onConnected() {
    // Start pinging
    this.pingInterval = setInterval(() => {
      this.send('request', 'ssap://system/getSystemInfo', {}, () => {});
    }, 5000);
    
    // Get initial state
    this.refreshState();
    
    // Subscribe to state changes (volume, app, etc)
    this.subscribe('ssap://audio/getVolume', (err, res) => {
      if (!err && res) {
        useTvStore.getState().setVolume(res.volume);
        useTvStore.getState().setIsMuted(res.muted);
      }
    });
    
    this.subscribe('ssap://com.webos.applicationManager/getForegroundAppInfo', (err, res) => {
      if (!err && res) {
        useTvStore.getState().setCurrentApp(res.appId);
      }
    });
  }
  
  public refreshState() {
    this.send('request', COMMANDS.GET_SYSTEM_INFO, {}, (err, res) => {
      if (!err && res) {
        useTvStore.getState().setTvInfo(res);
      }
    });
    
    this.send('request', COMMANDS.GET_VOLUME, {}, (err, res) => {
      if (!err && res) {
        useTvStore.getState().setVolume(res.volume);
        useTvStore.getState().setIsMuted(res.muted);
      }
    });
  }

  public send(type: 'request' | 'subscribe', uri: string, payload: any = {}, callback?: CommandCallback) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (callback) callback(new Error('Not connected'), null);
      return;
    }
    
    const id = `${type}_${this.reqId++}`;
    if (callback) this.callbacks.set(id, callback);
    
    this.ws.send(JSON.stringify({
      id,
      type,
      uri,
      payload
    }));
  }

  public subscribe(uri: string, callback: CommandCallback) {
    this.send('subscribe', uri, {}, callback);
  }
  
  public sendCommand(uri: string, payload: any = {}) {
    return new Promise((resolve, reject) => {
      this.send('request', uri, payload, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  private cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.pingInterval) clearInterval(this.pingInterval);
    useTvStore.getState().setIsConnected(false);
    useTvStore.getState().setIsConnecting(false);
    this.isConnecting = false;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (!this.ip) return;
    
    useTvStore.getState().setIsConnecting(true);
    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.ip);
    }, 5000); // Retry every 5s
  }

  public disconnect() {
    this.ip = '';
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.cleanup();
  }
  
  // Pointer Input Methods
  public async getPointerInputSocket() {
    if (this.pointerWs && this.pointerWs.readyState === WebSocket.OPEN) return;
    
    try {
      const res: any = await this.sendCommand(COMMANDS.GET_POINTER_INPUT_SOCKET);
      if (res && res.socketPath) {
        this.pointerWs = new WebSocket(res.socketPath);
        this.pointerWs.onopen = () => console.log('Pointer socket connected');
        this.pointerWs.onclose = () => {
          this.pointerWs = null;
        };
      }
    } catch (e) {
      console.error('Failed to get pointer socket:', e);
    }
  }

  public sendPointerCommand(command: string, options: any = {}) {
    if (!this.pointerWs || this.pointerWs.readyState !== WebSocket.OPEN) {
      this.getPointerInputSocket();
      return;
    }
    
    const payload = Object.keys(options)
      .map(k => `${k}:${options[k]}`)
      .join('\n');
    
    this.pointerWs.send(`type:${command}\n${payload}\n\n`);
  }
}

export const tvClient = new LGTVClient();
