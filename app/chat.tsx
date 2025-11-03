import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useChatStore, User, Message } from '../src/store/chatStore';
import { useChatWebSocketStore } from '../src/store/chatWebSocketStore';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { 
    getChatById, 
    getMessagesByChatId, 
    sendMessage,
    addMessage,
    markAsRead, 
    setCurrentChat 
  } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const { 
    socket,
    isConnected, 
    connect, 
    disconnect, 
    joinConversation, 
    leaveConversation, 
    sendMessage: sendWebSocketMessage 
  } = useChatWebSocketStore();
  
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const chat = chatId ? getChatById(chatId) : null;
  const messages = chatId ? getMessagesByChatId(chatId) : [];

  // Connexion WebSocket
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Rejoindre/quitter la conversation
  useEffect(() => {
    if (chatId && isConnected) {
      joinConversation(chatId);
    }
    
    return () => {
      if (chatId) {
        leaveConversation(chatId);
      }
    };
  }, [chatId, isConnected, joinConversation, leaveConversation]);

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      if (__DEV__) {
        console.log('📨 Nouveau message reçu:', message);
      }

      // Convertir le message du format WebSocket au format du store
      const chatMessage: Message = {
        id: message.id,
        chatId: chatId || undefined,
        senderId: message.senderId,
        senderUsername: message.senderUsername,
        content: message.content,
        timestamp: typeof message.createdAt === 'string' 
          ? new Date(message.createdAt).getTime() 
          : new Date(message.createdAt).getTime(),
        isRead: message.isRead || false,
        conversationToken: message.conversationToken,
      };

      addMessage(chatId || '', chatMessage);
      
      // Scroll vers le bas
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, chatId, addMessage]);

  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
      markAsRead(chatId);
    }
    
    return () => {
      setCurrentChat(null);
    };
  }, [chatId, setCurrentChat, markAsRead]);

  useEffect(() => {
    if (chat && currentUser) {
      if (chat.isGroup) {
        // Pour les groupes, on ne définit pas d'utilisateur spécifique
        setOtherUser(null);
      } else {
        const other = chat.participants.find(p => p.id !== currentUser._id?.toString());
        setOtherUser(other || null);
      }
    }
  }, [chat, currentUser]);

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !chatId || !currentUser) return;

    // Envoyer via WebSocket si connecté, sinon via le store local
    if (isConnected) {
      sendWebSocketMessage(chatId, messageText.trim());
    } else {
      sendMessage(chatId, messageText.trim(), currentUser._id?.toString() || '');
    }
    
    setMessageText('');
    
    // Scroll vers le bas après l'envoi
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messageText, chatId, currentUser, sendMessage, sendWebSocketMessage, isConnected]);

  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  const renderMessage = useCallback(({ item }: { item: any }) => {
    const isCurrentUser = item.senderId === currentUser?._id?.toString();
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.currentUserTime : styles.otherUserTime
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  }, [currentUser, formatTime]);

  if (!chat) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conversation introuvable</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>
            {chat?.isGroup ? (chat.groupAvatar || '👥') : (otherUser?.avatar || '👤')}
          </Text>
          <View>
            <Text style={styles.userName}>
              {chat?.isGroup ? (chat.groupName || 'Groupe') : (otherUser?.username || 'Utilisateur')}
            </Text>
            <Text style={styles.userStatus}>
              {chat?.isGroup ? `${chat.participants.length} membre(s)` : (isConnected ? 'En ligne' : 'Hors ligne')}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Tapez votre message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  userStatus: {
    fontSize: 14,
    color: '#27ae60',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  currentUserBubble: {
    backgroundColor: '#3498db',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: '#2c3e50',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherUserTime: {
    color: '#7f8c8d',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#2c3e50',
  },
  sendButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
