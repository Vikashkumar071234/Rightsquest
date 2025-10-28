from rest_framework import viewsets, permissions
from .models import Lesson, Quiz, Question, Badge
from .serializers import LessonSerializer, QuizSerializer, QuestionSerializer, BadgeSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by('id')
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.AllowAny]
