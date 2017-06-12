package com.mikhail.chat;


import com.mikhail.chat.dto.ChatMessage;
import com.mikhail.chat.dto.transform.ChatMessageDecoder;
import com.mikhail.chat.dto.transform.ChatMessageEncoder;

import javax.websocket.EncodeException;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@ServerEndpoint(value = "/room", encoders = ChatMessageEncoder.class, decoders = ChatMessageDecoder.class)
public class ChatEndpoint {
    private final Logger log = Logger.getLogger(getClass().getName());

    @OnOpen
    public void open(final Session session) {
        log.info("session opened");
    }

    @OnMessage
    public void onMessage(final Session currentSession, final ChatMessage chatMessage) {
        try {
            for (Session session : currentSession.getOpenSessions()) {
                if (session.isOpen()) {
                    session.getBasicRemote().sendObject(chatMessage);
                }
            }
        } catch (IOException | EncodeException e) {
            log.log(Level.WARNING, "onMessage failed", e);
        }
    }
}