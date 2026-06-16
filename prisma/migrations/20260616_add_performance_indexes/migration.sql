-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_sessionId_idx" ON "InterviewAnswer"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_questionId_idx" ON "InterviewAnswer"("questionId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_evaluationStatus_idx" ON "InterviewAnswer"("evaluationStatus");

-- CreateIndex
CREATE INDEX "InterviewAnswer_sessionId_evaluationStatus_idx" ON "InterviewAnswer"("sessionId", "evaluationStatus");

-- CreateIndex
CREATE INDEX "InterviewAnswer_createdAt_idx" ON "InterviewAnswer"("createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_createdAt_idx" ON "InterviewSession"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- CreateIndex
CREATE INDEX "Lesson_topicId_idx" ON "Lesson"("topicId");

-- CreateIndex
CREATE INDEX "Lesson_topicId_order_idx" ON "Lesson"("topicId", "order");

-- CreateIndex
CREATE INDEX "LessonPart_lessonId_idx" ON "LessonPart"("lessonId");

-- CreateIndex
CREATE INDEX "LessonPart_lessonId_order_idx" ON "LessonPart"("lessonId", "order");

-- CreateIndex
CREATE INDEX "Question_lessonPartId_idx" ON "Question"("lessonPartId");

-- CreateIndex
CREATE INDEX "Question_level_idx" ON "Question"("level");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Question_lessonPartId_order_idx" ON "Question"("lessonPartId", "order");

-- CreateIndex
CREATE INDEX "Roadmap_userId_idx" ON "Roadmap"("userId");

-- CreateIndex
CREATE INDEX "Roadmap_sessionId_idx" ON "Roadmap"("sessionId");

-- CreateIndex
CREATE INDEX "Roadmap_userId_createdAt_idx" ON "Roadmap"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RoadmapItem_weekId_idx" ON "RoadmapItem"("weekId");

-- CreateIndex
CREATE INDEX "RoadmapItem_weekId_section_idx" ON "RoadmapItem"("weekId", "section");

-- CreateIndex
CREATE INDEX "RoadmapItem_completed_idx" ON "RoadmapItem"("completed");

-- CreateIndex
CREATE INDEX "RoadmapWeek_roadmapId_idx" ON "RoadmapWeek"("roadmapId");

-- CreateIndex
CREATE INDEX "RoadmapWeek_roadmapId_weekNumber_idx" ON "RoadmapWeek"("roadmapId", "weekNumber");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Topic_name_idx" ON "Topic"("name");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_idx" ON "UserAnswer"("userId");

-- CreateIndex
CREATE INDEX "UserAnswer_questionId_idx" ON "UserAnswer"("questionId");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_aiScore_idx" ON "UserAnswer"("userId", "aiScore");

-- CreateIndex
CREATE INDEX "UserAnswer_userId_createdAt_idx" ON "UserAnswer"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserProgress_lessonPartId_idx" ON "UserProgress"("lessonPartId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_completed_idx" ON "UserProgress"("userId", "completed");
