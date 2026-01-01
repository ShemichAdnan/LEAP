-- CreateIndex
CREATE INDEX `messages_conversationId_isRead_isDeleted_idx` ON `messages`(`conversationId`, `isRead`, `isDeleted`);
