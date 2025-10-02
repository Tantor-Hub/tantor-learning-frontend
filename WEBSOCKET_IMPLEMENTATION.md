# WebSocket Chat Implementation

This document describes the WebSocket chat functionality implementation for the Tantor Learning platform.

## 🚀 Features Implemented

### ✅ Real-time Messaging
- **Instant message delivery** via WebSocket connections
- **Automatic fallback** to REST API when WebSocket is unavailable
- **Message threading** and reply functionality
- **Read receipts** and message status tracking

### ✅ Connection Management
- **Auto-connect** when user is authenticated
- **Auto-reconnect** on connection loss
- **Connection status** indicators throughout the UI
- **Graceful degradation** when offline

### ✅ User Experience
- **Real-time notifications** for new messages
- **Online user tracking** and display
- **Typing indicators** (ready for backend implementation)
- **Message composer** with real-time toggle
- **Visual connection status** in all dashboards

## 📁 File Structure

```
src/
├── types/websocket/
│   └── chat.ts                    # WebSocket type definitions
├── hooks/
│   └── useWebSocket.ts            # WebSocket connection hook
├── contexts/
│   └── WebSocketContext.tsx      # Global WebSocket provider
├── components/messages/shared/
│   ├── realtime-notifications.tsx # Connection status & notifications
│   ├── realtime-composer.tsx     # Real-time message composer
│   └── websocket-guide.tsx       # Usage guide component
└── app/
    ├── layout.tsx                 # WebSocket provider integration
    └── (dashboard)/*/messages/    # Updated message pages
```

## 🔧 Implementation Details

### WebSocket Connection
- **URL**: `ws://localhost:3000/chat` (development) / `wss://your-domain.com/chat` (production)
- **Authentication**: JWT token via handshake
- **Namespace**: `/chat`
- **Transport**: WebSocket with polling fallback

### Events Supported

#### Client → Server
- `join_chat` - Join a specific chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a new message
- `send_reply` - Send a reply to existing message
- `mark_as_read` - Mark message as read
- `get_online_users` - Get online users list

#### Server → Client
- `connected` - Connection established
- `new_message` - New message received
- `message_sent` - Message sent confirmation
- `reply_received` - Reply received
- `reply_sent` - Reply sent confirmation
- `joined_chat` - Successfully joined chat
- `left_chat` - Successfully left chat
- `message_read` - Message read by user
- `marked_as_read` - Message marked as read
- `online_users` - List of online users
- `error` - Error messages

## 🎯 Usage

### Basic Setup
The WebSocket functionality is automatically available in all dashboards:

1. **Auto-connection**: Users are automatically connected when authenticated
2. **Visual indicators**: Connection status is shown in the top-right corner
3. **Real-time toggle**: Available in message reply areas

### Sending Messages
```typescript
// Via WebSocket (real-time)
sendMessage({
  id_user_receiver: ['user-id-1', 'user-id-2'],
  subject: 'Optional subject',
  content: 'Message content',
  piece_joint: [] // File attachments
});

// Via REST API (fallback)
// Automatically used when WebSocket is unavailable
```

### Sending Replies
```typescript
// Via WebSocket (real-time)
sendReply({
  id_chat: 'message-id',
  content: 'Reply content',
  is_public: true
});
```

### Using the Hook
```typescript
import { useWebSocketContext } from '@/contexts/WebSocketContext';

function MyComponent() {
  const { 
    isConnected, 
    sendMessage, 
    sendReply, 
    onlineUsers,
    messages,
    replies 
  } = useWebSocketContext();

  // Component logic here
}
```

## 🔄 Integration Points

### Dashboard Pages
- **Admin Messages**: `/admin/messages` - Full WebSocket integration
- **Instructor Messages**: `/instructor/messages` - Full WebSocket integration
- **Student Messages**: `/student/messages` - Ready for integration
- **Secretary Messages**: `/secretary/messages` - Ready for integration

### Message Components
- **MessageTabView**: Enhanced with real-time composer and notifications
- **Message Detail Pages**: Real-time reply functionality with toggle
- **New Message Alerts**: Real-time notification system

## 🛠️ Configuration

### Environment Variables
```env
# Development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_BASE_URL=https://your-api-domain.com
```

### Backend Requirements
Your NestJS backend should implement:
- Socket.IO server with `/chat` namespace
- JWT authentication via handshake
- All the events listed above
- Room-based messaging for chat threads

## 🔒 Security Features

- **JWT Authentication**: All WebSocket connections require valid JWT tokens
- **Input Validation**: All message content is validated before sending
- **Rate Limiting**: Frontend implements debouncing for message sending
- **Secure Transport**: WSS (WebSocket Secure) in production

## 📱 Responsive Design

- **Mobile-friendly**: All WebSocket components are responsive
- **Touch-optimized**: Buttons and interactions work on mobile devices
- **Offline handling**: Graceful degradation when connection is lost

## 🚦 Connection States

### Connected (Green)
- ✅ Real-time messaging available
- ✅ Online users visible
- ✅ Instant notifications
- ✅ Read receipts working

### Disconnected (Red)
- ❌ Falls back to REST API
- ❌ No real-time features
- ❌ Manual refresh needed
- ⚠️ User warned about offline state

### Connecting (Yellow)
- 🔄 Attempting to establish connection
- ⏳ Real-time features temporarily unavailable
- 🔄 Auto-retry in progress

## 🎨 UI Components

### RealtimeNotifications
- Connection status indicator
- Online users count
- Unread messages badge
- Toggle connection button

### RealtimeComposer
- Message composition form
- Real-time/REST API toggle
- File attachment support (ready)
- Keyboard shortcuts (Ctrl+Enter)

### WebSocketGuide
- Feature explanation
- Usage instructions
- Connection troubleshooting
- Collapsible interface

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if backend WebSocket server is running
   - Verify JWT token is valid
   - Check network connectivity

2. **Messages Not Sending**
   - Verify WebSocket connection status
   - Check if recipient IDs are correct
   - Ensure message content is not empty

3. **No Real-time Updates**
   - Check if auto-reconnection is working
   - Verify event listeners are properly attached
   - Check browser console for errors

### Debug Mode
Enable debug logging in development:
```typescript
// In useWebSocket.ts, uncomment console.log statements
console.log('WebSocket event:', eventName, data);
```

## 🚀 Future Enhancements

### Ready for Implementation
- **File attachments** via WebSocket
- **Typing indicators** when users are composing
- **Message reactions** (emoji responses)
- **Voice messages** support
- **Message search** in real-time
- **Push notifications** for mobile devices

### Backend Extensions Needed
- **Message encryption** for sensitive data
- **Message history** pagination via WebSocket
- **User presence** detailed status (away, busy, etc.)
- **Group chat** functionality
- **Message forwarding** between users

## 📊 Performance Considerations

- **Connection pooling**: Single WebSocket connection per user
- **Event debouncing**: Prevents spam and reduces server load
- **Memory management**: Automatic cleanup of event listeners
- **Efficient re-renders**: Optimized React state updates
- **Lazy loading**: Components load only when needed

## 🎯 Testing

### Manual Testing Checklist
- [ ] Connection establishes automatically on login
- [ ] Messages send in real-time when toggle is enabled
- [ ] Fallback to REST API works when WebSocket is disabled
- [ ] Notifications appear for new messages
- [ ] Online users count updates correctly
- [ ] Connection status indicators work properly
- [ ] Auto-reconnection works after network interruption

### Integration Testing
- [ ] Multiple users can chat simultaneously
- [ ] Message threading works correctly
- [ ] Read receipts are properly tracked
- [ ] Room joining/leaving functions properly

This implementation provides a solid foundation for real-time chat functionality across all dashboards in the Tantor Learning platform.
