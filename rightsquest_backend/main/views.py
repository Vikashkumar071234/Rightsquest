# rightsquest_backend/main/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Lesson, Quiz, Question, Badge, Progress
from .serializers import (
    LessonSerializer, QuizSerializer, QuestionSerializer,
    BadgeSerializer, ProgressSerializer
)

# ---------- AUTHENTICATION ----------

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)


# ---------- LESSONS ----------

class LessonList(generics.ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]


class LessonDetail(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


# ---------- QUIZZES ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_questions(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    questions = Question.objects.filter(quiz=quiz)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_quiz(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    user_answers = request.data.get('answers', {})  # { "question_id": "A", ... }
    score = 0
    for qid_str, answer in user_answers.items():
        try:
            q = Question.objects.get(id=int(qid_str))
            if getattr(q, 'correct_option', None) == answer:
                score += 1
        except Question.DoesNotExist:
            continue

    # create or update Progress (assuming Progress model links user and quiz or user+lesson)
    # adjust according to your Progress model fields
    Progress.objects.create(user=request.user, lesson=quiz.lesson, score=score)

    return Response({"score": score}, status=status.HTTP_200_OK)


# ---------- BADGES ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_badges(request):
    badges = Badge.objects.all()
    serializer = BadgeSerializer(badges, many=True)
    return Response(serializer.data)


# ---------- PROGRESS ----------

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_progress(request):
    progress = Progress.objects.filter(user=request.user)
    serializer = ProgressSerializer(progress, many=True)
    return Response(serializer.data)
