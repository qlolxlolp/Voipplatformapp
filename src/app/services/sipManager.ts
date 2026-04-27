import { UserAgent, UserAgentOptions, Inviter, SessionState, Registerer, Session, RegistererState } from 'sip.js';
import { useAppStore } from '../store/useAppStore';
import { db } from './db';

class SIPService {
  private userAgent: UserAgent | null = null;
  private registerer: Registerer | null = null;
  private currentSession: Session | null = null;
  
  public init() {
    const state = useAppStore.getState();
    const uri = `sip:${state.extension}@${state.serverIp}`;
    
    const wsUrl = state.wssEnabled 
      ? `wss://${state.serverIp}:${state.wsPort}/ws` 
      : `ws://${state.serverIp}:${state.wsPort}/ws`;

    const options: UserAgentOptions = {
      uri: UserAgent.makeURI(uri),
      transportOptions: {
        server: wsUrl,
        connectionTimeout: 10,
        keepAliveInterval: 20,
      },
      authorizationUsername: state.extension,
      authorizationPassword: state.sipPassword,
      displayName: state.displayName,
      userAgentString: 'VOIP Mother Client 1.0.0',
      logBuiltinEnabled: false, // Turn off built-in logging for cleaner console
    };

    try {
      this.userAgent = new UserAgent(options);
      
      // Handle Incoming Calls
      this.userAgent.delegate = {
        onInvite: (invitation) => {
          console.log("Incoming call from: ", invitation.remoteIdentity.uri.user);
          useAppStore.getState().incrementActiveCalls();
          
          invitation.stateChange.addListener((sessionState) => {
            if (sessionState === SessionState.Terminated) {
              useAppStore.getState().decrementActiveCalls();
              db.calls.add({
                direction: 'incoming',
                number: invitation.remoteIdentity.uri.user || 'Unknown',
                name: invitation.remoteIdentity.displayName || 'Unknown',
                duration: Math.floor((Date.now() - invitation.startTime!.getTime()) / 1000) || 0,
                timestamp: Date.now(),
                status: 'answered' // simplistic status
              });
            }
          });

          // Simulate auto answer if enabled
          if (useAppStore.getState().autoAnswer) {
            invitation.accept();
          }
        },
      };

      // Connect Transport
      this.userAgent.start().then(() => {
        useAppStore.getState().setConnectionStatus(true);
        this.register();
      }).catch((error) => {
        console.error("SIP Transport Error: ", error);
        useAppStore.getState().setConnectionStatus(false);
      });

    } catch (err) {
      console.error("Failed to init SIP UserAgent: ", err);
    }
  }

  private register() {
    if (!this.userAgent) return;
    
    useAppStore.getState().setRegistrationStatus('registering');
    
    this.registerer = new Registerer(this.userAgent);
    
    this.registerer.stateChange.addListener((state) => {
      if (state === RegistererState.Registered) {
        useAppStore.getState().setRegistrationStatus('registered');
        db.logs.add({
          type: 'info',
          message: 'SIP Registered successfully',
          timestamp: Date.now(),
          ip: useAppStore.getState().serverIp
        });
      } else if (state === RegistererState.Unregistered || state === RegistererState.Terminated) {
        useAppStore.getState().setRegistrationStatus('unregistered');
      }
    });

    this.registerer.register().catch((err) => {
      console.error("Registration failed", err);
      useAppStore.getState().setRegistrationStatus('failed');
    });
  }

  public makeCall(targetExtension: string) {
    if (!this.userAgent) return;
    
    const state = useAppStore.getState();
    const targetURI = UserAgent.makeURI(`sip:${targetExtension}@${state.serverIp}`);
    
    if (!targetURI) return;

    const inviter = new Inviter(this.userAgent, targetURI);
    
    inviter.stateChange.addListener((sessionState) => {
      if (sessionState === SessionState.Establishing) {
        useAppStore.getState().incrementActiveCalls();
      } else if (sessionState === SessionState.Terminated) {
        useAppStore.getState().decrementActiveCalls();
        db.calls.add({
          direction: 'outgoing',
          number: targetExtension,
          name: 'Contact',
          duration: Math.floor((Date.now() - inviter.startTime!.getTime()) / 1000) || 0,
          timestamp: Date.now(),
          status: 'answered'
        });
      }
    });

    inviter.invite().catch(console.error);
    this.currentSession = inviter;
  }

  public endCall() {
    if (this.currentSession) {
      this.currentSession.bye();
    }
  }

  public stop() {
    if (this.registerer) {
      this.registerer.unregister();
    }
    if (this.userAgent) {
      this.userAgent.stop();
    }
    useAppStore.getState().setConnectionStatus(false);
    useAppStore.getState().setRegistrationStatus('unregistered');
  }
}

export const sipService = new SIPService();